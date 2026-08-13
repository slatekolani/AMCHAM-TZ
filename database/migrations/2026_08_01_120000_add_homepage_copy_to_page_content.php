<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $page = DB::table('pages')->where('slug', 'home')->first();

        if (! $page) {
            return;
        }

        $content = json_decode($page->content ?: '{}', true) ?: [];
        $content['copy'] = array_replace($this->defaults(), $content['copy'] ?? []);

        DB::table('pages')->where('id', $page->id)->update([
            'content' => json_encode($content, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        $page = DB::table('pages')->where('slug', 'home')->first();

        if (! $page) {
            return;
        }

        $content = json_decode($page->content ?: '{}', true) ?: [];
        unset($content['copy']);

        DB::table('pages')->where('id', $page->id)->update([
            'content' => json_encode($content, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'updated_at' => now(),
        ]);
    }

    private function defaults(): array
    {
        return [
            'hero_corridor_label' => 'Bilateral corridor',
            'hero_members_label' => 'Member companies',
            'hero_sectors_label' => 'Sectors represented',
            'companies_eyebrow' => 'Our member companies',
            'companies_helper' => 'Scroll or use the arrows · Select a company to learn more',
            'company_fallback_description' => 'This AMCHAM Tanzania member company is part of our growing U.S.–Tanzania business community.',
            'company_profile_button' => 'View member profile',
            'company_website_button' => 'Visit website',
            'pillars_eyebrow' => 'Why AmCham Tanzania',
            'pillars_link_label' => 'Learn more about the chamber',
            'pillars_item_link_label' => 'Read more',
            'events_eyebrow' => 'Events',
            'events_heading' => 'Where the business community convenes.',
            'events_button' => 'View All Events',
            'events_note' => '',
            'events_empty' => 'No upcoming events published yet — check back soon.',
            'news_eyebrow' => 'Newsroom',
            'news_heading' => 'Latest at AmCham Tanzania.',
            'news_button' => 'Browse all publications',
            'news_empty' => 'No published articles yet — check back soon.',
            'leadership_eyebrow' => 'Governance',
            'leadership_heading' => "Led by the region's business leaders.",
            'leadership_body' => 'The chamber is directed by a volunteer board drawn from the executives who build, finance and operate across the U.S.–Tanzania corridor.',
            'leadership_profile_label' => 'View profile',
            'leadership_remaining_label' => 'more directors serve on the board.',
            'leadership_button' => 'Meet the full board',
            'membership_eyebrow' => 'Become a Member',
            'membership_heading' => 'Membership built around your business.',
            'membership_body' => 'Visibility, policy access, event participation and a digital company profile — every tier includes direct chamber communication.',
            'membership_fallback_description' => 'AMCHAM Tanzania membership tailored to this member category.',
            'membership_join_prefix' => 'Join',
            'join_eyebrow' => 'How to join',
            'join_heading' => 'Three steps to a seat at the table.',
            'join_body' => 'Membership is open to companies of every size operating between the United States and Tanzania — and to the individuals who advise them.',
            'join_step_1_title' => 'Choose your tier',
            'join_step_1_body' => '{tier_count} membership tiers, starting at {lowest_price} a year — matched to the size and ambition of your organisation.',
            'join_step_1_link' => 'Compare tiers',
            'join_step_2_title' => 'Submit your application',
            'join_step_2_body' => 'A short application on the tier of your choice. Every submission is reviewed by the AmCham Secretariat, and we come back to you directly.',
            'join_step_2_link' => 'Start an application',
            'join_step_3_title' => 'Take your seat',
            'join_step_3_body' => 'Your company joins the member directory, gains event access, embassy briefings, policy roundtables and a platform to publish your own news.',
            'join_step_3_link' => 'See the directory',
            'join_help' => 'Not sure which tier fits? The Secretariat will walk you through it — no commitment.',
            'join_primary_button' => 'Start your application',
            'join_secondary_button' => 'Talk to the Secretariat',
        ];
    }
};
