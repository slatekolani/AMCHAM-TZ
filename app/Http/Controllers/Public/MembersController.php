<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class MembersController extends Controller
{
    public function index(Request $request): Response
    {
        $sector = $request->string('sector')->toString() ?: null;
        $search = $request->string('q')->toString() ?: null;
        $base = Company::query()->where('status', 'approved');

        $members = (clone $base)->with('membershipTier')
            ->when($sector, fn ($query) => $query->where('sector', $sector))
            ->when($search, fn ($query) => $query->where(function ($inner) use ($search) {
                $inner->where('name', 'like', "%{$search}%")
                    ->orWhere('sector', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            }))
            ->orderBy('name')->paginate(12)->withQueryString();

        return Inertia::render('Public/Members', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'members' => $members,
            'sectors' => (clone $base)->whereNotNull('sector')->distinct()->orderBy('sector')->pluck('sector'),
            'summary' => [
                'members' => (clone $base)->count(),
                'sectors' => (clone $base)->whereNotNull('sector')->distinct()->count('sector'),
                'tiers' => (clone $base)->whereNotNull('membership_tier_id')->distinct()->count('membership_tier_id'),
            ],
            'filters' => ['sector' => $sector, 'q' => $search],
        ]);
    }

    public function show(Company $company): Response
    {
        // Pending and suspended companies must not be reachable by guessing a slug.
        abort_unless($company->status === 'approved', 404);

        return Inertia::render('Public/MemberShow', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'member' => $company->load('membershipTier'),
            'news' => $company->newsArticles()
                ->published()
                ->latest('published_at')
                ->take(6)
                ->get(['id', 'uuid', 'title', 'slug', 'excerpt', 'category', 'published_at', 'cover_image_path', 'body']),
            'events' => $company->events()
                ->published()
                ->latest('starts_at')
                ->take(6)
                ->get(['id', 'uuid', 'title', 'slug', 'description', 'location', 'starts_at', 'cover_image_path', 'category', 'published_at', 'created_at']),
        ]);
    }
}
