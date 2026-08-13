<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Event;
use App\Models\NewsArticle;
use App\Models\Subscriber;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'pendingCompanies' => Company::where('status', 'pending')->count(),
                'pendingNews' => NewsArticle::where('status', 'pending_review')->count(),
                'pendingEvents' => Event::where('status', 'pending_review')->count(),
                'approvedCompanies' => Company::where('status', 'approved')->count(),
                'subscribers' => Subscriber::where('status', 'subscribed')->count(),
                'publishedNews' => NewsArticle::where('status', 'published')->count(),
                'publishedEvents' => Event::where('status', 'published')->count(),
            ],
            'recentActivity' => Activity::with('causer')->latest()->take(12)->get(),
        ]);
    }
}
