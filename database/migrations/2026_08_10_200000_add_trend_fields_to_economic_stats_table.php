<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('economic_stats', function (Blueprint $table) {
            $table->json('trend')->nullable()->after('sort_order');
            $table->string('chart_group')->nullable()->after('trend');
            $table->string('chart_title')->nullable()->after('chart_group');
            $table->string('trend_value_prefix')->nullable()->after('chart_title');
            $table->string('trend_value_suffix')->nullable()->after('trend_value_prefix');

            $table->index('chart_group');
        });
    }

    public function down(): void
    {
        Schema::table('economic_stats', function (Blueprint $table) {
            $table->dropColumn(['trend', 'chart_group', 'chart_title', 'trend_value_prefix', 'trend_value_suffix']);
        });
    }
};
