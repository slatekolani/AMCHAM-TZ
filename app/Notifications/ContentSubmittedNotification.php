<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContentSubmittedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $contentType,
        public string $title,
        public string $companyName,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("New {$this->contentType} submitted for review")
            ->line("{$this->companyName} submitted a {$this->contentType} titled \"{$this->title}\" for review.")
            ->action('Review submission', url('/admin'))
            ->line('Please review it in the AMCHAM Tanzania admin dashboard.');
    }
}
