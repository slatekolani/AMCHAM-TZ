<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * `events.starts_at` and `invoices.issued_at` were each the first required
     * TIMESTAMP column with no explicit default in their table, so MySQL silently
     * attached DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP to them —
     * resetting the stored date to "now" on every row update, no matter what the
     * app actually sent. Converting to DATETIME removes MySQL's implicit behavior.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE events MODIFY starts_at DATETIME NOT NULL');
        DB::statement('ALTER TABLE invoices MODIFY issued_at DATETIME NOT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE events MODIFY starts_at TIMESTAMP NOT NULL');
        DB::statement('ALTER TABLE invoices MODIFY issued_at TIMESTAMP NOT NULL');
    }
};
