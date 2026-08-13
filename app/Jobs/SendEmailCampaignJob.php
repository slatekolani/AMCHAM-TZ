<?php

namespace App\Jobs;

use App\Mail\CampaignMail;
use App\Models\EmailCampaign;
use App\Models\NotificationLog;
use App\Models\Subscriber;
use App\Models\User;
use App\Support\EmailSafety;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendEmailCampaignJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public EmailCampaign $campaign)
    {
    }

    public function handle(): void
    {
        $this->campaign->update(['status' => 'sending']);

        foreach ($this->resolveRecipients() as $email) {
            // Re-validate at the send sink, independently of whatever check the
            // email passed at input time (see App\Support\EmailSafety) — this is
            // the app's last line of defense against CRLF/header-injection via
            // Laravel's own email validation rule (GHSA-5vg9-5847-vvmq).
            if (! EmailSafety::isSafe($email)) {
                NotificationLog::create([
                    'campaign_id' => $this->campaign->id,
                    'campaign_type' => EmailCampaign::class,
                    'channel' => 'email',
                    'recipient' => $email,
                    'status' => 'failed',
                    'provider_response' => 'Rejected: recipient failed independent email safety check.',
                ]);

                continue;
            }

            try {
                Mail::to($email)->send(new CampaignMail($this->campaign->subject, $this->campaign->body));

                NotificationLog::create([
                    'campaign_id' => $this->campaign->id,
                    'campaign_type' => EmailCampaign::class,
                    'channel' => 'email',
                    'recipient' => $email,
                    'status' => 'sent',
                    'sent_at' => now(),
                ]);
            } catch (Throwable $exception) {
                NotificationLog::create([
                    'campaign_id' => $this->campaign->id,
                    'campaign_type' => EmailCampaign::class,
                    'channel' => 'email',
                    'recipient' => $email,
                    'status' => 'failed',
                    'provider_response' => $exception->getMessage(),
                ]);
            }
        }

        $this->campaign->update(['status' => 'sent', 'sent_at' => now()]);
    }

    /**
     * @return array<int, string>
     */
    private function resolveRecipients(): array
    {
        $emails = collect();

        if (in_array($this->campaign->audience, ['subscribers', 'all'], true)) {
            $emails = $emails->merge(Subscriber::subscribed()->pluck('email'));
        }

        if (in_array($this->campaign->audience, ['members', 'all'], true)) {
            $emails = $emails->merge(User::whereNotNull('company_id')->pluck('email'));
        }

        return $emails->unique()->filter()->values()->all();
    }
}
