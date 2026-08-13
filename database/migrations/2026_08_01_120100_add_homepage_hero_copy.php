<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $page = DB::table('pages')->where('slug', 'home')->first();

        if (! $page) {
            return;
        }

        $content = json_decode($page->content ?: '{}', true) ?: [];
        $content['copy'] = array_replace([
            'hero_corridor_label' => 'Bilateral corridor',
            'hero_members_label' => 'Member companies',
            'hero_sectors_label' => 'Sectors represented',
        ], $content['copy'] ?? []);

        DB::table('pages')->where('id', $page->id)->update([
            'content' => json_encode($content, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        // These keys are also part of the main homepage-copy migration.
    }
};
