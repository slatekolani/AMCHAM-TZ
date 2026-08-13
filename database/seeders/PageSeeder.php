<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        Page::updateOrCreate(['slug' => 'home'], [
            'title' => 'Home',
            'status' => 'published',
            'meta_title' => 'AMCHAM Tanzania — Empowering U.S.-Tanzania Business',
            'meta_description' => 'AMCHAM Tanzania connects U.S. and Tanzanian businesses, investors and institutions through advocacy, events and member services.',
            'content' => [
                'blocks' => [
                    $this->block('hero', [
                        'eyebrow' => 'American Chamber of Commerce in Tanzania',
                        'heading' => 'Empowering U.S.-Tanzania Business',
                        'body' => 'AMCHAM Tanzania is the leading platform connecting American and Tanzanian companies, investors, government institutions and the public — driving trade, investment and policy dialogue across the region.',
                        'primary_cta_label' => 'Become a Member',
                        'primary_cta_url' => '/membership',
                        'secondary_cta_label' => 'Explore Events',
                        'secondary_cta_url' => '/events',
                        'image' => '/images/amcham-hero.png',
                    ]),
                    $this->block('stats', [
                        'items' => [
                            ['label' => 'Member Companies', 'value' => '150+'],
                            ['label' => 'Years of Advocacy', 'value' => '25+'],
                            ['label' => 'Annual Events', 'value' => '30+'],
                            ['label' => 'Sectors Represented', 'value' => '12'],
                        ],
                    ]),
                    $this->block('heading_text', [
                        'heading' => 'A living digital ecosystem for the U.S.-Tanzania business community',
                        'body' => 'From policy roundtables to member-to-member trade, AMCHAM Tanzania is where U.S. and Tanzanian business leaders convene to grow investment, strengthen ties and shape the business climate.',
                    ]),
                    $this->block('values_grid', [
                        'items' => [
                            ['title' => 'Trade & Investment', 'body' => 'U.S.–Tanzania investment facilitation, policy insight and business intelligence for decision makers.', 'image' => '/images/amcham-live/ppp-growth.png'],
                            ['title' => 'Membership', 'body' => 'Clear tiers, company visibility and a stronger digital presence for every member organisation.', 'image' => '/images/amcham-live/boards.jpg'],
                            ['title' => 'Events', 'body' => 'Flagship dinners, executive roundtables and policy briefings across the calendar year.', 'image' => '/images/amcham-live/thanksgiving.png'],
                            ['title' => 'Publications', 'body' => 'News, policy updates and member articles curated under editorial review by the Secretariat.', 'image' => '/images/amcham-live/tic-news.jpg'],
                        ],
                    ]),
                ],
            ],
        ]);

        Page::updateOrCreate(['slug' => 'about'], [
            'title' => 'About AMCHAM Tanzania',
            'status' => 'published',
            'meta_title' => 'About Us — AMCHAM Tanzania',
            'meta_description' => 'Learn about AMCHAM Tanzania\'s mission, history and leadership as the American Chamber of Commerce in Tanzania.',
            'content' => [
                'blocks' => [
                    $this->block('heading_text', [
                        'heading' => 'About AMCHAM Tanzania',
                        'body' => 'The American Chamber of Commerce in Tanzania (AMCHAM Tanzania) is an independent, member-driven business association that represents the interests of American and Tanzanian companies operating in and with Tanzania.',
                    ]),
                    $this->block('heading_text', [
                        'eyebrow' => 'Mission',
                        'heading' => 'Why we exist',
                        'body' => 'To promote trade and investment between the United States and Tanzania by advocating for a competitive business environment, connecting members to opportunity, and championing policy reform that benefits the private sector.',
                    ]),
                    $this->block('heading_text', [
                        'eyebrow' => 'Vision',
                        'heading' => 'Where we are headed',
                        'body' => 'A thriving, integrated U.S.-Tanzania business community that drives inclusive economic growth across East Africa.',
                    ]),
                    $this->block('values_grid', [
                        'items' => [
                            ['title' => 'Integrity', 'body' => 'We operate with transparency and the highest ethical standards in every engagement.'],
                            ['title' => 'Advocacy', 'body' => 'We champion policies that unlock trade, investment and private-sector growth.'],
                            ['title' => 'Community', 'body' => 'We connect members to each other, to government, and to opportunity.'],
                            ['title' => 'Excellence', 'body' => 'We deliver programs and services that meet the standards our members expect.'],
                        ],
                    ]),
                    $this->block('heading_text', [
                        'eyebrow' => 'Our story',
                        'heading' => 'A chamber built over decades of partnership',
                        'body' => 'Founded to strengthen commercial ties between the United States and Tanzania, AMCHAM Tanzania has grown into one of the region\'s most active bilateral business chambers, serving corporates, investors, diplomatic missions and entrepreneurs alike.',
                    ]),
                    $this->block('tag_list', [
                        'heading' => 'Affiliations',
                        'items' => ['U.S. Chamber of Commerce', 'AmChams in Africa', 'U.S. Embassy Dar es Salaam — Commercial Section'],
                    ]),
                ],
            ],
        ]);

        Page::updateOrCreate(['slug' => 'contact'], [
            'title' => 'Contact Us',
            'status' => 'published',
            'meta_title' => 'Contact — AMCHAM Tanzania',
            'meta_description' => 'Get in touch with AMCHAM Tanzania — the American Chamber of Commerce in Tanzania.',
            'content' => [
                'blocks' => [
                    $this->block('heading_text', [
                        'heading' => 'Get in Touch',
                        'body' => 'Whether you are exploring membership, planning an event partnership or have a media inquiry, our Secretariat is here to help.',
                    ]),
                    $this->block('fact', [
                        'label' => 'Office hours',
                        'value' => 'Monday – Friday, 08:30 – 17:00 (EAT)',
                    ]),
                ],
            ],
        ]);

        Page::updateOrCreate(['slug' => 'membership-intro'], [
            'title' => 'Membership',
            'status' => 'published',
            'meta_title' => 'Membership — AMCHAM Tanzania',
            'meta_description' => 'Explore AMCHAM Tanzania membership tiers and benefits for companies and individuals.',
            'content' => [
                'blocks' => [
                    $this->block('heading_text', [
                        'heading' => 'Join AMCHAM Tanzania',
                        'body' => 'Membership gives your company a seat at the table — direct access to policymakers, a digital company profile, event visibility, and a platform to publish your news and updates to the wider business community.',
                    ]),
                ],
            ],
        ]);
    }

    private function block(string $type, array $data): array
    {
        return ['id' => (string) Str::uuid(), 'type' => $type, 'data' => $data];
    }
}
