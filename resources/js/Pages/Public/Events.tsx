import FilterBar from '@/Components/Public/FilterBar';
import PageHero from '@/Components/Public/PageHero';
import Icon from '@/Components/Public/Icon';
import Reveal from '@/Components/Public/Reveal';
import Pagination from '@/Components/Public/Pagination';
import { card, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Event, Paginated, PageProps } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { useCms } from '@/utils/cms';
import { renderEventDescription } from '@/utils/event';

type EventsProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    events: Paginated<Event>;
    featured: Event | null;
    categories: string[];
    filters: { category: string | null; q: string | null };
}>;

function formatPublishedDate(event: Event): string {
    return new Date(event.published_at ?? event.created_at).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Africa/Dar_es_Salaam',
    });
}

function formatEventDateTime(event: Event): string {
    return `${new Date(event.starts_at).toLocaleString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', timeZone: 'Africa/Dar_es_Salaam',
    })} EAT`;
}

function eventDay(event: Event): { day: string; month: string } {
    const start = new Date(event.starts_at);
    return {
        day: start.toLocaleDateString('en-US', { day: '2-digit' }),
        month: start.toLocaleDateString('en-US', { month: 'short' }),
    };
}

function eventExcerpt(event: Event): string {
    return renderEventDescription(event).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function isWithinTwoMonths(event: Event): boolean {
    const startsAt = new Date(event.starts_at).getTime();
    const now = Date.now();
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
    return startsAt >= now && startsAt <= twoMonthsFromNow.getTime();
}

export default function Events({ canLogin, canRegister, events, featured, categories, filters }: EventsProps) {
    const t = useCms();
    const filterItems = ['All', ...categories];
    const [category, setCategory] = useState(filters.category ?? 'All');
    const [query, setQuery] = useState(filters.q ?? '');
    const firstRender = useRef(true);
    const navigate = (nextCategory: string, nextQuery: string) => {
        const params: Record<string, string> = {};
        if (nextCategory !== 'All') params.category = nextCategory;
        if (nextQuery.trim()) params.q = nextQuery.trim();
        router.get(route('events'), params, { preserveState: true, preserveScroll: true, replace: true });
    };
    useEffect(() => {
        if (firstRender.current) { firstRender.current = false; return; }
        const timer = window.setTimeout(() => navigate(category, query), 350);
        return () => window.clearTimeout(timer);
    }, [query]);
    const chooseCategory = (next: string) => { setCategory(next); navigate(next, query); };

    return (
        <PublicLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title="AMCHAM Tanzania Events" />
            <PageHero
                eyebrow="Events"
                title={t('events_hero_title', 'Where the business community meets.')}
                description={t('events_hero_description', 'Policy briefings, executive roundtables, flagship celebrations and practical conversations that move business forward.')}
                image={t('events_hero_image', '/images/amcham-live/thanksgiving.png')}
                breadcrumb={[{ label: 'Events' }]}
            />

            {featured && (
                <section className="relative overflow-hidden bg-mist px-5 py-14 sm:px-8 sm:py-20">
                    <div aria-hidden="true" className="absolute -right-24 top-10 h-72 w-72 rounded-full border border-navy-100" />
                    <div className={`${shell} relative`}>
                        <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-caps text-crimson"><span className="h-px w-8 bg-current" />{t('events_spotlight_eyebrow', 'Coming up')}</p>
                                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">{t('events_spotlight_title', 'Featured event.')}</h2>
                            </div>
                            <p className="max-w-md text-sm leading-6 text-ink-muted">{t('events_spotlight_description', 'Reserve your place at the chamber’s next convening.')}</p>
                        </Reveal>

                        <Reveal delay={100}>
                            <article className="group grid overflow-hidden rounded-2xl border border-line bg-white shadow-card-lg lg:grid-cols-[1.08fr_0.92fr]">
                                <Link href={route('events.show', featured.slug)} className="relative block min-h-[20rem] overflow-hidden sm:min-h-[26rem] lg:min-h-[34rem]">
                                    <img src={featured.cover_image_path ?? '/images/amcham-live/thanksgiving.png'} alt={featured.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
                                    {featured.category && <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-navy-950/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-caps text-white backdrop-blur-md sm:left-7 sm:top-7">{featured.category}</span>}
                                    <div className="absolute bottom-5 left-5 grid min-w-20 place-items-center rounded-xl bg-white/95 px-4 py-3 text-center shadow-card backdrop-blur sm:bottom-7 sm:left-7">
                                        <span className="font-display text-3xl font-semibold leading-none text-navy-900">{eventDay(featured).day}</span>
                                        <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-crimson">{eventDay(featured).month}</span>
                                    </div>
                                </Link>

                                <div className="relative flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-14">
                                    <span className="absolute inset-x-0 top-0 h-1 brand-rule lg:inset-y-0 lg:left-0 lg:right-auto lg:h-full lg:w-1" aria-hidden="true" />
                                    <p className="text-xs font-semibold uppercase tracking-caps text-crimson">Reserve your place</p>
                                    <h3 className="mt-5 font-display text-3xl font-semibold leading-[1.12] tracking-tight text-navy-900 text-balance sm:text-4xl lg:text-[2.65rem]">{featured.title}</h3>
                                    <p className="mt-6 line-clamp-4 text-base leading-8 text-ink-muted sm:text-lg">{eventExcerpt(featured)}</p>
                                    <div className="mt-7 grid gap-3 border-t border-line pt-6 text-sm font-medium text-ink-faint">
                                        <span>Published on {formatPublishedDate(featured)}</span>
                                        <span className="inline-flex items-center gap-2"><Icon name="calendar" className="h-4 w-4 text-crimson" /><span><strong className="text-navy-800">Event date and time:</strong> {formatEventDateTime(featured)}</span></span>
                                        {featured.location && <span className="inline-flex items-center gap-2"><Icon name="pin" className="h-4 w-4 text-crimson" />{featured.location}</span>}
                                    </div>
                                    <Link href={route('events.show', featured.slug)} className="mt-8 inline-flex w-fit items-center gap-2.5 text-sm font-semibold text-crimson">View event details <span className="grid h-9 w-9 place-items-center rounded-full bg-crimson text-white transition group-hover:translate-x-1"><Icon name="arrow" className="h-4 w-4" /></span></Link>
                                </div>
                            </article>
                        </Reveal>
                    </div>
                </section>
            )}

            <section className={sectionPad}>
                <div className={shell}>
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                        <FilterBar items={filterItems} active={category} onChange={chooseCategory} />
                        <label className="relative block w-full lg:max-w-xs"><span className="sr-only">Search events</span><Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('events_search_placeholder', 'Search events…')} className="w-full rounded-full border-line bg-white py-3 pl-11 pr-5 text-sm shadow-card focus:border-navy-800 focus:ring-navy-800" /></label>
                        <p className="text-sm font-medium text-ink-faint">
                            {events.total} {events.total === 1 ? 'event' : 'events'}
                        </p>
                    </div>

                    {events.data.length === 0 && <p className="mt-10 text-ink-muted">{t('events_empty', 'No events match your search yet.')}</p>}

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        {events.data.map((event, index) => {
                            const { day, month } = eventDay(event);
                            return (
                                <Reveal key={event.slug} delay={(index % 2) * 100}>
                                    <Link href={route('events.show', event.slug)} className={`${card} group flex h-full flex-col overflow-hidden`}>
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={event.cover_image_path ?? '/images/amcham-live/boards.jpg'}
                                                alt={event.title}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
                                            <div className="absolute left-5 top-5 grid w-16 place-items-center rounded-xl bg-white/95 py-2.5 text-center shadow-card backdrop-blur">
                                                <span className="font-display text-2xl font-semibold leading-none text-navy-800">{day}</span>
                                                <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-crimson">{month}</span>
                                            </div>
                                            {event.category && (
                                                <span className="absolute bottom-5 left-5 rounded-full bg-crimson px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                                                    {event.category}
                                                </span>
                                            )}
                                            {isWithinTwoMonths(event) && (
                                                <span className="absolute bottom-5 right-5 rounded-full bg-gold px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-navy-950 shadow-card">
                                                    Coming soon
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col p-7">
                                            <h2 className="text-xl font-bold leading-snug text-navy-800 transition group-hover:text-crimson">{event.title}</h2>
                                            <p className="mt-3 line-clamp-2 flex-1 leading-7 text-ink-muted">{eventExcerpt(event)}</p>
                                            <div className="mt-6 grid gap-2 border-t border-line pt-5 text-sm font-medium text-ink-faint">
                                                <span>Published on {formatPublishedDate(event)}</span>
                                                <span className="inline-flex items-center gap-2">
                                                    <Icon name="calendar" className="h-4 w-4 text-crimson" />
                                                    <span><strong className="text-navy-800">Event date and time:</strong> {formatEventDateTime(event)}</span>
                                                </span>
                                                {event.location && (
                                                    <span className="inline-flex items-center gap-2">
                                                        <Icon name="pin" className="h-4 w-4 text-crimson" />
                                                        {event.location}
                                                    </span>
                                                )}
                                                {event.company && (
                                                    <span className="inline-flex items-center gap-2">
                                                        <Icon name="briefcase" className="h-4 w-4 text-crimson" />
                                                        {event.company.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </Reveal>
                            );
                        })}
                    </div>
                    <Pagination currentPage={events.current_page} lastPage={events.last_page} href="/events" params={{ category: filters.category, q: filters.q }} />
                </div>
            </section>
        </PublicLayout>
    );
}
