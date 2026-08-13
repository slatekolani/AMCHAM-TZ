<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\WorkingGroup;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class WorkingGroupsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/WorkingGroups', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'items' => WorkingGroup::published()->orderBy('sort_order')->get(),
        ]);
    }

    public function show(WorkingGroup $workingGroup): Response
    {
        abort_unless($workingGroup->is_active, 404);

        return Inertia::render('Public/WorkingGroupShow', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'item' => $workingGroup,
        ]);
    }
}
