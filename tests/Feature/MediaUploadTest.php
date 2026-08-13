<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class MediaUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_upload_images_consecutively(): void
    {
        $this->seed(RoleSeeder::class);
        $admin = User::factory()->create(['email_verified_at' => now()]);
        $admin->assignRole('admin');

        foreach (['first.jpg', 'second.jpg'] as $index => $filename) {
            $response = $this->actingAs($admin)->post(route('admin.media.store'), [
                'file' => UploadedFile::fake()->image($filename, 900, 600),
                'description' => 'Media image '.($index + 1),
            ]);

            $response->assertRedirect();
            $response->assertSessionHasNoErrors();
        }

        $this->assertSame(2, Media::count());

        Media::all()->each(function (Media $media): void {
            $this->assertFileExists(public_path($media->path));
            File::delete(public_path($media->path));
        });
    }
}
