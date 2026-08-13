<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/About', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'page' => Page::where('slug', 'about')->firstOrFail(),
        ]);
    }
}
