<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MemberEventsController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        return Inertia::render('Member/MemberEvents/Index', [
            'events' => Event::published()
                ->visibleTo($user)
                ->where('starts_at', '>=', now())
                ->orderBy('starts_at')
                ->get(['id', 'uuid', 'title', 'slug', 'description', 'starts_at', 'location', 'category', 'audience', 'cover_image_path']),
        ]);
    }
}
