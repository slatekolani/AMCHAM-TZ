<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\OurWorkItem;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class OurWorkController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/OurWork', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'items' => OurWorkItem::published()->orderBy('sort_order')->get(),
        ]);
    }

    public function show(OurWorkItem $ourWork): Response
    {
        abort_unless($ourWork->is_active, 404);

        return Inertia::render('Public/OurWorkShow', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'item' => $ourWork,
        ]);
    }
}
