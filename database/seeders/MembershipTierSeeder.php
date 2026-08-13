<?php

namespace Database\Seeders;

use App\Models\MembershipTier;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MembershipTierSeeder extends Seeder
{
    public function run(): void
    {
        $tiers = [
            [
                'name' => 'Platinum',
                'price' => 5000,
                'audience' => 'Major corporates and strategic investors',
                'description' => 'Our highest-visibility membership for organisations seeking strategic chamber leadership, policy access and premium positioning.',
                'benefits' => ['Board-level visibility', 'Priority event positioning', 'Policy roundtables', 'Featured digital profile'],
                'sort_order' => 1,
            ],
            [
                'name' => 'Gold',
                'price' => 2500,
                'audience' => 'Established companies growing influence',
                'description' => 'A premium membership for established organisations expanding their visibility, influence and participation in the AMCHAM network.',
                'benefits' => ['Premium member profile', 'Campaign participation', 'Event access', 'Member publishing'],
                'sort_order' => 2,
            ],
            [
                'name' => 'Silver',
                'price' => 1000,
                'audience' => 'Companies building U.S.-TZ relationships',
                'description' => 'A practical membership for growing companies building commercial relationships and visibility across the U.S.–Tanzania business community.',
                'benefits' => ['Directory listing', 'Event invitations', 'Newsletter access', 'Portal access'],
                'sort_order' => 3,
            ],
            [
                'name' => 'Associate',
                'price' => 500,
                'audience' => 'Emerging businesses and advisory firms',
                'description' => 'An accessible entry point for emerging companies, professional services firms and organisations beginning their AMCHAM journey.',
                'benefits' => ['Basic profile', 'Selected events', 'Member updates', 'Renewal tracking'],
                'sort_order' => 4,
            ],
            [
                'name' => 'Individual',
                'price' => 300,
                'audience' => 'Professionals, founders and advisors',
                'description' => 'Designed for individual professionals who want trusted information, meaningful connections and access to chamber activities.',
                'benefits' => ['Personal profile', 'News access', 'Networking events', 'Subscriber updates'],
                'sort_order' => 5,
            ],
        ];

        foreach ($tiers as $tier) {
            MembershipTier::updateOrCreate(
                ['slug' => Str::slug($tier['name'])],
                [
                    'name' => $tier['name'],
                    'price' => $tier['price'],
                    'currency' => 'USD',
                    'billing_period' => 'year',
                    'audience' => $tier['audience'],
                    'description' => $tier['description'],
                    'benefits' => $tier['benefits'],
                    'sort_order' => $tier['sort_order'],
                    'is_active' => true,
                ]
            );
        }
    }
}
