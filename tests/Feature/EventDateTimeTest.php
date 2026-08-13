<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventDateTimeTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_event_form_preserves_entered_east_africa_date_and_time(): void
    {
        $this->seed(RoleSeeder::class);
        $admin = User::factory()->create(['email_verified_at' => now()]);
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->post(route('admin.events.store'), [
            'title' => 'EAT Business Forum',
            'description' => 'Forum description',
            'starts_at' => '2026-09-19T15:08',
            'ends_at' => '2026-09-19T17:00',
            'status' => 'draft',
        ]);

        $response->assertRedirect(route('admin.events.index'));
        $response->assertSessionHasNoErrors();

        $event = Event::where('title', 'EAT Business Forum')->firstOrFail();
        $this->assertSame('2026-09-19 12:08', $event->starts_at->utc()->format('Y-m-d H:i'));
        $this->assertSame('2026-09-19 15:08', $event->starts_at->setTimezone('Africa/Dar_es_Salaam')->format('Y-m-d H:i'));
        $this->assertSame('2026-09-19 17:00', $event->ends_at->setTimezone('Africa/Dar_es_Salaam')->format('Y-m-d H:i'));
    }
}
