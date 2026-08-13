<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $descriptions = [
            'platinum' => 'Our highest-visibility membership for organisations seeking strategic chamber leadership, policy access and premium positioning.',
            'gold' => 'A premium membership for established organisations expanding their visibility, influence and participation in the AMCHAM network.',
            'silver' => 'A practical membership for growing companies building commercial relationships and visibility across the U.S.–Tanzania business community.',
            'associate' => 'An accessible entry point for emerging companies, professional services firms and organisations beginning their AMCHAM journey.',
            'individual' => 'Designed for individual professionals who want trusted information, meaningful connections and access to chamber activities.',
        ];

        foreach ($descriptions as $slug => $description) {
            DB::table('membership_tiers')->where('slug', $slug)->whereNull('description')->update(['description' => $description]);
        }
    }

    public function down(): void
    {
        // Preserve descriptions because admins may have edited them after deployment.
    }
};
