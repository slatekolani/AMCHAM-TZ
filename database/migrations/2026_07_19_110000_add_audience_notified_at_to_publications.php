<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['news_articles', 'events', 'resources'] as $table) {
            Schema::table($table, fn (Blueprint $blueprint) => $blueprint->timestamp('audience_notified_at')->nullable());
        }
    }

    public function down(): void
    {
        foreach (['news_articles', 'events', 'resources'] as $table) {
            Schema::table($table, fn (Blueprint $blueprint) => $blueprint->dropColumn('audience_notified_at'));
        }
    }
};
