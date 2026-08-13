<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\BoardMember;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class BoardMembersController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/BoardMembers', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'boardMembers' => BoardMember::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }
}
