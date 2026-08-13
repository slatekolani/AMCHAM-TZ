<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\User;
use App\Notifications\EventRegistrationNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class EventRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_register_for_published_event_and_admin_is_notified(): void
    {
        Notification::fake();
        Role::create(['name' => 'admin']);
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        $event = Event::create([
            'title' => 'Business Forum',
            'slug' => 'business-forum',
            'starts_at' => now()->addWeek(),
            'status' => 'published',
        ]);

        $response = $this->post(route('events.register', $event->slug), [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+255 700 000 000',
            'company' => 'Example Ltd',
            'job_title' => 'Director',
        ]);

        $response->assertSessionHasNoErrors()->assertSessionHas('success');
        $this->assertDatabaseHas('event_registrations', [
            'event_id' => $event->id,
            'email' => 'jane@example.com',
        ]);
        Notification::assertSentTo($admin, EventRegistrationNotification::class);
    }

    public function test_same_email_cannot_register_twice_for_one_event(): void
    {
        $event = Event::create([
            'title' => 'Business Forum',
            'slug' => 'business-forum',
            'starts_at' => now()->addWeek(),
            'status' => 'published',
        ]);
        $event->registrations()->create([
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+255 700 000 000',
        ]);

        $this->from(route('events.show', $event->slug))->post(route('events.register', $event->slug), [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+255 700 000 000',
        ])->assertSessionHasErrors('email');

        $this->assertDatabaseCount('event_registrations', 1);
    }
}
