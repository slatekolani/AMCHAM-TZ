import FilterBar from '@/Components/Public/FilterBar';
import PageHero from '@/Components/Public/PageHero';
import Icon from '@/Components/Public/Icon';
import Reveal from '@/Components/Public/Reveal';
import CountUp from '@/Components/Public/CountUp';
import Pagination from '@/Components/Public/Pagination';
import { tierAccent } from '@/Components/Public/tierAccent';
import { btn, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Company, Paginated, PageProps } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { useCms } from '@/utils/cms';

type MembersProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    members: Paginated<Company>;
    sectors: string[];
    summary: { members: number; sectors: number; tiers: number };
    filters: { sector: string | null; q: string | null };
}>;

/** Cap the blurb at a fixed word count, trailing an ellipsis when it runs longer. */
const DESCRIPTION_WORD_LIMIT = 38;

function truncateWords(text: string | null, limit = DESCRIPTION_WORD_LIMIT): string {
    if (!text) return '';
    const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = clean.split(' ');
    return words.length <= limit ? clean : `${words.slice(0, limit).join(' ')}…`;
}

/** Shows the domain rather than the raw URL. */
function prettyDomain(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export default function Members({ canLogin, canRegister, members, sectors, summary, filters }: MembersProps) {
    const t = useCms();
    const filterItems = ['All', ...sectors];
    const [sector, setSector] = useState(filters.sector ?? 'All');
    const [query, setQuery] = useState(filters.q ?? '');
    const firstRender = useRef(true);
    const navigate = (nextSector: string, nextQuery: string) => {
        const params: Record<string, string> = {};
        if (nextSector !== 'All') params.sector = nextSector;
        if (nextQuery.trim()) params.q = nextQuery.trim();
        router.get(route('members'), params, { preserveState: true, preserveScroll: true, replace: true });
    };
    useEffect(() => {
        if (firstRender.current) { firstRender.current = false; return; }
        const timer = window.setTimeout(() => navigate(sector, query), 350);
        return () => window.clearTimeout(timer);
    }, [query]);
    const chooseSector = (next: string) => { setSector(next); navigate(next, query); };
    const clearFilters = () => { setSector('All'); setQuery(''); navigate('All', ''); };

    return (
        <PublicLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title="AMCHAM Tanzania Members" />
            <PageHero
                eyebrow="Member Directory"
                title={t('members_hero_title', 'The companies shaping U.S.–Tanzania business.')}
                description={t('members_hero_description', 'American and Tanzanian companies across banking, healthcare, energy, mining and logistics call AMCHAM Tanzania home.')}
                image={t('members_hero_image', '/images/amcham-live/hero-minara.jpg')}
                breadcrumb={[{ label: 'Members' }]}
                compact
            />

            <section className="relative z-10 -mt-8 px-5 sm:-mt-10 sm:px-8">
                <div className={shell}>
                    <div className="grid overflow-hidden rounded-2xl border border-white/20 bg-white shadow-card-lg sm:grid-cols-3">
                        {[
                            { value: '80+', label: 'Member companies', sub: 'One trusted network' },
                            { value: '12+', label: 'Sectors represented', sub: 'Across the economy' },
                        ].map((stat, index) => (
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

            <section className={`${sectionPad} bg-mist`}>
                <div className={shell}>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-caps text-crimson">{t('members_section_eyebrow', 'Explore the network')}</p>
                            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">{t('members_section_title', 'Meet our members.')}</h2>
                        </div>
                        <p className="max-w-lg text-sm leading-6 text-ink-muted sm:text-base">{t('members_section_description', 'Discover the organizations investing, innovating and building stronger commercial ties between Tanzania and the United States.')}</p>
                    </div>

                    <div className="mt-8 rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                            <label className="relative block min-w-0 flex-1">
                                <span className="sr-only">Search member companies</span>
                                <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder={t('members_search_placeholder', 'Search companies, sectors or services…')}
                                    className="min-h-12 w-full rounded-xl border border-line bg-mist pl-11 pr-4 text-sm text-navy-900 outline-none transition placeholder:text-ink-faint focus:border-navy-400 focus:bg-white focus:ring-4 focus:ring-navy-100"
                                />
                            </label>
                            <div className="md:hidden">
                                <label className="sr-only" htmlFor="member-sector">Filter by sector</label>
                                <select id="member-sector" value={sector} onChange={(event) => chooseSector(event.target.value)} className="min-h-12 w-full rounded-xl border border-line bg-white px-4 text-sm font-semibold text-navy-800">
                                    {filterItems.map((item) => <option key={item} value={item}>{item === 'All' ? 'All sectors' : item}</option>)}
                                </select>
                            </div>
                            <p className="shrink-0 text-sm font-semibold text-navy-700" aria-live="polite">
                                {members.total} {members.total === 1 ? 'company' : 'companies'}
                            </p>
                        </div>

                        <div className="mt-4 hidden border-t border-line pt-4 md:block">
                            <FilterBar items={filterItems} active={sector} onChange={chooseSector} />
                        </div>
                    </div>

                    {members.data.length === 0 && (
                        <div className="mt-8 rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-14 text-center">
                            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-navy-50 text-navy-700"><Icon name="search" className="h-5 w-5" /></span>
                            <h3 className="mt-4 font-display text-xl font-semibold text-navy-900">{t('members_empty_title', 'No matching members')}</h3>
                            <p className="mt-2 text-sm text-ink-muted">{t('members_empty_body', 'Try a different company name or explore all sectors.')}</p>
                            <button type="button" onClick={clearFilters} className="mt-5 text-sm font-semibold text-crimson hover:text-crimson-600">{t('members_clear', 'Clear all filters')}</button>
                        </div>
                    )}

                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {members.data.map((member, index) => {
                            const blurb = truncateWords(member.description);
                            const accent = tierAccent(member.membership_tier ?? {});

                            return (
                                <Reveal key={member.slug} delay={(index % 4) * 60}>
                                    <Link
                                        href={route('members.show', member.slug)}
                                        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-navy-200 hover:shadow-card-lg sm:p-6"
                                    >
                                        <span className="absolute inset-x-0 top-0 h-1" style={{ background: accent.rule }} aria-hidden="true" />
                                        <div className="grid h-24 shrink-0 place-items-center rounded-xl border border-line/80 bg-gradient-to-br from-white to-mist p-4 transition duration-300 group-hover:border-navy-100 group-hover:to-navy-50">
                                            {member.logo_path ? (
                                                <img
                                                    src={member.logo_path}
                                                    alt={`${member.name} logo`}
                                                    className="max-h-14 max-w-[85%] object-contain transition duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <span className="grid h-14 w-14 place-items-center rounded-full bg-navy-800 font-display text-2xl font-semibold text-white">
                                                    {member.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-5 min-w-0">
                                                <h2 className="line-clamp-2 text-lg font-bold leading-snug text-navy-900 transition group-hover:text-crimson">
                                                    {member.name}
                                                </h2>
                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                {member.sector && <span className="rounded-full bg-navy-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-navy-700">{member.sector}</span>}
                                            {member.membership_tier && (
                                                <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide" style={{ color: accent.label, borderColor: `${accent.mark}55`, backgroundColor: `${accent.mark}0D` }}>
                                                    {member.membership_tier.name}
                                                </span>
                                            )}
                                            </div>
                                        </div>

                                        {blurb && (
                                            <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-ink-muted">
                                                {blurb}
                                            </p>
                                        )}

                                        <div className="mt-5 border-t border-line pt-4">
                                            {member.website && <p className="mb-3 flex min-w-0 items-center gap-1.5 text-[11px] text-ink-faint"><Icon name="globe" className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{prettyDomain(member.website)}</span></p>}
                                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-crimson">
                                                Explore company
                                                <Icon
                                                    name="arrow"
                                                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                                />
                                            </span>
                                        </div>
                                    </Link>
                                </Reveal>
                            );
                        })}
                    </div>
                    <Pagination currentPage={members.current_page} lastPage={members.last_page} href="/members" params={{ sector: filters.sector, q: filters.q }} />
                </div>
            </section>

            <section className="bg-navy-950 px-5 py-14 text-white sm:px-8 sm:py-20">
                <div className={`${shell} flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between`}>
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-caps text-gold">{t('members_cta_eyebrow', 'Your company belongs here')}</p>
                        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t('members_cta_title', 'Join the network shaping bilateral business.')}</h2>
                        <p className="mt-4 max-w-xl leading-7 text-white/65">{t('members_cta_body', 'Build trusted connections, strengthen your voice and access opportunities across Tanzania and the United States.')}</p>
                    </div>
                    <Link href="/membership" className={btn.primaryLg}>{t('members_cta_button', 'Explore membership')} <Icon name="arrow" className="h-4 w-4" /></Link>
                </div>
            </section>
        </PublicLayout>
    );
}
