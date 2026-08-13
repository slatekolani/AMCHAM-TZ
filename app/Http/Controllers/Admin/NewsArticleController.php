<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use App\Notifications\ContentReviewedNotification;
use App\Support\HtmlSanitizer;
use App\Support\PublicationNotifier;
use App\Support\PublicImageUpload;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class NewsArticleController extends Controller
{
    public function __construct(private PublicationNotifier $publicationNotifier)
    {
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/News/Index', [
            'articles' => NewsArticle::with('company', 'author')
                ->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status))
                ->latest()
                ->get(),
            'filters' => ['status' => $request->string('status')->toString()],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/News/Edit', ['article' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data = $this->storeCoverImage($request, $data);
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);
        $data['author_id'] = $request->user()->id;

        if ($data['status'] === 'published') {
            $data['published_at'] = now();
        }

        $article = NewsArticle::create($data);

        if ($article->status === 'published') {
            $this->publicationNotifier->news($article);
        }

        return redirect()->route('admin.news.index')->with('success', 'Article created.');
    }

    public function edit(NewsArticle $article): Response
    {
        return Inertia::render('Admin/News/Edit', ['article' => $article]);
    }

    public function update(Request $request, NewsArticle $article): RedirectResponse
    {
        $data = $this->validated($request);
        $data = $this->storeCoverImage($request, $data, $article->cover_image_path);
        $wasPublished = $article->status === 'published';

        if ($data['status'] === 'published' && $article->status !== 'published') {
            $data['published_at'] = now();
        }

        $article->update($data);

        if (! $wasPublished && $article->status === 'published') {
            $this->publicationNotifier->news($article);
        }

        return redirect()->route('admin.news.index')->with('success', 'Article updated.');
    }

    public function approve(NewsArticle $article): RedirectResponse
    {
        $article->update([
            'status' => 'published',
            'published_at' => now(),
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'rejection_reason' => null,
        ]);

        $this->notifyAuthor($article, 'published');
        $this->publicationNotifier->news($article);

        return back()->with('success', 'Article approved and published.');
    }

    public function reject(Request $request, NewsArticle $article): RedirectResponse
    {
        $data = $request->validate(['rejection_reason' => ['required', 'string', 'max:1000']]);

        $article->update([
            'status' => 'rejected',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'rejection_reason' => $data['rejection_reason'],
        ]);

        $this->notifyAuthor($article, 'rejected');

        return back()->with('success', 'Article rejected.');
    }

    public function destroy(NewsArticle $article): RedirectResponse
    {
        $article->delete();

        return back()->with('success', 'Article removed.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['required', 'string'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'category' => ['nullable', 'string', 'max:255'],
            'company_id' => ['nullable', 'exists:companies,id'],
            'status' => ['required', 'in:draft,published'],
        ]);

        $data['body'] = HtmlSanitizer::clean($data['body']);

        return $data;
    }

    private function storeCoverImage(Request $request, array $data, ?string $oldPath = null): array
    {
        unset($data['cover_image']);
        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = PublicImageUpload::replace($request->file('cover_image'), 'news', $oldPath);
        }

        return $data;
    }

    private function notifyAuthor(NewsArticle $article, string $status): void
    {
        if ($article->author) {
            $article->author->notify(new ContentReviewedNotification('article', $article->title, $status, $article->rejection_reason));
        }
    }
}
