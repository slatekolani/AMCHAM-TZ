<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\NewsArticle;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = collect([
            ['loc' => route('home'), 'changefreq' => 'weekly', 'priority' => '1.0'],
            ['loc' => route('about'), 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => route('board-members'), 'changefreq' => 'monthly', 'priority' => '0.6'],
            ['loc' => route('membership'), 'changefreq' => 'monthly', 'priority' => '0.9'],
            ['loc' => route('events'), 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => route('news'), 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => route('members'), 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => route('resources'), 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => route('newsletters'), 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => route('gallery'), 'changefreq' => 'weekly', 'priority' => '0.6'],
            ['loc' => route('contact'), 'changefreq' => 'yearly', 'priority' => '0.5'],
            ['loc' => route('privacy'), 'changefreq' => 'yearly', 'priority' => '0.3'],
            ['loc' => route('terms'), 'changefreq' => 'yearly', 'priority' => '0.3'],
            ['loc' => route('cookies'), 'changefreq' => 'yearly', 'priority' => '0.3'],
        ]);

        Event::published()->orderByDesc('updated_at')->get(['slug', 'updated_at'])->each(
            fn (Event $event) => $urls->push([
                'loc' => route('events.show', $event->slug),
                'lastmod' => $event->updated_at?->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ])
        );

        NewsArticle::published()->orderByDesc('updated_at')->get(['slug', 'updated_at'])->each(
            fn (NewsArticle $article) => $urls->push([
                'loc' => route('news.show', $article->slug),
                'lastmod' => $article->updated_at?->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ])
        );

        $xml = view('sitemap', ['urls' => $urls])->render();

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
