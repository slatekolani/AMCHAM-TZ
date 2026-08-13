<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContentReviewedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $contentType,
        public string $title,
        public string $status,
        public ?string $rejectionReason = null,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)->subject("Your {$this->contentType} was {$this->status}");

        if ($this->status === 'published') {
            $message->line("Good news — your {$this->contentType} \"{$this->title}\" has been approved and published.");
        } else {
            $message->line("Your {$this->contentType} \"{$this->title}\" was not approved for publication.");
            if ($this->rejectionReason) {
                $message->line("Reason: {$this->rejectionReason}");
            }
        }

        return $message->action('Open member portal', url('/member-portal'));
    }
}
