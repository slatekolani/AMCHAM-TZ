<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\BoardMember;
use App\Models\Company;
use App\Models\Event;
use App\Models\NewsArticle;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteSearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = trim((string) $request->query('q', ''));

        if (mb_strlen($query) < 2) {
            return response()->json(['results' => []]);
        }

        $like = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $query).'%';
        $results = collect();

        $pages = [
            ['title' => 'About AMCHAM Tanzania', 'description' => 'Our mission, story, values and affiliations.', 'url' => '/about-us', 'keywords' => 'about mission vision chamber history'],
            ['title' => 'Board Members', 'description' => 'Meet the leaders guiding the chamber.', 'url' => '/board-members', 'keywords' => 'leadership governance directors board'],
            ['title' => 'Membership', 'description' => 'Explore membership levels, benefits and applications.', 'url' => '/membership', 'keywords' => 'join benefits tiers become member application'],
            ['title' => 'Events', 'description' => 'Business forums, briefings and networking events.', 'url' => '/events', 'keywords' => 'calendar register conference forum networking'],
            ['title' => 'News & Insights', 'description' => 'Chamber news, policy updates and member stories.', 'url' => '/news', 'keywords' => 'articles press publications insight'],
            ['title' => 'Member Directory', 'description' => 'Explore AMCHAM Tanzania member companies.', 'url' => '/members', 'keywords' => 'companies directory business network'],
            ['title' => 'Resource Library', 'description' => 'Investor guides, briefs and business materials.', 'url' => '/resources', 'keywords' => 'downloads documents reports guides'],
            ['title' => 'Newsletters', 'description' => 'Updates and insight from the chamber.', 'url' => '/newsletters', 'keywords' => 'editions publications updates'],
            ['title' => 'Gallery', 'description' => 'Moments from events and the AMCHAM community.', 'url' => '/gallery', 'keywords' => 'photos media images'],
            ['title' => 'Contact the Secretariat', 'description' => 'Membership, partnerships and investor enquiries.', 'url' => '/contact-us', 'keywords' => 'email phone address office help'],
        ];

        foreach ($pages as $page) {
            if (str_contains(mb_strtolower($page['title'].' '.$page['description'].' '.$page['keywords']), mb_strtolower($query))) {
                $results->push($this->result('Page', $page['title'], $page['description'], $page['url'], 'document'));
            }
        }

        Company::query()->where('status', 'approved')
            ->where(fn ($builder) => $builder->where('name', 'like', $like)->orWhere('sector', 'like', $like)->orWhere('description', 'like', $like))
            ->limit(6)->get()->each(fn (Company $company) => $results->push(
                $this->result('Member', $company->name, $company->sector ?: 'AMCHAM Tanzania member company', route('members.show', $company->slug, false), 'landmark', $company->logo_path)
            ));

        NewsArticle::published()->where(fn ($builder) => $builder->where('title', 'like', $like)->orWhere('excerpt', 'like', $like)->orWhere('category', 'like', $like))
            ->latest('published_at')->limit(6)->get()->each(fn (NewsArticle $article) => $results->push(
                $this->result('News', $article->title, $article->category ?: 'News & insight', route('news.show', $article->slug, false), 'document', $article->cover_image_path)
            ));

        Event::published()->where(fn ($builder) => $builder->where('title', 'like', $like)->orWhere('description', 'like', $like)->orWhere('category', 'like', $like)->orWhere('location', 'like', $like))
            ->orderByDesc('starts_at')->limit(6)->get()->each(fn (Event $event) => $results->push(
                $this->result('Event', $event->title, trim(($event->category ?: 'Event').($event->location ? ' · '.$event->location : '')), route('events.show', $event->slug, false), 'calendar', $event->cover_image_path)
            ));

        Resource::query()->where(fn ($builder) => $builder->where('title', 'like', $like)->orWhere('description', 'like', $like)->orWhere('category', 'like', $like))
            ->latest()->limit(6)->get()->each(fn (Resource $resource) => $results->push(
                $this->result('Resource', $resource->title, $resource->category ?: 'Downloadable resource', route('resources.download', $resource->uuid, false), 'download')
            ));

        BoardMember::query()->where('is_active', true)
            ->where(fn ($builder) => $builder->where('name', 'like', $like)->orWhere('role_title', 'like', $like)->orWhere('bio', 'like', $like))
            ->orderBy('sort_order')->limit(4)->get()->each(fn (BoardMember $member) => $results->push(
                $this->result('Leadership', $member->name, $member->role_title, '/board-members', 'user', $member->photo_path)
            ));

        return response()->json(['results' => $results->take(18)->values()]);
    }

    private function result(string $type, string $title, string $description, string $url, string $icon, ?string $image = null): array
    {
        return compact('type', 'title', 'description', 'url', 'icon', 'image');
    }
}
