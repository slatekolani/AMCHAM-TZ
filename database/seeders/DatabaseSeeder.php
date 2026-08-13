<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            MembershipTierSeeder::class,
            BoardMemberSeeder::class,
            SettingsSeeder::class,
            PageSeeder::class,
            CompanySeeder::class,
            NewsArticleSeeder::class,
            ResourceSeeder::class,
        ]);
    }
}
