<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'site_name' => 'AMCHAM Tanzania',
            'site_tagline' => 'Empowering U.S.-Tanzania Business',
            'contact_email' => 'info@amcham-tz.com',
            'contact_phone' => '+255 22 211 2200',
            'contact_address' => 'Golden Jubilee Towers, Ohio Street, Dar es Salaam, Tanzania',
            'social_linkedin' => 'https://www.linkedin.com/company/amcham-tanzania',
            'social_twitter' => 'https://twitter.com/amchamtz',
            'social_facebook' => 'https://facebook.com/amchamtanzania',
            'social_instagram' => 'https://www.instagram.com/amchamtanzania/',
            'seo_default_title' => 'AMCHAM Tanzania — American Chamber of Commerce in Tanzania',
            'seo_default_description' => 'AMCHAM Tanzania is the American Chamber of Commerce in Tanzania, connecting U.S. and Tanzanian businesses, investors and institutions.',
            'hero_tagline_line_one' => 'Two markets.',
            'hero_tagline_line_two' => 'One chamber.',
            'hero_origin_label' => 'United States',
            'hero_destination_label' => 'Tanzania',
            'hero_auto_advance_ms' => '6500',
            'hero_corridor_duration_ms' => '3400',
            'hero_carousel_slides' => json_encode([
                [
                    'eyebrow' => 'The Bilateral Advantage', 'heading' => 'Connecting enterprise.', 'accent' => 'Across borders.',
                    'body' => 'From Washington to Dar es Salaam, AmCham Tanzania is the standing bridge between American and Tanzanian enterprise — opening doors to policymakers, capital and counterparts on both sides of the corridor.',
                    'main_image' => '/images/amcham-live/hero-minara.jpg', 'secondary_image' => '/images/amcham-live/boards.jpg',
                    'primary_cta_label' => 'Join the Chamber', 'primary_cta_url' => '/membership', 'secondary_cta_label' => "See who's already in", 'secondary_cta_url' => '/members',
                ],
                [
                    'eyebrow' => 'Trade & Investment', 'heading' => 'Local insight.', 'accent' => 'Global opportunity.',
                    'body' => 'We help companies navigate Tanzania’s business environment, build trusted relationships and identify opportunities that advance bilateral trade and long-term investment.',
                    'main_image' => '/images/amcham-live/ppp-growth.png', 'secondary_image' => '/images/amcham-live/tic-news.jpg',
                    'primary_cta_label' => 'Join the Chamber', 'primary_cta_url' => '/membership', 'secondary_cta_label' => "See who's already in", 'secondary_cta_url' => '/members',
                ],
                [
                    'eyebrow' => 'A Trusted Business Network', 'heading' => 'Stronger connections.', 'accent' => 'Greater influence.',
                    'body' => 'Members convene with business leaders, public institutions and international partners through executive dialogue, policy engagement and high-value commercial networks.',
                    'main_image' => '/images/amcham-live/boards.jpg', 'secondary_image' => '/images/amcham-live/thanksgiving.png',
                    'primary_cta_label' => 'Join the Chamber', 'primary_cta_url' => '/membership', 'secondary_cta_label' => "See who's already in", 'secondary_cta_url' => '/members',
                ],
                [
                    'eyebrow' => 'The Voice of American Business', 'heading' => 'Business leadership.', 'accent' => 'Shared progress.',
                    'body' => 'AmCham Tanzania represents a growing community committed to a competitive business climate and stronger economic ties between the United States and Tanzania.',
                    'main_image' => '/images/amcham-live/thanksgiving.png', 'secondary_image' => '/images/amcham-live/hero-minara.jpg',
                    'primary_cta_label' => 'Join the Chamber', 'primary_cta_url' => '/membership', 'secondary_cta_label' => "See who's already in", 'secondary_cta_url' => '/members',
                ],
            ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        ];

        foreach ($settings as $key => $value) {
            Setting::firstOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
