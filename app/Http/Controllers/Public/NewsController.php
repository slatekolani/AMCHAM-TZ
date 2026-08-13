<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(Request $request): Response
    {
        $category = $request->string('category')->toString() ?: null;
        $search = $request->string('q')->toString() ?: null;
        $page = $request->integer('page', 1);
        $hasFilters = (bool) ($category || $search);

        // The latest article leads the page as the editorial spotlight, but remains in the
        // general archive below so the publication list is complete and predictable.
        $featured = ! $hasFilters
            ? NewsArticle::published()->with('company')->latest('published_at')->first()
            : null;

        $query = NewsArticle::published()->with('company')->latest('published_at');

        if ($category) {
            $query->where('category', $category);
        }
        if ($search) {
            $query->where(function ($inner) use ($search) {
                $inner->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Public/News', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'featured' => $page === 1 ? $featured : null,
            'articles' => $query->paginate(12)->withQueryString(),
            'categories' => NewsArticle::published()->whereNotNull('category')->distinct()->orderBy('category')->pluck('category'),
            'filters' => ['category' => $category, 'q' => $search],
        ]);
    }

    public function show(NewsArticle $article): Response
    {
        abort_unless($article->status === 'published', 404);

        return Inertia::render('Public/NewsShow', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'article' => $article->load('company', 'author'),
        ]);
    }
}
