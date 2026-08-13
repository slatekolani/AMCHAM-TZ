<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Notifications\ContentReviewedNotification;
use App\Support\HtmlSanitizer;
use App\Support\EventDateTime;
use App\Support\PublicationNotifier;
use App\Support\PublicImageUpload;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function __construct(private PublicationNotifier $publicationNotifier)
    {
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Events/Index', [
            'events' => Event::with('company')
                ->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status))
                ->orderBy('starts_at', 'desc')
                ->get(),
            'filters' => ['status' => $request->string('status')->toString()],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Events/Edit', ['event' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data = $this->storeCoverImage($request, $data);
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);
        $data['published_at'] = $data['status'] === 'published' ? now() : null;

        $event = Event::create($data);

        if ($event->status === 'published') {
            $this->publicationNotifier->event($event);
        }

        return redirect()->route('admin.events.index')->with('success', 'Event created.');
    }

    public function edit(Event $event): Response
    {
        return Inertia::render('Admin/Events/Edit', ['event' => $event]);
    }

    public function update(Request $request, Event $event): RedirectResponse
    {
        $wasPublished = $event->status === 'published';
        $data = $this->storeCoverImage($request, $this->validated($request), $event->cover_image_path);
        if (! $wasPublished && $data['status'] === 'published') {
            $data['published_at'] = now();
        }
        $event->update($data);

        if (! $wasPublished && $event->status === 'published') {
            $this->publicationNotifier->event($event);
        }

        return redirect()->route('admin.events.index')->with('success', 'Event updated.');
    }

    public function approve(Event $event): RedirectResponse
    {
        $event->update([
            'status' => 'published',
            'published_at' => $event->published_at ?? now(),
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'rejection_reason' => null,
        ]);

        $this->notifyOrganizer($event, 'published');
        $this->publicationNotifier->event($event);

        return back()->with('success', 'Event approved and published.');
    }

    public function reject(Request $request, Event $event): RedirectResponse
    {
        $data = $request->validate(['rejection_reason' => ['required', 'string', 'max:1000']]);

        $event->update([
            'status' => 'rejected',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'rejection_reason' => $data['rejection_reason'],
        ]);

        $this->notifyOrganizer($event, 'rejected');

        return back()->with('success', 'Event rejected.');
    }

    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();

        return back()->with('success', 'Event removed.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'category' => ['nullable', 'string', 'max:255'],
            'registration_url' => ['nullable', 'url:http,https', 'max:255'],
            'company_id' => ['nullable', 'exists:companies,id'],
            'status' => ['required', 'in:draft,published'],
            'audience' => ['required', 'in:public,members'],
        ]);

        $data['description'] = HtmlSanitizer::clean($data['description'] ?? null);
        $data['starts_at'] = EventDateTime::fromLocalInput($data['starts_at']);
        $data['ends_at'] = EventDateTime::fromLocalInput($data['ends_at'] ?? null);

        return $data;
    }

    private function storeCoverImage(Request $request, array $data, ?string $oldPath = null): array
    {
        unset($data['cover_image']);
        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = PublicImageUpload::replace($request->file('cover_image'), 'events', $oldPath);
        }

        return $data;
    }

    private function notifyOrganizer(Event $event, string $status): void
    {
        $organizerUser = $event->company?->users()->first();

        if ($organizerUser) {
            $organizerUser->notify(new ContentReviewedNotification('event', $event->title, $status, $event->rejection_reason));
        }
    }
}
