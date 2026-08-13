<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\PolicyUpdate;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class PolicyUpdatesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/PolicyUpdates', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'policyUpdates' => PolicyUpdate::published()->orderByDesc('published_at')->paginate(12),
        ]);
    }

    public function show(PolicyUpdate $policyUpdate): Response
    {
        abort_unless($policyUpdate->is_active && $policyUpdate->published_at, 404);

        return Inertia::render('Public/PolicyUpdateShow', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'policyUpdate' => $policyUpdate,
        ]);
    }
}
