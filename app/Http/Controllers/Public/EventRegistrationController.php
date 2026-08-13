<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\User;
use App\Notifications\EventRegistrationNotification;
use App\Rules\SafeEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;

class EventRegistrationController extends Controller
{
    public function store(Request $request, Event $event): RedirectResponse
    {
        abort_unless($event->status === 'published' && $event->isVisibleTo($request->user()), 404);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                new SafeEmail(),
                Rule::unique('event_registrations')->where(fn ($query) => $query->where('event_id', $event->id)),
            ],
            'phone' => ['required', 'string', 'max:50'],
            'company' => ['nullable', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $registration = $event->registrations()->create($data);
        $registration->setRelation('event', $event);

        Notification::send(
            User::whereHas('roles', fn ($query) => $query->whereIn('name', ['admin', 'super-admin']))->get(),
            new EventRegistrationNotification($registration),
        );

        return back()->with('success', 'Your event registration has been received and is pending review. We will email you once it is confirmed.');
    }
}
