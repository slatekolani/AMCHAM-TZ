import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Event } from '@/types';
import Icon from '@/Components/Public/Icon';
import { renderEventDescription } from '@/utils/event';
import CountUp from '@/Components/Public/CountUp';
import { btn, eyebrowDot, eyebrowLight, shell } from '@/Components/Public/ui';

type FallbackHero = {
    eyebrow: string;
    heading: string;
    body: string;
    primaryCtaLabel: string;
    primaryCtaUrl: string;
    secondaryCtaLabel: string;
    secondaryCtaUrl: string;
};

type HeroCarouselProps = {
    events: Event[];
    total: number;
    fallback: FallbackHero;
    stats: { label: string; value: string }[];
};

const FALLBACK_IMAGE = '/images/amcham-live/hero-minara.jpg';
const AUTO_ADVANCE_MS = 6500;

function stripHtml(html: string | null): string {
    return (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

type Urgency = { label: string; tone: 'live' | 'urgent' | 'soon' | 'scheduled'; pulse: boolean };

function getUrgency(startsAt: string): Urgency {
    const diffMs = new Date(startsAt).getTime() - Date.now();
    const days = Math.ceil(diffMs / 86_400_000);

    if (days <= 0) return { label: 'Happening now', tone: 'live', pulse: true };
    if (days === 1) return { label: 'Happening tomorrow', tone: 'urgent', pulse: true };
    if (days <= 7) return { label: `In ${days} days — don't miss it`, tone: 'urgent', pulse: true };
    if (days <= 30) return { label: `Coming up · in ${days} days`, tone: 'soon', pulse: false };
    return {
        label: new Date(startsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        tone: 'scheduled',
        pulse: false,
    };
}

const toneClasses: Record<Urgency['tone'], string> = {
    live: 'bg-emerald-500 text-white',
    urgent: 'bg-crimson text-white',
    soon: 'bg-gold/15 text-gold ring-1 ring-inset ring-gold/40',
    scheduled: 'bg-white/10 text-white/80 ring-1 ring-inset ring-white/15',
};

function UrgencyBadge({ startsAt }: { startsAt: string }) {
    const urgency = getUrgency(startsAt);
    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide ${toneClasses[urgency.tone]}`}>
            {urgency.pulse ? (
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
            ) : (
                <Icon name="clock" className="h-3.5 w-3.5" />
            )}
            {urgency.label}
        </span>
    );
}

function formatMeta(event: Event): string {
    const date = new Date(event.starts_at).toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Africa/Dar_es_Salaam',
    });
    const time = new Date(event.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Africa/Dar_es_Salaam' });
    return `${date} · ${time} EAT`;
}

function EventSlide({ event, active }: { event: Event; active: boolean }) {
    return (
        <div
            aria-hidden={!active}
            className={'relative col-start-1 row-start-1 transition-opacity duration-700 ease-out ' + (active ? 'opacity-100' : 'pointer-events-none opacity-0')}
        >
            <img
                src={event.cover_image_path ?? FALLBACK_IMAGE}
                alt=""
                className={'absolute inset-0 h-full w-full object-cover ' + (active ? 'animate-slow-zoom' : '')}
            />
            <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(6,13,29,0.84)_0%,rgba(11,23,48,0.64)_42%,rgba(15,33,72,0.28)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,13,29,0.58)_0%,rgba(6,13,29,0)_42%)]" />

            <div className={`${shell} relative flex h-full items-center px-5 sm:px-8`}>
                <div className={'w-full max-w-2xl pb-28 pt-16 transition-all duration-700 sm:pb-32 sm:pt-24 ' + (active ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>
                    <div className="flex flex-wrap items-center gap-3">
                        <UrgencyBadge startsAt={event.starts_at} />
                        {event.category && (
                            <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80 ring-1 ring-inset ring-white/15">
                                {event.category}
                            </span>
                        )}
                    </div>

                    <h1 className="mt-5 line-clamp-4 font-display text-[2rem] font-semibold leading-[1.1] tracking-tight text-balance sm:mt-6 sm:line-clamp-none sm:text-5xl lg:text-[3.4rem]">
                        {event.title}
                    </h1>

                    {renderEventDescription(event) && (
                        <p className="mt-5 line-clamp-3 max-w-xl text-lg leading-8 text-white/70">{stripHtml(renderEventDescription(event))}</p>
                    )}

                    <div className="mt-6 grid gap-2 text-sm font-medium text-white/75">
                        <span>Published on {new Date(event.published_at ?? event.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Africa/Dar_es_Salaam' })}</span>
                        <span className="inline-flex items-center gap-2">
                            <Icon name="calendar" className="h-4 w-4 text-gold" />
                            <span><strong className="text-white">Event date and time:</strong> {formatMeta(event)}</span>
                        </span>
                        {event.location && (
                            <span className="inline-flex items-center gap-2">
                                <Icon name="pin" className="h-4 w-4 text-gold" />
                                {event.location}
                            </span>
                        )}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4">
                        <Link href={`${route('events.show', event.slug)}#register`} className={btn.primaryLg} tabIndex={active ? 0 : -1}>
                            Register Now
                            <Icon name="arrow" className="h-4 w-4" />
                        </Link>
                        <Link href={route('events.show', event.slug)} className={btn.outlineLight} tabIndex={active ? 0 : -1}>
                            View Event
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StaticHero({ fallback }: { fallback: FallbackHero }) {
    return (
        <div className="relative col-start-1 row-start-1">
            <img src={FALLBACK_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover animate-slow-zoom" />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(6,13,29,0.84)_0%,rgba(11,23,48,0.64)_48%,rgba(15,33,72,0.28)_100%)]" />
            <div className={`${shell} relative flex h-full items-center px-5 sm:px-8`}>
                <div className="w-full max-w-3xl pb-28 pt-16 sm:pb-32 sm:pt-24">
                    <p className={eyebrowLight}>
                        <span className={eyebrowDot} />
                        {fallback.eyebrow}
                    </p>
                    <h1 className="mt-7 font-display text-[2.75rem] font-semibold leading-[1.06] tracking-tight text-balance sm:text-6xl lg:text-[4.25rem]">
                        {fallback.heading}
                    </h1>
                    <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">{fallback.body}</p>
                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        <a href={fallback.primaryCtaUrl} className={btn.primaryLg}>
                            {fallback.primaryCtaLabel}
                            <Icon name="arrow" className="h-4 w-4" />
                        </a>
                        <a href={fallback.secondaryCtaUrl} className={btn.outlineLight}>
                            {fallback.secondaryCtaLabel}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HeroCarousel({ events, total, fallback, stats }: HeroCarouselProps) {
    const slides = events.slice(0, 5);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const regionRef = useRef<HTMLDivElement>(null);

    const go = (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length);

    useEffect(() => {
        if (paused || slides.length < 2) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTO_ADVANCE_MS);
        return () => clearInterval(timer);
    }, [paused, slides.length]);

    const hasEvents = slides.length > 0;

    return (
        <section className="relative bg-navy-950 text-white">
            <div
                ref={regionRef}
                className="relative grid min-h-[34rem] overflow-hidden sm:min-h-[40rem] lg:min-h-[44rem]"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocusCapture={() => setPaused(true)}
                onBlurCapture={() => setPaused(false)}
                aria-roledescription="carousel"
                aria-label="Upcoming events"
            >
                {hasEvents ? slides.map((event, i) => <EventSlide key={event.slug} event={event} active={i === index} />) : <StaticHero fallback={fallback} />}

                {/* Controls */}
                {hasEvents && (
                    <div className="absolute inset-x-0 bottom-0 z-10">
                        <div className={`${shell} flex items-center justify-between gap-4 px-5 pb-8 sm:px-8`}>
                            <div className="flex items-center gap-2.5" role="tablist" aria-label="Choose slide">
                                {slides.map((event, i) => (
                                    <button
                                        key={event.slug}
                                        type="button"
                                        role="tab"
                                        aria-selected={i === index}
                                        aria-label={`Go to “${event.title}”`}
                                        onClick={() => setIndex(i)}
                                        className={
                                            'h-1.5 rounded-full transition-all duration-300 ' +
                                            (i === index ? 'w-8 bg-crimson' : 'w-2.5 bg-white/35 hover:bg-white/60')
                                        }
                                    />
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                {total > 5 && (
                                    <Link
                                        href={route('events')}
                                        className="hidden items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white sm:inline-flex"
                                    >
                                        See all {total} events
                                        <Icon name="arrow" className="h-4 w-4" />
                                    </Link>
                                )}
                                {slides.length > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => go(index - 1)}
                                            aria-label="Previous event"
                                            className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white/10"
                                        >
                                            <Icon name="arrow" className="h-4 w-4 rotate-180" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => go(index + 1)}
                                            aria-label="Next event"
                                            className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white/10"
                                        >
                                            <Icon name="arrow" className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="absolute inset-x-0 bottom-0 z-0 h-1 brand-rule" />
            </div>

            {/* Mobile "view all" (controls row hides it on small screens) */}
            {hasEvents && total > 5 && (
                <div className="border-t border-white/10 sm:hidden">
                    <Link href={route('events')} className={`${shell} flex items-center justify-between px-5 py-4 text-sm font-semibold text-white`}>
                        See all {total} events
                        <Icon name="arrow" className="h-4 w-4 text-crimson" />
                    </Link>
                </div>
            )}

            {/* Stats strip */}
            {stats.length > 0 && (
                <div className="border-t border-white/10 bg-navy-950">
                    <div className={`${shell} grid grid-cols-2 divide-white/10 px-5 sm:px-8 lg:grid-cols-4`}>
                        {stats.map((stat, i) => (
                            <div
                                key={stat.label}
                                className={
                                    'px-2 py-7 sm:px-8 ' +
                                    (i % 2 === 1 ? 'border-l border-white/10 sm:border-l-0 ' : '') +
                                    (i >= 2 ? 'border-t border-white/10 sm:border-t-0' : '')
                                }
                            >
                                <p className="font-display text-3xl font-semibold text-white sm:text-4xl"><CountUp value={stat.value} /></p>
                                <p className="mt-1.5 text-xs font-semibold uppercase tracking-caps text-white/50">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
