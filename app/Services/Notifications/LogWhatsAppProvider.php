<?php

namespace App\Services\Notifications;

use Illuminate\Support\Facades\Log;

/**
 * Default WhatsApp driver — logs instead of sending. Active whenever
 * WHATSAPP_PROVIDER is unset or "log" in .env. Switch to
 * WhatsAppCloudApiProvider once Meta Cloud API credentials are configured.
 */
class LogWhatsAppProvider implements WhatsAppProviderContract
{
    public function send(string $to, string $message): array
    {
        Log::info("[WhatsApp:log] To: {$to} | Message: {$message}");

        return ['status' => 'sent', 'response' => 'Logged only — no live WhatsApp provider configured.'];
    }
}
