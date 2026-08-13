<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\NewsArticle;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NewsArticleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@amcham-tz.com')->first();

        $articles = [
            [
                'title' => 'Unlocking Opportunities: How to Register with the Tanzania Investment Centre',
                'category' => 'Investment',
                'image' => '/images/amcham-live/tic-news.jpg',
                'excerpt' => 'A practical investor guide for companies preparing to formalize market entry.',
                'body' => "The Tanzania Investment Centre (TIC) remains the primary gateway for foreign and domestic investors seeking incentives and certification. This article walks members through the registration process, required documentation, and the benefits available under the Tanzania Investment Act.\n\nAMCHAM Tanzania continues to work closely with TIC to streamline the certification process for member companies and reduce time-to-market for new investment.",
                'published_at' => now()->subMonths(1),
            ],
            [
                'title' => "Navigating Tanzania's New Sukuk Regulations",
                'category' => 'Finance',
                'image' => '/images/amcham-live/boards.jpg',
                'excerpt' => 'A concise briefing for members monitoring capital markets and regulatory change.',
                'body' => "Tanzania's Capital Markets and Securities Authority has introduced new regulations governing Sukuk (Islamic bond) issuance. This briefing summarizes what member companies exploring alternative financing structures need to know.",
                'published_at' => now()->subMonths(2),
            ],
            [
                'title' => "Tanzania's Economic Progress and the Urgency of Trade Cost Reduction",
                'category' => 'Policy',
                'image' => '/images/amcham-live/hero-minara.jpg',
                'excerpt' => 'An advocacy-oriented publication on competitiveness and trade facilitation priorities.',
                'body' => "AMCHAM Tanzania's policy team outlines the chamber's position on reducing the cost of trade — from port efficiency to logistics corridors — as a critical lever for sustaining Tanzania's growth trajectory.",
                'published_at' => now()->subMonths(3),
            ],
            [
                'title' => "Fitch Affirms Tanzania's B+ Credit Rating",
                'category' => 'Economy',
                'image' => '/images/amcham-live/tic-news.jpg',
                'excerpt' => 'A member-facing summary of macroeconomic signals and investment confidence.',
                'body' => "Fitch Ratings has affirmed Tanzania's B+ sovereign credit rating with a stable outlook, citing continued fiscal discipline and infrastructure investment. AMCHAM Tanzania summarizes what this means for member companies planning capital projects.",
                'published_at' => now()->subMonths(4),
            ],
        ];

        foreach ($articles as $article) {
            NewsArticle::updateOrCreate(
                ['slug' => Str::slug($article['title'])],
                [
                    'title' => $article['title'],
                    'excerpt' => $article['excerpt'],
                    'body' => $article['body'],
                    'cover_image_path' => $article['image'],
                    'category' => $article['category'],
                    'author_id' => $admin?->id,
                    'status' => 'published',
                    'published_at' => $article['published_at'],
                ]
            );
        }

        // A member-submitted article awaiting moderation, to demonstrate the approval workflow.
        $crdb = Company::where('slug', 'crdb-bank')->first();
        $memberUser = User::where('email', 'member@crdbbank.example.com')->first();

        NewsArticle::updateOrCreate(['slug' => 'crdb-bank-launches-diaspora-banking-product'], [
            'title' => 'CRDB Bank Launches New Diaspora Banking Product',
            'excerpt' => 'CRDB Bank introduces a tailored banking product for the Tanzanian diaspora community.',
            'body' => "CRDB Bank has launched a new diaspora banking product designed to make it easier for Tanzanians abroad to save, invest and transact at home. This submission is awaiting AMCHAM Secretariat review before publication.",
            'cover_image_path' => '/images/amcham-live/crdb.png',
            'category' => 'Member News',
            'author_id' => $memberUser?->id,
            'company_id' => $crdb?->id,
            'status' => 'pending_review',
        ]);
    }
}
