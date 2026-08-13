<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->timestamp('published_at')->nullable()->after('status');
        });

        DB::table('events')
            ->where('status', 'published')
            ->update(['published_at' => DB::raw('COALESCE(reviewed_at, created_at)')]);
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('published_at');
        });
    }
};
