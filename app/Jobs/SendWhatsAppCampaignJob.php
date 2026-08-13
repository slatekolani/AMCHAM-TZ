<?php

namespace App\Jobs;

use App\Models\Company;
use App\Models\NotificationLog;
use App\Models\WhatsAppCampaign;
use App\Services\Notifications\WhatsAppProviderContract;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendWhatsAppCampaignJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public WhatsAppCampaign $campaign)
    {
    }

    public function handle(WhatsAppProviderContract $provider): void
    {
        $this->campaign->update(['status' => 'sending']);

        foreach ($this->resolveRecipients() as $phone) {
            $result = $provider->send($phone, $this->campaign->message);

            NotificationLog::create([
                'campaign_id' => $this->campaign->id,
                'campaign_type' => WhatsAppCampaign::class,
                'channel' => 'whatsapp',
                'recipient' => $phone,
                'status' => $result['status'],
                'provider_response' => $result['response'],
                'sent_at' => $result['status'] === 'sent' ? now() : null,
            ]);
        }

        $this->campaign->update(['status' => 'sent', 'sent_at' => now()]);
    }

    /**
     * WhatsApp recipients are approved member companies with a phone number on file.
     *
     * @return array<int, string>
     */
    private function resolveRecipients(): array
    {
        return Company::where('status', 'approved')
            ->whereNotNull('phone')
            ->pluck('phone')
            ->unique()
            ->values()
            ->all();
    }
}
