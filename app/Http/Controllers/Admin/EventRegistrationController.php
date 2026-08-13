<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Notifications\EventRegistrationDecisionNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class EventRegistrationController extends Controller
{
    public function index(Request $request): Response
    {
        $eventId = $request->integer('event_id');
        $status = $request->string('status')->toString();

        return Inertia::render('Admin/EventRegistrations/Index', [
            'registrations' => EventRegistration::with('event:id,title,starts_at')
                ->when($eventId, fn ($query) => $query->where('event_id', $eventId))
                ->when($status, fn ($query) => $query->where('status', $status))
                ->latest()
                ->get(),
            'events' => Event::has('registrations')->orderBy('starts_at', 'desc')->get(['id', 'title']),
            'filters' => ['event_id' => $eventId ?: '', 'status' => $status],
        ]);
    }

    public function approve(EventRegistration $eventRegistration): RedirectResponse
    {
        $eventRegistration->update([
            'status' => 'approved',
            'rejection_reason' => null,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        $this->notifyRegistrant($eventRegistration);

        return back()->with('success', "{$eventRegistration->name} approved and notified by email.");
    }

    public function reject(Request $request, EventRegistration $eventRegistration): RedirectResponse
    {
        $data = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:1000'],
        ]);

        $eventRegistration->update([
            'status' => 'rejected',
            'rejection_reason' => $data['rejection_reason'] ?? null,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        $this->notifyRegistrant($eventRegistration);

        return back()->with('success', "{$eventRegistration->name} rejected and notified by email.");
    }

    public function export(Request $request): StreamedResponse
    {
        $eventId = $request->integer('event_id');
        $registrations = EventRegistration::with('event:id,title,starts_at')
            ->when($eventId, fn ($query) => $query->where('event_id', $eventId))
            ->latest()
            ->get();

        return response()->streamDownload(function () use ($registrations) {
            $output = fopen('php://output', 'w');
            fwrite($output, "\xEF\xBB\xBF");
            fputcsv($output, ['Event', 'Event date', 'Name', 'Email', 'Phone', 'Company', 'Job title', 'Status', 'Notes', 'Registered at']);

            foreach ($registrations as $registration) {
                fputcsv($output, [
                    $registration->event->title,
                    $registration->event->starts_at?->format('Y-m-d H:i'),
                    $registration->name,
                    $registration->email,
                    $registration->phone,
                    $registration->company,
                    $registration->job_title,
                    $registration->status,
                    $registration->notes,
                    $registration->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($output);
        }, 'event-registrations-' . now()->format('Y-m-d') . '.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    private function notifyRegistrant(EventRegistration $registration): void
    {
        Notification::route('mail', $registration->email)
            ->notify(new EventRegistrationDecisionNotification($registration));
    }
}
