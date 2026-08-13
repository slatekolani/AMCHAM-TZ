<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Media;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/Gallery', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'media' => Media::latest()->paginate(12)->withQueryString()->through(fn (Media $item) => [
                'id' => $item->id,
                'url' => $item->url,
                'filename' => $item->filename,
                'description' => $item->description,
                'created_at' => $item->created_at,
            ]),
            'events' => Event::published()
                ->whereNotNull('cover_image_path')
                ->latest('starts_at')
                ->limit(6)->get(['id', 'title', 'slug', 'description', 'location', 'starts_at', 'cover_image_path', 'category', 'published_at', 'created_at']),
        ]);
    }
}
