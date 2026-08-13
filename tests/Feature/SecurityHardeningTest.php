<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\NewsArticle;
use App\Models\Resource;
use App\Models\User;
use App\Support\HtmlSanitizer;
use App\Support\PublicImageUpload;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    public function test_models_use_uuid_routes_while_public_content_keeps_slugs(): void
    {
        $resource = Resource::create([
            'title' => 'Guide',
            'category' => 'Newsletter',
            'file_path' => 'uploads/resources/missing.pdf',
        ]);
        $event = Event::create([
            'title' => 'Public event',
            'slug' => 'public-event',
            'starts_at' => now()->addDay(),
            'status' => 'published',
        ]);

        $this->assertNotNull($resource->uuid);
        $this->assertStringContainsString($resource->uuid, route('resources.download', $resource));
        $this->assertStringContainsString('public-event', route('events.show', $event->slug));
        $this->get('/resources/' . $resource->id . '/download')->assertNotFound();
    }

    public function test_rich_text_sanitizer_removes_executable_markup(): void
    {
        $clean = HtmlSanitizer::clean('<p onclick="alert(1)">Safe</p><script>alert(1)</script><a href="javascript:alert(1)">link</a>');

        $this->assertSame('<p>Safe</p><a>link</a>', $clean);
    }

    public function test_forgot_password_does_not_reveal_unknown_accounts(): void
    {
        Notification::fake();

        $this->post(route('password.email'), ['email' => 'unknown@example.com'])
            ->assertSessionHas('status', trans('passwords.sent'))
            ->assertSessionHasNoErrors();
    }

    public function test_public_forms_are_rate_limited(): void
    {
        $payload = [
            'name' => 'Test Sender',
            'email' => 'sender@example.com',
            'subject' => 'Question',
            'message' => 'A legitimate enquiry.',
        ];

        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $this->post(route('contact.store'), $payload)->assertRedirect();
        }

        $this->post(route('contact.store'), $payload)->assertTooManyRequests();
    }

    public function test_security_headers_are_present(): void
    {
        $this->get('/')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_sitemap_exposes_public_pages_and_slug_urls(): void
    {
        Event::create([
            'title' => 'Trade Forum',
            'slug' => 'trade-forum',
            'starts_at' => now()->addWeek(),
            'status' => 'published',
        ]);

        $this->get(route('sitemap'))
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee('/events/trade-forum', false)
            ->assertDontSee('/admin/', false);
    }

    public function test_social_metadata_is_server_rendered_with_each_pages_hero_image(): void
    {
        $this->get(route('membership'))
            ->assertOk()
            ->assertSee('property="og:description"', false)
            ->assertSee('/images/amcham-live/hero-minara.jpg', false);

        $article = NewsArticle::create([
            'title' => 'Tanzania Investment Update',
            'slug' => 'tanzania-investment-update',
            'excerpt' => 'A focused update for investors and member companies.',
            'body' => '<p>Article body.</p>',
            'cover_image_path' => '/uploads/media/investment-update.jpg',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->get(route('news.show', $article->slug))
            ->assertOk()
            ->assertSee('A focused update for investors and member companies.', false)
            ->assertSee('/uploads/media/investment-update.jpg', false)
            ->assertSee('property="og:type" content="article"', false);
    }

    public function test_public_cover_images_are_uploaded_with_uuid_names_and_replaced_safely(): void
    {
        $firstPath = null;
        $secondPath = null;

        try {
            $firstPath = PublicImageUpload::replace(UploadedFile::fake()->image('first.jpg'), 'news');
            $this->assertMatchesRegularExpression('#^/uploads/news/[0-9a-f-]{36}\.jpg$#', $firstPath);
            $this->assertFileExists(public_path(ltrim($firstPath, '/')));

            $secondPath = PublicImageUpload::replace(UploadedFile::fake()->image('second.png'), 'news', $firstPath);
            $this->assertFileDoesNotExist(public_path(ltrim($firstPath, '/')));
            $this->assertFileExists(public_path(ltrim($secondPath, '/')));
        } finally {
            foreach (array_filter([$firstPath, $secondPath]) as $path) {
                File::delete(public_path(ltrim($path, '/')));
            }
        }
    }
}
