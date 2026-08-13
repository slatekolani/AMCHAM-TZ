<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\User;
use App\Notifications\ContentSubmittedNotification;
use App\Support\HtmlSanitizer;
use App\Support\EventDateTime;
use App\Support\PublicImageUpload;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function __construct()
    {
        $this->middleware(function (Request $request, \Closure $next) {
            $company = Auth::user()->company;
            abort_unless($company?->hasPublishingAccess(), 403, 'Publishing events is available to Platinum tier members only.');

            return $next($request);
        });
    }

    public function index(): Response
    {
        return Inertia::render('Member/Events/Index', [
            'events' => Event::where('company_id', Auth::user()->company_id)->latest('starts_at')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Member/Events/Edit', ['event' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data = $this->storeCoverImage($request, $data);
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);
        $data['company_id'] = Auth::user()->company_id;
        $data['status'] = 'draft';

        Event::create($data);

        return redirect()->route('member.events.index')->with('success', 'Draft saved.');
    }

    public function edit(Event $event): Response
    {
        $this->authorizeOwner($event);

        return Inertia::render('Member/Events/Edit', ['event' => $event]);
    }

    public function update(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeOwner($event);
        abort_unless(in_array($event->status, ['draft', 'rejected']), 403);

        $data = $this->storeCoverImage($request, $this->validated($request), $event->cover_image_path);
        $event->update($data);

        return redirect()->route('member.events.index')->with('success', 'Draft updated.');
    }

    public function submit(Event $event): RedirectResponse
    {
        $this->authorizeOwner($event);
        abort_unless(in_array($event->status, ['draft', 'rejected']), 403);

        $event->update(['status' => 'pending_review', 'rejection_reason' => null]);

        Notification::send(
            User::role(['admin', 'super-admin'])->get(),
            new ContentSubmittedNotification('event', $event->title, Auth::user()->company->name)
        );

        return redirect()->route('member.events.index')->with('success', 'Event submitted for review.');
    }

    public function destroy(Event $event): RedirectResponse
    {
        $this->authorizeOwner($event);
        abort_unless(in_array($event->status, ['draft', 'rejected']), 403);

        $event->delete();

        return back()->with('success', 'Draft removed.');
    }

    private function authorizeOwner(Event $event): void
    {
        abort_unless($event->company_id === Auth::user()->company_id, 403);
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
}
