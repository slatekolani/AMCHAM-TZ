<?php

namespace App\Services\Notifications;

interface WhatsAppProviderContract
{
    /**
     * Send a WhatsApp message. Returns ['status' => 'sent'|'failed', 'response' => string].
     *
     * @return array{status: string, response: string}
     */
    public function send(string $to, string $message): array;
}
