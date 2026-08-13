<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    private array $tables = [
        'users', 'membership_tiers', 'companies', 'company_documents', 'media',
        'pages', 'news_articles', 'events', 'resources', 'subscribers',
        'contact_inquiries', 'event_registrations', 'membership_applications',
        'email_campaigns', 'sms_campaigns', 'whatsapp_campaigns', 'notification_logs',
        'board_members',
    ];

    public function up(): void
    {
        foreach ($this->tables as $table) {
            if (! Schema::hasTable($table) || Schema::hasColumn($table, 'uuid')) {
                continue;
            }

            Schema::table($table, function (Blueprint $blueprint): void {
                $blueprint->uuid('uuid')->nullable()->unique();
            });

            DB::table($table)->whereNull('uuid')->orderBy('id')->eachById(
                fn ($row) => DB::table($table)->where('id', $row->id)->update(['uuid' => (string) Str::uuid()])
            );
        }
    }

    public function down(): void
    {
        foreach (array_reverse($this->tables) as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'uuid')) {
                Schema::table($table, fn (Blueprint $blueprint) => $blueprint->dropColumn('uuid'));
            }
        }
    }
};
