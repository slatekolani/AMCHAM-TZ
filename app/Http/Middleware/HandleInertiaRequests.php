<?php

namespace App\Http\Middleware;

use App\Models\Event;
use App\Models\NewsArticle;
use App\Models\OurWorkItem;
use App\Models\PolicyUpdate;
use App\Models\Resource;
use App\Models\Setting;
use App\Models\WorkingGroup;
use App\Support\WebsiteCopy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        // Always the brand logo, never a hero/event photo — link-share previews should show
        // the chamber's mark, not whichever photo happens to be first in the carousel.
        $seoFallbackImage = '/images/brand/amcham-logo-white-bg.png';

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'roles' => $user ? $user->getRoleNames() : [],
                'canPublish' => $user?->company?->hasPublishingAccess() ?? false,
                'canTestimonial' => $user?->company?->canSubmitTestimonial() ?? false,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'site' => fn () => Cache::remember('site.public-settings', 300, fn () => Setting::whereIn('key', [
                'social_linkedin', 'social_twitter', 'social_facebook', 'social_instagram',
                'site_name', 'site_tagline', 'contact_email', 'contact_phone', 'contact_address',
            ])->pluck('value', 'key')),
            'cms' => fn () => WebsiteCopy::values(),
            'seo' => [
                'baseUrl' => rtrim($request->getSchemeAndHttpHost(), '/'),
                'siteName' => 'AMCHAM Tanzania',
                'defaultImage' => $seoFallbackImage,
            ],
            'nav' => fn () => [
                    'events' => Event::published()
                        ->upcoming()
                        ->orderBy('starts_at')
                        ->take(4)
                        ->get(['id', 'title', 'slug', 'location', 'starts_at', 'cover_image_path', 'category']),
                    'eventsTotal' => Event::published()->upcoming()->count(),
                    'articles' => NewsArticle::published()
                        ->orderByDesc('published_at')
                        ->take(5)
                        ->get(['id', 'uuid', 'title', 'slug', 'excerpt', 'category', 'published_at', 'cover_image_path']),
                    'articlesTotal' => NewsArticle::published()->count(),
                    'newsletters' => Resource::whereRaw('LOWER(category) = ?', ['newsletter'])
                        ->latest()
                        ->take(5)
                        ->get(['id', 'uuid', 'title', 'description', 'cover_image_path', 'created_at']),
                    'newslettersTotal' => Resource::whereRaw('LOWER(category) = ?', ['newsletter'])->count(),
                    'policyUpdates' => PolicyUpdate::published()
                        ->orderByDesc('published_at')
                        ->take(5)
                        ->get(['id', 'uuid', 'title', 'slug', 'summary', 'cover_image_path', 'published_at']),
                    'policyUpdatesTotal' => PolicyUpdate::published()->count(),
                    'ourWorkItems' => OurWorkItem::published()
                        ->orderBy('sort_order')
                        ->get(['id', 'uuid', 'title', 'slug', 'summary', 'cover_image_path']),
                    'workingGroups' => WorkingGroup::published()
                        ->orderBy('sort_order')
                        ->take(5)
                        ->get(['id', 'uuid', 'title', 'slug', 'summary', 'cover_image_path']),
                    'workingGroupsTotal' => WorkingGroup::published()->count(),
                ],
        ];
    }
}
