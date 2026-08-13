<?php

namespace App\Notifications;

use App\Models\EventRegistration;
use App\Support\EventDateTime;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventRegistrationDecisionNotification extends Notification
{
    use Queueable;

    public function __construct(public EventRegistration $registration)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $registration = $this->registration;
        $event = $registration->event;

        if ($registration->status === 'approved') {
            $mail = (new MailMessage)
                ->subject("You're confirmed: {$event->title}")
                ->greeting("Hello {$registration->name},")
                ->line("Great news — your registration for \"{$event->title}\" has been approved.")
                ->line('Date: ' . $event->starts_at->timezone(EventDateTime::TIMEZONE)->format('F j, Y g:i A') . ' (East Africa Time)');

            if ($event->location) {
                $mail->line("Location: {$event->location}");
            }

            return $mail->action('View event details', route('events.show', $event->slug))
                ->line('We look forward to seeing you there.');
        }

        $mail = (new MailMessage)
            ->subject("Update on your registration: {$event->title}")
            ->greeting("Hello {$registration->name},")
            ->line("Thank you for your interest in \"{$event->title}\".")
            ->line('We are unable to confirm your registration for this event at this time.');

        if ($registration->rejection_reason) {
            $mail->line("Reason: {$registration->rejection_reason}");
        }

        return $mail->line('We hope to see you at a future AMCHAM Tanzania event.');
    }
}
