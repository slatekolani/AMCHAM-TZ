<?php

namespace App\Support;

use App\Models\Company;
use App\Models\Event;
use App\Models\NewsArticle;
use App\Models\Resource;
use App\Models\Subscriber;
use App\Notifications\PublicationAnnouncement;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Notification;

class PublicationNotifier
{
    public function news(NewsArticle $article): void
    {
        $this->sendOnce(
            $article,
            new PublicationAnnouncement('news article', $article->title, $article->excerpt, route('news.show', $article->slug)),
        );
    }

    public function event(Event $event): void
    {
        $description = collect([
            $event->starts_at?->format('l, j F Y \a\t H:i'),
            $event->location,
            $event->description,
        ])->filter()->join(' — ');

        $this->sendOnce(
            $event,
            new PublicationAnnouncement('event', $event->title, $description, route('events.show', $event->slug)),
        );
    }

    public function newsletter(Resource $resource): void
    {
        $this->sendOnce(
            $resource,
            new PublicationAnnouncement('newsletter', $resource->title, $resource->description, route('newsletters')),
        );
    }

    private function sendOnce(Model $publication, PublicationAnnouncement $notification): void
    {
        $claimed = $publication->newQuery()
            ->whereKey($publication->getKey())
            ->whereNull('audience_notified_at')
            ->update(['audience_notified_at' => now()]);

        if ($claimed !== 1) {
            return;
        }

        foreach ($this->recipients() as $email) {
            Notification::route('mail', $email)->notify($notification);
        }

        $publication->refresh();
    }

    /** @return array<int, string> */
    private function recipients(): array
    {
        return Company::where('status', 'approved')->whereNotNull('email')->pluck('email')
            ->merge(Subscriber::subscribed()->pluck('email'))
            ->map(fn ($email) => strtolower(trim((string) $email)))
            ->filter(fn ($email) => EmailSafety::isSafe($email))
            ->unique()
            ->values()
            ->all();
    }
}
