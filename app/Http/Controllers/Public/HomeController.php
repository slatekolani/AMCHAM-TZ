<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\BoardMember;
use App\Models\Company;
use App\Models\Event;
use App\Models\Media;
use App\Models\MembershipTier;
use App\Models\NewsArticle;
use App\Models\Page;
use App\Models\Setting;
use App\Models\Testimonial;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $eventWindowEndsAt = now()->addMonths(2);

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'page' => Page::where('slug', 'home')->first(),
            'heroEvents' => Event::published()->upcoming()->orderBy('starts_at')->take(5)->get(),
            'heroEventsTotal' => Event::published()->upcoming()->count(),
            'upcomingEvents' => Event::published()
                ->upcoming()
                ->where('starts_at', '<=', $eventWindowEndsAt)
                ->orderBy('starts_at')
                ->take(2)
                ->get(),
            'latestNews' => NewsArticle::published()->latest('published_at')->take(6)->get(),
            'boardMembers' => BoardMember::where('is_active', true)->orderBy('sort_order')->get(),
            // Testimonials are published anonymously — never send the company relation to the public page.
            'testimonials' => Testimonial::where('is_active', true)->latest()->get(['id', 'uuid', 'quote']),
            'membershipTiers' => MembershipTier::where('is_active', true)->orderBy('sort_order')->get(),
            'featuredCompanies' => Company::where('status', 'approved')->with('membershipTier')->orderBy('name')->get(),
            'galleryImages' => $this->galleryImages(),
            'heroCarousel' => [
                'slides' => json_decode(Setting::get('hero_carousel_slides', '[]'), true) ?: [],
                'taglineLineOne' => Setting::get('hero_tagline_line_one', 'Two markets.'),
                'taglineLineTwo' => Setting::get('hero_tagline_line_two', 'One chamber.'),
                'originLabel' => Setting::get('hero_origin_label', 'United States'),
                'destinationLabel' => Setting::get('hero_destination_label', 'Tanzania'),
                'autoAdvanceMs' => (int) Setting::get('hero_auto_advance_ms', 6500),
                'corridorDurationMs' => (int) Setting::get('hero_corridor_duration_ms', 3400),
            ],
        ]);
    }

    /**
     * Images for the bilateral panel, drawn from the same sources as the gallery page
     * (uploaded media plus event covers) and reshuffled on every request so the homepage
     * shows a different pairing each visit.
     */
    private function galleryImages(): Collection
    {
        // toBase() matters: mapping an *empty* Eloquent collection returns an Eloquent
        // collection, and unique() would then call getKey() on these plain strings.
        $uploaded = Media::query()
            ->where('mime_type', 'like', 'image/%')
            ->latest()
            ->take(40)
            ->get()
            ->map(fn (Media $item) => $item->url)
            ->toBase();

        $eventCovers = Event::published()
            ->whereNotNull('cover_image_path')
            ->latest('starts_at')
            ->take(40)
            ->pluck('cover_image_path');

        return $uploaded
            ->concat($eventCovers)
            ->filter()
            ->unique()
            ->shuffle()
            ->take(6)
            ->values();
    }
}
