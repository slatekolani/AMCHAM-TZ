<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\MembershipTier;
use App\Models\Page;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class MembershipController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/Membership', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'page' => Page::where('slug', 'membership-intro')->first(),
            'membershipTiers' => MembershipTier::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }
}
