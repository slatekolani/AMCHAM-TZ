<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class EventsController extends Controller
{
    public function index(Request $request): Response
    {
        $now = now();
        $category = $request->string('category')->toString() ?: null;
        $search = $request->string('q')->toString() ?: null;
        $base = Event::published()->publicAudience();
        $hasFilters = (bool) ($category || $search);
        $featured = ! $hasFilters
            ? (clone $base)->with('company')->where('starts_at', '>=', $now)->orderBy('starts_at')->first()
            : null;

        $events = (clone $base)->with('company')
            ->when($category, fn ($query) => $query->where('category', $category))
            ->when($search, fn ($query) => $query->where(function ($inner) use ($search) {
                $inner->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            }))
            ->orderByRaw('CASE WHEN starts_at >= ? THEN 0 ELSE 1 END', [$now])
            ->orderByRaw('CASE WHEN starts_at >= ? THEN starts_at END ASC', [$now])
            ->orderByRaw('CASE WHEN starts_at < ? THEN starts_at END DESC', [$now])
            ->paginate(12)->withQueryString();

        return Inertia::render('Public/Events', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'events' => $events,
            'featured' => $request->integer('page', 1) === 1 ? $featured : null,
            'categories' => (clone $base)->whereNotNull('category')->distinct()->orderBy('category')->pluck('category'),
            'filters' => ['category' => $category, 'q' => $search],
        ]);
    }

    public function show(Request $request, Event $event): Response
    {
        abort_unless($event->status === 'published' && $event->isVisibleTo($request->user()), 404);

        return Inertia::render('Public/EventShow', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'event' => $event->load('company'),
        ]);
    }
}
