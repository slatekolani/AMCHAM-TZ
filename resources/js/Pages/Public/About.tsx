import PageHero from '@/Components/Public/PageHero';
import SectionHeader from '@/Components/Public/SectionHeader';
import Icon, { IconName } from '@/Components/Public/Icon';
import Reveal from '@/Components/Public/Reveal';
import CountUp from '@/Components/Public/CountUp';
import LeadershipStrip from '@/Components/Public/LeadershipStrip';
import { btn, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { BoardMember, Page, PageProps } from '@/types';
import { getBlock, getBlocks } from '@/utils/blocks';
import { useCms } from '@/utils/cms';

type AboutProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    page: Page | null;
    boardMembers: BoardMember[];
}>;

const defaultObjectives: { title: string; body: string }[] = [
    { title: 'Trade & Investment', body: 'Promote two-way flow of trade and investment between the U.S. and Tanzania.' },
    { title: 'Business Opportunities', body: 'Facilitate business and investment opportunities for U.S. companies in Tanzania.' },
    { title: 'Ethics & Insight', body: 'Promote the spirit of business, professionalism and ethics in the Tanzania environment, and provide insight into American business philosophy.' },
    { title: 'Cross-Cultural Interaction', body: 'Facilitate cross-cultural interaction between U.S. and Tanzanian business.' },
    { title: 'A Forum for Business', body: 'Provide a forum to address common business issues, with resources for doing business in Tanzania.' },
    { title: 'Legislative Insight', body: 'Provide information on new legislation that can impact business.' },
];

/** Cycled by card position rather than admin-picked — keeps the objectives editor to plain title/body. */
const objectiveIcons: IconName[] = ['chart', 'briefcase', 'shield', 'users', 'document', 'megaphone'];

const defaultHistoryMilestones: { year: string; title: string; body: string }[] = [
    { year: '2005', title: 'Founded as ABA', body: 'Established as the American Business Association – Tanzania, the forerunner to today’s chamber.' },
    { year: '2009', title: 'Decision to transform', body: 'The ABA Board hosted the US Chamber of Commerce’s Africa Business Initiative and resolved to transform ABA into the American Chamber of Commerce in Tanzania.' },
    { year: '2010', title: 'Accredited as AmCham TZ', body: 'Accredited by the U.S. Chamber of Commerce, Washington, and launched in a ceremony led by U.S. Ambassador Alfonso Lenhart.' },
    { year: '2011', title: 'Hosted the Africa Summit', body: 'Welcomed 70+ delegates to the 2nd Annual All-Africa AMCHAM Regional Summit in Dar es Salaam, honoring U.S. Trade Representative Ron Kirk and Assistant USTR for Africa Florie Liser.' },
];

export default function About({ canLogin, canRegister, page, boardMembers }: AboutProps) {
    const t = useCms();
    const headingTextBlocks = getBlocks(page, 'heading_text');
    const intro = headingTextBlocks.find((block) => !block.eyebrow);
    const mission = headingTextBlocks.find((block) => block.eyebrow === 'Mission');
    const vision = headingTextBlocks.find((block) => block.eyebrow === 'Vision');
    const whatWeDo = headingTextBlocks.find((block) => block.eyebrow === 'What We Do');
    const history = headingTextBlocks.find((block) => block.eyebrow === 'Our story');
    const tagList = getBlock(page, 'tag_list');
    const objectiveItems = getBlock(page, 'values_grid')?.items;
    const objectives = objectiveItems && objectiveItems.length > 0 ? objectiveItems : defaultObjectives;
    const timelineItems = getBlock(page, 'timeline')?.items;
    const historyMilestones = timelineItems && timelineItems.length > 0 ? timelineItems : defaultHistoryMilestones;

    const stats = [
        { value: '80+', label: 'Member companies', sub: 'One trusted network' },
        { value: '12+', label: 'Sectors represented', sub: 'Across the economy' },
        { value: '113+', label: 'Countries', sub: 'Global AmCham network' },
    ];

    return (
        <PublicLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title={page?.meta_title ?? 'About AMCHAM Tanzania'} />
            <PageHero
                eyebrow="About the Chamber"
                title={intro?.heading ?? 'A serious chamber for trade, investment and business connection.'}
                description={intro?.body ?? 'AMCHAM Tanzania connects Tanzanian and American companies through advocacy, events, publications, investor support and a stronger member platform.'}
                image={t('about_hero_image', '/images/amcham-live/boards.jpg')}
                breadcrumb={[{ label: 'About Us' }]}
                compact
            />

            <section className="relative z-10 -mt-8 px-5 sm:-mt-10 sm:px-8">
                <div className={shell}>
                    <div className="grid overflow-hidden rounded-2xl border border-white/20 bg-white shadow-card-lg sm:grid-cols-3">
                        {stats.map((stat, index) => (
                            <div key={stat.label} className="relative px-6 py-6 sm:px-8 sm:py-7 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-line sm:[&:not(:last-child)]:border-r sm:[&:not(:last-child)]:border-b-0">
                                <span className="absolute left-0 top-0 h-1 w-full brand-rule" aria-hidden="true" />
                                <p className="font-display text-3xl font-semibold tabular-nums text-navy-900 sm:text-4xl"><CountUp value={stat.value} delay={index * 120} /></p>
                                <p className="mt-1 text-sm font-bold text-navy-800">{stat.label}</p>
                                <p className="mt-0.5 text-xs text-ink-faint">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {(mission || vision) && (
                <section className="relative overflow-hidden bg-navy-950 text-white">
                    <div className="absolute inset-x-0 top-0 h-1 brand-rule" />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-70"
                        style={{
                            backgroundImage:
                                'radial-gradient(52rem 30rem at 85% 10%, rgba(59,94,151,0.30) 0%, transparent 70%), radial-gradient(44rem 26rem at 8% 92%, rgba(200,16,46,0.16) 0%, transparent 72%)',
                        }}
                    />

                    <div className={`${shell} relative ${sectionPad}`}>
                        <div className="grid gap-14 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-white/10">
                            {mission && (
                                <Reveal className="lg:pr-16">
                                    <span aria-hidden="true" className="block font-display text-7xl font-semibold leading-none text-white/10 sm:text-8xl">01</span>
                                    <p className="-mt-4 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-caps text-gold">
                                        <span className="h-px w-8 bg-current" />
                                        Our Mission
                                    </p>
                                    <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">{mission.heading}</h2>
                                    <div className="article-prose mt-5 text-lg leading-8 text-white/65" dangerouslySetInnerHTML={{ __html: mission.body ?? '' }} />
                                </Reveal>
                            )}
                            {vision && (
                                <Reveal delay={140} className="lg:pl-16">
                                    <span aria-hidden="true" className="block font-display text-7xl font-semibold leading-none text-white/10 sm:text-8xl">02</span>
                                    <p className="-mt-4 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-caps text-gold">
                                        <span className="h-px w-8 bg-current" />
                                        Our Vision
                                    </p>
                                    <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">{vision.heading}</h2>
                                    <div className="article-prose mt-5 text-lg leading-8 text-white/65" dangerouslySetInnerHTML={{ __html: vision.body ?? '' }} />
                                </Reveal>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {whatWeDo && (
                <section className={`${sectionPad} bg-mist`}>
                    <div className={`${shell} grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20`}>
                        <Reveal>
                            <SectionHeader eyebrow="What We Do" title={whatWeDo.heading} />
                        </Reveal>
                        <Reveal delay={120}>
                            <div
                                className="article-prose border-l-2 border-navy-800 pl-8 text-lg leading-9 text-ink-muted"
                                dangerouslySetInnerHTML={{ __html: whatWeDo.body ?? '' }}
                            />
                        </Reveal>
                    </div>
                </section>
            )}

            <section className={`${sectionPad} bg-white`}>
                <div className={shell}>
                    <Reveal>
                        <SectionHeader
                            eyebrow="Objectives"
                            title="What we're working to achieve."
                        />
                    </Reveal>
                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {objectives.map((objective, index) => (
                            <Reveal key={index + objective.title} delay={index * 80}>
                                <article className="group h-full rounded-2xl border border-line bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-lg">
                                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-crimson/10 text-crimson transition duration-300 group-hover:bg-crimson group-hover:text-white">
                                        <Icon name={objectiveIcons[index % objectiveIcons.length]} className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-navy-800">{objective.title}</h3>
                                    <p className="mt-3 leading-7 text-ink-muted">{objective.body}</p>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {history && (
                <section className={`${sectionPad} bg-mist`}>
                    <div className={`${shell} grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16`}>
                        <Reveal>
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-navy-100 shadow-card-lg sm:aspect-[5/4] lg:aspect-[4/5]">
                                <img
                                    src={t('about_story_image', '/images/amcham-live/hero-minara.jpg')}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
                            </div>
                        </Reveal>
                        <Reveal delay={120}>
                            <SectionHeader eyebrow="History & Background" title={history.heading} />
                            <div
                                className="article-prose mt-6 border-l-2 border-crimson pl-8 text-lg leading-9 text-ink-muted"
                                dangerouslySetInnerHTML={{ __html: history.body ?? '' }}
                            />
                        </Reveal>
                    </div>

                    <div className={`${shell} mt-16`}>
                        <div className="grid gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                            {historyMilestones.map((milestone, index) => (
                                <Reveal key={index + milestone.year} delay={index * 100}>
                                    <div className="relative pl-6 sm:pl-0">
                                        <div className="flex items-center gap-3 sm:block">
                                            <span className="font-display text-2xl font-semibold text-crimson">{milestone.year}</span>
                                            <span aria-hidden="true" className="hidden h-px flex-1 bg-line sm:mt-4 sm:block" />
                                        </div>
                                        <span aria-hidden="true" className="absolute left-0 top-1.5 h-full w-px bg-line sm:hidden" />
                                        <span aria-hidden="true" className="absolute -left-[3px] top-1.5 h-2 w-2 rounded-full bg-crimson sm:hidden" />
                                        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-navy-800">{milestone.title}</h3>
                                        <p className="mt-2 text-sm leading-7 text-ink-muted">{milestone.body}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <LeadershipStrip members={boardMembers} />

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

            <section className="bg-navy-950 px-5 py-14 text-white sm:px-8 sm:py-20">
                <div className={`${shell} flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between`}>
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-caps text-gold">Your company belongs here</p>
                        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Join the network shaping bilateral business.</h2>
                        <p className="mt-4 max-w-xl leading-7 text-white/65">Build trusted connections, strengthen your voice and access opportunities across Tanzania and the United States.</p>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Link href="/membership" className={btn.primaryLg}>Explore membership <Icon name="arrow" className="h-4 w-4" /></Link>
                        <Link href="/contact-us" className={btn.outlineLight}>Talk to the Secretariat</Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
