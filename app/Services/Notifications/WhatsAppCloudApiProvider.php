<?php

namespace App\Services\Notifications;

use GuzzleHttp\Client;
use Throwable;

/**
 * Meta WhatsApp Cloud API (https://developers.facebook.com/docs/whatsapp/cloud-api)
 * — the standard WhatsApp Business integration referenced in the AMCHAM
 * proposal (~TZS 9/message). Requires WHATSAPP_PHONE_NUMBER_ID and
 * WHATSAPP_ACCESS_TOKEN in .env. Activate by setting WHATSAPP_PROVIDER=cloud_api.
 *
 * Note: Meta only allows freeform text messages within a 24-hour customer
 * service window. Broadcast campaigns outside that window require a
 * pre-approved message template — template management is not implemented here.
 */
class WhatsAppCloudApiProvider implements WhatsAppProviderContract
{
    public function __construct(
        private readonly string $phoneNumberId,
        private readonly string $accessToken,
    ) {
    }

    public function send(string $to, string $message): array
    {
        $client = new Client(['base_uri' => 'https://graph.facebook.com/v19.0/']);

        try {
            $response = $client->post("{$this->phoneNumberId}/messages", [
                'headers' => ['Authorization' => "Bearer {$this->accessToken}"],
                'json' => [
                    'messaging_product' => 'whatsapp',
                    'to' => $to,
                    'type' => 'text',
                    'text' => ['body' => $message],
                ],
            ]);

            return ['status' => 'sent', 'response' => (string) $response->getBody()];
        } catch (Throwable $exception) {
            return ['status' => 'failed', 'response' => $exception->getMessage()];
        }
    }
}
