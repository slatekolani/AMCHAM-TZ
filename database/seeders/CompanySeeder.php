<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\MembershipTier;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            ['name' => 'CRDB Bank', 'sector' => 'Banking', 'tier' => 'Platinum', 'logo' => '/images/amcham-live/crdb.png', 'description' => 'A leading Tanzanian commercial bank offering retail, corporate and treasury banking services across East Africa.'],
            ['name' => 'Abbott', 'sector' => 'Healthcare', 'tier' => 'Platinum', 'logo' => '/images/amcham-live/abbott.png', 'description' => 'A global healthcare company advancing diagnostics, medical devices, nutrition and branded generic medicines in Tanzania.'],
            ['name' => 'GE', 'sector' => 'Energy', 'tier' => 'Gold', 'logo' => '/images/amcham-live/ge.png', 'description' => 'A global industrial and energy technology company supporting Tanzania\'s power generation and infrastructure growth.'],
            ['name' => 'NMB Tanzania', 'sector' => 'Banking', 'tier' => 'Gold', 'logo' => '/images/amcham-live/nmb.png', 'description' => 'One of Tanzania\'s largest banks by customer base, serving individuals, SMEs and corporates nationwide.'],
            ['name' => 'Tembo Nickel', 'sector' => 'Mining', 'tier' => 'Silver', 'logo' => null, 'description' => 'A responsible mining operator developing Tanzania\'s nickel resources for the global battery supply chain.'],
            ['name' => 'Meridian Group', 'sector' => 'Logistics', 'tier' => 'Associate', 'logo' => null, 'description' => 'A regional logistics and freight-forwarding company connecting Tanzanian trade to global markets.'],
        ];

        foreach ($companies as $company) {
            $tier = MembershipTier::where('name', $company['tier'])->first();

            Company::updateOrCreate(
                ['slug' => Str::slug($company['name'])],
                [
                    'membership_tier_id' => $tier?->id,
                    'name' => $company['name'],
                    'sector' => $company['sector'],
                    'logo_path' => $company['logo'],
                    'description' => $company['description'],
                    'website' => 'https://' . Str::slug($company['name']) . '.example.com',
                    'phone' => '+255 22 211 0000',
                    'email' => Str::slug($company['name'], '') . '@example.com',
                    'address' => 'Dar es Salaam, Tanzania',
                    'status' => 'approved',
                    'approved_at' => now(),
                ]
            );
        }

        // A pending applicant, to demonstrate the approval workflow.
        Company::updateOrCreate(['slug' => 'baobab-ventures'], [
            'membership_tier_id' => MembershipTier::where('name', 'Associate')->first()?->id,
            'name' => 'Baobab Ventures',
            'sector' => 'Advisory',
            'logo_path' => null,
            'description' => 'A Dar es Salaam-based advisory firm supporting diaspora investors entering the Tanzanian market.',
            'website' => 'https://baobabventures.example.com',
            'phone' => '+255 22 211 0099',
            'email' => 'hello@baobabventures.example.com',
            'address' => 'Dar es Salaam, Tanzania',
            'status' => 'pending',
        ]);

        // A demo member-portal login tied to an approved member company.
        $crdb = Company::where('slug', 'crdb-bank')->first();
        $memberUser = User::firstOrCreate(
            ['email' => 'member@crdbbank.example.com'],
            [
                'name' => 'CRDB Bank Portal User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'company_id' => $crdb?->id,
            ]
        );
        $memberUser->company_id = $crdb?->id;
        $memberUser->save();
        $memberUser->syncRoles(['member']);
    }
}
