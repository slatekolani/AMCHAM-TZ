<?php

namespace App\Notifications;

use App\Models\EventRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventRegistrationNotification extends Notification
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

        return (new MailMessage)
            ->subject("New registration: {$registration->event->title}")
            ->greeting('New event registration')
            ->line("{$registration->name} has registered for {$registration->event->title}.")
            ->line("Email: {$registration->email}")
            ->line("Phone: {$registration->phone}")
            ->when($registration->company, fn (MailMessage $mail) => $mail->line("Company: {$registration->company}"))
            ->action('View registrations', route('admin.event-registrations.index'));
    }
}
