<?php

namespace Database\Seeders;

use App\Models\Resource;
use Illuminate\Database\Seeder;

class ResourceSeeder extends Seeder
{
    public function run(): void
    {
        $resources = [
            [
                'title' => 'Unlocking Opportunities: TIC Investor Guide',
                'category' => 'Investment',
                'description' => 'A practical guide for companies registering with the Tanzania Investment Centre.',
                'file_path' => 'resources/tic-investor-guide.pdf',
            ],
            [
                'title' => "Navigating Tanzania's New Sukuk Regulations",
                'category' => 'Finance',
                'description' => 'A briefing on capital markets and Islamic finance regulatory change.',
                'file_path' => 'resources/sukuk-regulations-briefing.pdf',
            ],
            [
                'title' => 'Trade Cost Reduction Advocacy Brief',
                'category' => 'Policy',
                'description' => "AMCHAM Tanzania's position on trade facilitation and competitiveness.",
                'file_path' => 'resources/trade-cost-reduction-brief.pdf',
            ],
            [
                'title' => 'AMCHAM Tanzania Membership Application Form',
                'category' => 'Membership',
                'description' => 'Official application form for prospective member companies.',
                'file_path' => 'resources/membership-application-form.pdf',
            ],
        ];

        foreach ($resources as $resource) {
            Resource::updateOrCreate(['title' => $resource['title']], $resource);
        }
    }
}
