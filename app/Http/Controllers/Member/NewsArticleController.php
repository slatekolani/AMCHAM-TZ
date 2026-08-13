<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use App\Models\User;
use App\Notifications\ContentSubmittedNotification;
use App\Support\HtmlSanitizer;
use App\Support\PublicImageUpload;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class NewsArticleController extends Controller
{
    public function __construct()
    {
        $this->middleware(function (Request $request, \Closure $next) {
            $company = Auth::user()->company;
            abort_unless($company?->hasPublishingAccess(), 403, 'Publishing news articles is available to Platinum tier members only.');

            return $next($request);
        });
    }

    public function index(): Response
    {
        return Inertia::render('Member/News/Index', [
            'articles' => NewsArticle::where('company_id', Auth::user()->company_id)->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Member/News/Edit', ['article' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data = $this->storeCoverImage($request, $data);
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);
        $data['author_id'] = Auth::id();
        $data['company_id'] = Auth::user()->company_id;
        $data['status'] = 'draft';

        NewsArticle::create($data);

        return redirect()->route('member.news.index')->with('success', 'Draft saved.');
    }

    public function edit(NewsArticle $article): Response
    {
        $this->authorizeOwner($article);

        return Inertia::render('Member/News/Edit', ['article' => $article]);
    }

    public function update(Request $request, NewsArticle $article): RedirectResponse
    {
        $this->authorizeOwner($article);
        abort_unless(in_array($article->status, ['draft', 'rejected']), 403);

        $data = $this->storeCoverImage($request, $this->validated($request), $article->cover_image_path);
        $article->update($data);

        return redirect()->route('member.news.index')->with('success', 'Draft updated.');
    }

    public function submit(NewsArticle $article): RedirectResponse
    {
        $this->authorizeOwner($article);
        abort_unless(in_array($article->status, ['draft', 'rejected']), 403);

        $article->update(['status' => 'pending_review', 'rejection_reason' => null]);

        Notification::send(
            User::role(['admin', 'super-admin'])->get(),
            new ContentSubmittedNotification('article', $article->title, Auth::user()->company->name)
        );

        return redirect()->route('member.news.index')->with('success', 'Article submitted for review.');
    }

    public function destroy(NewsArticle $article): RedirectResponse
    {
        $this->authorizeOwner($article);
        abort_unless(in_array($article->status, ['draft', 'rejected']), 403);

        $article->delete();

        return back()->with('success', 'Draft removed.');
    }

    private function authorizeOwner(NewsArticle $article): void
    {
        abort_unless($article->company_id === Auth::user()->company_id, 403);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['required', 'string'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'category' => ['nullable', 'string', 'max:255'],
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
}
