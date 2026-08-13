<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PublicationAnnouncement extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $contentType,
        public string $title,
        public ?string $description,
        public string $url,
    ) {
        $this->afterCommit();
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject("New {$this->contentType}: {$this->title}")
            ->greeting('Hello,')
            ->line("AMCHAM Tanzania has published a new {$this->contentType}:")
            ->line($this->title);

        if ($this->description) {
            $message->line(strip_tags($this->description));
        }

        return $message
            ->action('View on AMCHAM Tanzania', $this->url)
            ->line('You are receiving this email as an AMCHAM Tanzania member company contact or website subscriber.');
    }
}
