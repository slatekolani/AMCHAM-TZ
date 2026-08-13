import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { BoardMember, Company, Event, HeadingTextBlockData, HeroBlockData, HeroCarouselConfig, MembershipTier, NewsArticle, Page, PageProps, Testimonial } from '@/types';
import { getBlock } from '@/utils/blocks';
import Icon from '@/Components/Public/Icon';
import CompanyMarquee from '@/Components/Public/CompanyMarquee';
import BilateralCorridor from '@/Components/Public/BilateralCorridor';
import NewsroomIndex from '@/Components/Public/NewsroomIndex';
import LeadershipStrip from '@/Components/Public/LeadershipStrip';
import TestimonialsStrip from '@/Components/Public/TestimonialsStrip';
import JoinPathway from '@/Components/Public/JoinPathway';
import ChamberPillars from '@/Components/Public/ChamberPillars';
import { tierAccent } from '@/Components/Public/tierAccent';
import Reveal from '@/Components/Public/Reveal';
import { btn, card, eyebrow, eyebrowDot, sectionPad, shell } from '@/Components/Public/ui';
import { useEffect, useState } from 'react';

type WelcomeProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    page: Page | null;
    heroEvents: Event[];
    heroEventsTotal: number;
    upcomingEvents: Event[];
    latestNews: NewsArticle[];
    boardMembers: BoardMember[];
    testimonials: Testimonial[];
    membershipTiers: MembershipTier[];
    featuredCompanies: Company[];
    galleryImages: string[];
    heroCarousel: HeroCarouselConfig;
}>;

const defaultPillars: { title: string; body: string; image: string }[] = [
    {
        title: 'Trade & Investment',
        body: 'U.S.–Tanzania investment facilitation, policy insight and business intelligence for decision makers.',
        image: '/images/amcham-live/ppp-growth.png',
    },
    {
        title: 'Membership',
        body: 'Clear tiers, company visibility and a stronger digital presence for every member organisation.',
        image: '/images/amcham-live/boards.jpg',
    },
    {
        title: 'Events',
        body: 'Flagship dinners, executive roundtables and policy briefings across the calendar year.',
        image: '/images/amcham-live/thanksgiving.png',
    },
    {
        title: 'Publications',
        body: 'News, policy updates and member articles curated under editorial review by the Secretariat.',
        image: '/images/amcham-live/tic-news.jpg',
    },
];

function formatTierPrice(tier: MembershipTier): string {
    if (!tier.price) return 'Free';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: tier.currency, maximumFractionDigits: 0 }).format(Number(tier.price));
}

function formatEventDate(event: Event): string {
    return `${new Date(event.starts_at).toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'Africa/Dar_es_Salaam',
    })} EAT`;
}

function stripHtml(html: string | null): string {
    return (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function Welcome({
    canLogin,
    canRegister,
    page,
    heroEvents,
    heroEventsTotal,
    upcomingEvents,
    latestNews,
    boardMembers,
    testimonials,
    membershipTiers,
    featuredCompanies,
    galleryImages,
    heroCarousel,
}: WelcomeProps) {
    const hero: HeroBlockData = getBlock(page, 'hero') ?? { heading: '' };
    const stats = getBlock(page, 'stats')?.items ?? [];
    const intro: HeadingTextBlockData = getBlock(page, 'heading_text') ?? { heading: '' };
    const pillars = getBlock(page, 'values_grid')?.items ?? defaultPillars;
    const copy = page?.content?.copy ?? {};
    const [featuredEvent, ...restEvents] = upcomingEvents;
    const eventCoverImages = Array.from(new Set(
        [...upcomingEvents, ...heroEvents]
            .map((event) => event.cover_image_path)
            .filter((image): image is string => Boolean(image)),
    ));
    const ctaEventImages = eventCoverImages.length > 0 ? eventCoverImages : ['/images/amcham-live/boards.jpg'];
    const primaryEventImage = ctaEventImages[0];
    const eventImageAt = (index: number) => ctaEventImages[index % ctaEventImages.length];
    const [ctaImageIndex, setCtaImageIndex] = useState(0);

    useEffect(() => {
        setCtaImageIndex(0);
        if (ctaEventImages.length < 2) return;

        const interval = window.setInterval(() => {
            setCtaImageIndex((current) => (current + 1) % ctaEventImages.length);
        }, 5000);

        return () => window.clearInterval(interval);
    }, [ctaEventImages.length]);

    return (
        <PublicLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title={page?.meta_title ?? 'AMCHAM Tanzania | American Chamber of Commerce in Tanzania'} />

            {/* ============ Bilateral hero carousel ============ */}
            <BilateralCorridor companies={featuredCompanies} images={galleryImages?.length ? galleryImages : ctaEventImages} config={heroCarousel} copy={copy} />

            {/* ============ Member logo strip ============ */}
            <CompanyMarquee companies={featuredCompanies} copy={copy} />

            {/* ============ Mission / pillars ============ */}
            <ChamberPillars
                heading={intro.heading || 'The chamber connecting U.S. and Tanzanian business.'}
                body={
                    intro.body ||
                    'AMCHAM Tanzania connects businesses for sustainable growth and economic competitiveness through advocacy, member services and a stronger digital platform.'
                }
                pillars={pillars}
                copy={copy}
            />

            {/* ============ Events ============ */}
            <section className={sectionPad}>
                <div className={shell}>
                    <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                        <div>
                            <p className={eyebrow}>
                                <span className={eyebrowDot} />
                                {copy.events_eyebrow || 'Events'}
                            </p>
                            <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-navy-800 text-balance sm:text-4xl">
                                {copy.events_heading || 'Where the business community convenes.'}
                            </h2>
                        </div>
                        <Link href={route('events')} className={`${btn.outline} self-start lg:self-auto`}>
                            {copy.events_button || 'View All Events'}
                            <Icon name="arrow" className="h-4 w-4" />
                        </Link>
                    </Reveal>

                    {featuredEvent ? (
                        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                            <Reveal>
                                <Link
                                    href={route('events.show', featuredEvent.slug)}
                                    className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-2xl bg-navy-900 shadow-card transition duration-300 hover:shadow-card-lg"
                                >
                                    <img
                                        src={featuredEvent.cover_image_path ?? primaryEventImage}
                                        alt={featuredEvent.title}
                                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" />
                                    <div className="relative p-8 text-white lg:p-10">
                                        <span className="inline-flex rounded-full bg-crimson px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide">
                                            {featuredEvent.category ?? 'Featured Event'}
                                        </span>
                                        <h3 className="mt-4 font-display text-2xl font-semibold leading-snug sm:text-3xl">{featuredEvent.title}</h3>
                                        <p className="mt-4 flex flex-wrap items-center gap-2.5 text-sm font-semibold text-white/75">
                                            <Icon name="calendar" className="h-4 w-4 text-gold" />
                                            {formatEventDate(featuredEvent)}
                                            {featuredEvent.location && <><span className="text-white/40">·</span><Icon name="pin" className="h-4 w-4 text-gold" />{featuredEvent.location}</>}
                                        </p>
                                    </div>
                                </Link>
                            </Reveal>

                            <div className="grid content-start gap-5">
                                {restEvents.slice(0, 2).map((event, index) => (
                                    <Reveal key={event.slug} delay={index * 100}>
                                        <Link href={route('events.show', event.slug)} className={`${card} group flex gap-5 p-5`}>
                                            <div className="hidden h-28 w-36 shrink-0 overflow-hidden rounded-xl sm:block">
                                                <img
                                                    src={event.cover_image_path ?? eventImageAt(index + 1)}
                                                    alt=""
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="min-w-0 py-1">
                                                <p className="text-xs font-semibold uppercase tracking-caps text-crimson">{event.category ?? 'Event'}</p>
                                                <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-navy-800 transition group-hover:text-crimson">
                                                    {event.title}
                                                </h3>
                                                <p className="mt-2.5 flex items-center gap-2 text-sm font-medium text-ink-faint">
                                                    <Icon name="calendar" className="h-4 w-4" />
                                                    <span>{formatEventDate(event)}{event.location ? ` · ${event.location}` : ''}</span>
                                                </p>
                                            </div>
                                        </Link>
                                    </Reveal>
                                ))}
                                {copy.events_note && (
                                    <Reveal delay={200}>
                                        <div className="rounded-2xl border border-dashed border-navy-200 bg-navy-50 p-6 text-sm leading-6 text-ink-muted">
                                            {copy.events_note}
                                        </div>
                                    </Reveal>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="mt-10 text-ink-muted">{copy.events_empty || 'No upcoming events published yet — check back soon.'}</p>
                    )}
                </div>
            </section>

            {/* ============ Newsroom ============ */}
            <NewsroomIndex articles={latestNews} copy={copy} />

            {/* ============ Leadership ============ */}
            <LeadershipStrip members={boardMembers} copy={copy} />

            {/* ============ Testimonials ============ */}
            <TestimonialsStrip testimonials={testimonials} copy={copy} />

            {/* ============ Membership tiers ============ */}
            <section className={sectionPad}>
                <div className={shell}>
                    <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                        <div>
                            <p className={eyebrow}>
                                <span className={eyebrowDot} />
                                {copy.membership_eyebrow || 'Become a Member'}
                            </p>
                            <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-navy-800 text-balance sm:text-4xl">
                                {copy.membership_heading || 'Membership built around your business.'}
                            </h2>
                        </div>
                        <p className="max-w-md text-lg leading-8 text-ink-muted">
                            {copy.membership_body || 'Visibility, policy access, event participation and a digital company profile — every tier includes direct chamber communication.'}
                        </p>
                    </Reveal>

                    <div className="mt-12 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {membershipTiers.map((tier, index) => {
                            const accent = tierAccent(tier);

                            return (
                            <Reveal key={tier.slug} delay={index * 90}>
                                <article className={`${card} group relative flex h-full flex-col overflow-hidden p-7 transition hover:-translate-y-1`}>
                                    <span className="absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity duration-300 group-hover:opacity-100" style={{ backgroundImage: accent.rule }} />
                                    <h3 className="text-xs font-semibold uppercase tracking-caps" style={{ color: accent.label }}>{tier.name} membership</h3>
                                    <p className="mt-4 font-display text-3xl font-semibold text-navy-800">
                                        {formatTierPrice(tier)}
                                        <span className="ml-1 font-sans text-sm font-medium text-ink-faint">/ {tier.billing_period}</span>
                                    </p>
                                    <p className="mt-3 text-sm font-semibold text-navy-700">{tier.audience}</p>
                                    <p className="mt-3 text-sm leading-7 text-ink-muted">{tier.description || copy.membership_fallback_description || 'AMCHAM Tanzania membership tailored to this member category.'}</p>
                                    <ul className="mt-5 grid flex-1 gap-2.5">{tier.benefits.map((benefit) => <li key={benefit} className="flex items-start gap-2.5 text-sm leading-6 text-ink"><Icon name="check" className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-600" />{benefit}</li>)}</ul>
                                    <Link href={route('membership.join', tier.slug)} className={`${btn.primary} mt-6 w-full`}>
                                        {copy.membership_join_prefix || 'Join'} {tier.name}
                                        <Icon name="arrow" className="h-4 w-4" />
                                    </Link>
                                </article>
                            </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============ Join pathway ============ */}
            <JoinPathway tiers={membershipTiers} copy={copy} />

        </PublicLayout>
    );
}
