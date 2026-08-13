<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Event;
use App\Models\NewsArticle;
use App\Models\Resource;
use App\Models\Subscriber;
use App\Notifications\PublicationAnnouncement;
use App\Support\PublicationNotifier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PublicationNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_publications_email_approved_companies_and_subscribers_once(): void
    {
        Notification::fake();

        Company::create([
            'name' => 'Approved Member',
            'slug' => 'approved-member',
            'status' => 'approved',
            'email' => 'member@example.com',
        ]);
        Company::create([
            'name' => 'Pending Company',
            'slug' => 'pending-company',
            'status' => 'pending',
            'email' => 'pending@example.com',
        ]);
        Subscriber::create(['email' => 'member@example.com', 'status' => 'subscribed']);
        Subscriber::create(['email' => 'subscriber@example.com', 'status' => 'subscribed']);
        Subscriber::create(['email' => 'former@example.com', 'status' => 'unsubscribed']);
        Subscriber::create(['email' => "unsafe\r\n@example.com", 'status' => 'subscribed']);

        $article = NewsArticle::create([
            'title' => 'Policy Update',
            'slug' => 'policy-update',
            'body' => '<p>Update</p>',
            'status' => 'published',
            'published_at' => now(),
        ]);
        $event = Event::create([
            'title' => 'Business Forum',
            'slug' => 'business-forum',
            'starts_at' => now()->addWeek(),
            'status' => 'published',
        ]);
        $newsletter = Resource::create([
            'title' => 'July Newsletter',
            'category' => 'Newsletter',
            'file_path' => 'uploads/resources/july.pdf',
        ]);

        $notifier = app(PublicationNotifier::class);
        $notifier->news($article);
        $notifier->event($event);
        $notifier->newsletter($newsletter);

        // A second approval/update must not announce the same publication again.
        $notifier->news($article);
        $notifier->event($event);
        $notifier->newsletter($newsletter);

        Notification::assertSentOnDemandTimes(PublicationAnnouncement::class, 6);
        foreach (['member@example.com', 'subscriber@example.com'] as $email) {
            Notification::assertSentOnDemand(
                PublicationAnnouncement::class,
                fn ($notification, $channels, AnonymousNotifiable $notifiable) => $notifiable->routeNotificationFor('mail') === $email,
            );
        }

        $this->assertNotNull($article->fresh()->audience_notified_at);
        $this->assertNotNull($event->fresh()->audience_notified_at);
        $this->assertNotNull($newsletter->fresh()->audience_notified_at);
    }
}
