<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\NewsArticle;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PortalController extends Controller
{
    public function index(): Response
    {
        $company = Auth::user()->company?->load('latestInvoice');

        return Inertia::render('Member/Portal', [
            'company' => $company,
            'stats' => [
                'newsDraft' => NewsArticle::where('company_id', $company?->id)->where('status', 'draft')->count(),
                'newsPending' => NewsArticle::where('company_id', $company?->id)->where('status', 'pending_review')->count(),
                'newsPublished' => NewsArticle::where('company_id', $company?->id)->where('status', 'published')->count(),
                'eventsPending' => Event::where('company_id', $company?->id)->where('status', 'pending_review')->count(),
                'eventsPublished' => Event::where('company_id', $company?->id)->where('status', 'published')->count(),
            ],
        ]);
    }
}
