import InfoCard from '@/Components/Public/InfoCard';
import PageHero from '@/Components/Public/PageHero';
import SectionHeader from '@/Components/Public/SectionHeader';
import Icon from '@/Components/Public/Icon';
import Reveal from '@/Components/Public/Reveal';
import { cardStatic, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { Page, PageProps } from '@/types';
import { getBlock, getBlocks } from '@/utils/blocks';
import { useCms } from '@/utils/cms';

type AboutProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    page: Page | null;
}>;

export default function About({ canLogin, canRegister, page }: AboutProps) {
    const t = useCms();
    const headingTextBlocks = getBlocks(page, 'heading_text');
    const intro = headingTextBlocks.find((block) => !block.eyebrow);
    const mission = headingTextBlocks.find((block) => block.eyebrow === 'Mission');
    const vision = headingTextBlocks.find((block) => block.eyebrow === 'Vision');
    const history = headingTextBlocks.find((block) => block.eyebrow === 'Our story');
    const values = getBlock(page, 'values_grid')?.items ?? [];
    const tagList = getBlock(page, 'tag_list');

    return (
        <PublicLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title={page?.meta_title ?? 'About AMCHAM Tanzania'} />
            <PageHero
                eyebrow="About the Chamber"
                title={intro?.heading ?? 'A serious chamber for trade, investment and business connection.'}
                description={intro?.body ?? 'AMCHAM Tanzania connects Tanzanian and American companies through advocacy, events, publications, investor support and a stronger member platform.'}
                image={t('about_hero_image', '/images/amcham-live/boards.jpg')}
                breadcrumb={[{ label: 'About Us' }]}
            />

            {(mission || vision) && (
                <section className={`${sectionPad} bg-white`}>
                    <div className={`${shell} grid gap-6 md:grid-cols-2`}>
                        {mission && (
                            <Reveal>
                                <article className={`${cardStatic} relative h-full overflow-hidden p-8 lg:p-10`}>
                                    <span className="absolute inset-y-0 left-0 w-1 bg-crimson" />
                                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-crimson/10 text-crimson">
                                        <Icon name="chart" className="h-6 w-6" />
                                    </div>
                                    <p className="mt-6 text-xs font-semibold uppercase tracking-caps text-crimson">Our Mission</p>
                                    <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-navy-800">{mission.heading}</h2>
                                    <div className="article-prose mt-4 text-ink-muted" dangerouslySetInnerHTML={{ __html: mission.body ?? '' }} />
                                </article>
                            </Reveal>
                        )}
                        {vision && (
                            <Reveal delay={120}>
                                <article className={`${cardStatic} relative h-full overflow-hidden p-8 lg:p-10`}>
                                    <span className="absolute inset-y-0 left-0 w-1 bg-navy-800" />
                                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-navy-100 text-navy-800">
                                        <Icon name="globe" className="h-6 w-6" />
                                    </div>
                                    <p className="mt-6 text-xs font-semibold uppercase tracking-caps text-navy-600">Our Vision</p>
                                    <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-navy-800">{vision.heading}</h2>
                                    <div className="article-prose mt-4 text-ink-muted" dangerouslySetInnerHTML={{ __html: vision.body ?? '' }} />
                                </article>
                            </Reveal>
                        )}
                    </div>
                </section>
            )}

            {values.length > 0 && (
                <section className={`${sectionPad} bg-mist`}>
                    <div className={shell}>
                        <Reveal>
                            <SectionHeader
                                eyebrow="What We Stand For"
                                title="The values that guide the chamber."
                                description="AMCHAM Tanzania's work with members, government and partners is grounded in a consistent set of operating values."
                            />
                        </Reveal>
                        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {values.map((value, index) => (
                                <Reveal key={value.title} delay={index * 90}>
                                    <InfoCard title={value.title} className="h-full">
                                        {value.body}
                                    </InfoCard>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {history && (
                <section className={`${sectionPad} bg-white`}>
                    <div className={`${shell} grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20`}>
                        <Reveal>
                            <SectionHeader eyebrow="Our Story" title={history.heading} />
                        </Reveal>
                        <Reveal delay={120}>
                            <div
                                className="article-prose border-l-2 border-crimson pl-8 text-lg leading-9 text-ink-muted"
                                dangerouslySetInnerHTML={{ __html: history.body ?? '' }}
                            />
                        </Reveal>
                    </div>
                </section>
            )}

            {tagList && tagList.items.length > 0 && (
                <section className="border-t border-line bg-mist px-5 py-16 sm:px-8">
                    <div className={shell}>
                        <p className="text-xs font-semibold uppercase tracking-caps text-crimson">{tagList.heading ?? 'Affiliations'}</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {tagList.items.map((affiliation) => (
                                <span
                                    key={affiliation}
                                    className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 shadow-card"
                                >
                                    {affiliation}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
