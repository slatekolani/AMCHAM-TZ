import FilterBar from '@/Components/Public/FilterBar';
import PageHero from '@/Components/Public/PageHero';
import Icon from '@/Components/Public/Icon';
import Pagination from '@/Components/Public/Pagination';
import Reveal from '@/Components/Public/Reveal';
import { card, eyebrowDot, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { NewsArticle, Paginated, PageProps } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { useCms } from '@/utils/cms';

type NewsProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    featured: NewsArticle | null;
    articles: Paginated<NewsArticle>;
    categories: string[];
    filters: { category: string | null; q: string | null };
}>;

function formatDate(value: string | null): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function readingLabel(minutes: number): string {
    return `${minutes} min read`;
}

function navigate(next: { category?: string | null; q?: string | null }, current: { category: string | null; q: string | null }) {
    const category = next.category !== undefined ? next.category : current.category;
    const q = next.q !== undefined ? next.q : current.q;
    const query: Record<string, string> = {};
    if (category) query.category = category;
    if (q) query.q = q;
    router.get(route('news'), query, { preserveState: true, preserveScroll: true, replace: true });
}

export default function News({ canLogin, canRegister, featured, articles, categories, filters }: NewsProps) {
    const t = useCms();
    const [searchInput, setSearchInput] = useState(filters.q ?? '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => navigate({ q: searchInput || null }, filters), 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    const filterItems = ['All', ...categories];
    const activeFilter = filters.category ?? 'All';

    return (
        <PublicLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title="AMCHAM Tanzania Publications" />
            <PageHero
                eyebrow="Press & Publications"
                title={t('news_hero_title', 'News and insight from the chamber.')}
                description={t('news_hero_description', 'Policy updates, member news and investment guides from AMCHAM Tanzania and its member companies.')}
                image={t('news_hero_image', '/images/amcham-live/tic-news.jpg')}
                breadcrumb={[{ label: 'News' }]}
            />

            {/* Featured story — only on the default, unfiltered view */}
            {featured && (
                <section className="relative overflow-hidden bg-mist px-5 py-14 sm:px-8 sm:py-20">
                    <div aria-hidden="true" className="absolute -right-24 top-10 h-72 w-72 rounded-full border border-navy-100" />
                    <div className={`${shell} relative`}>
                        <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-caps text-crimson"><span className={eyebrowDot} />{t('news_spotlight_eyebrow', 'Editorial spotlight')}</p>
                                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">{t('news_spotlight_title', 'Featured publication.')}</h2>
                            </div>
                            <p className="max-w-md text-sm leading-6 text-ink-muted">{t('news_spotlight_description', 'The chamber’s latest perspective on the issues shaping business, investment and bilateral opportunity.')}</p>
                        </Reveal>

                        <Reveal delay={100}>
                            <article className="group grid overflow-hidden rounded-2xl border border-line bg-white shadow-card-lg lg:grid-cols-[1.08fr_0.92fr]">
                                <Link href={route('news.show', featured.slug)} className="relative block min-h-[20rem] overflow-hidden sm:min-h-[26rem] lg:min-h-[34rem]">
                                    <img
                                        src={featured.cover_image_path ?? '/images/amcham-live/tic-news.jpg'}
                                        alt={featured.title}
                                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" />
                                    <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-navy-950/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-caps text-white backdrop-blur-md sm:left-7 sm:top-7">
                                        {featured.category ?? 'Latest Insight'}
                                    </span>
                                    <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-navy-900 shadow-md backdrop-blur sm:bottom-7 sm:left-7">
                                        <Icon name="clock" className="h-3.5 w-3.5 text-crimson" />
                                        {readingLabel(featured.reading_time)}
                                    </span>
                                </Link>

                                <div className="relative flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-14">
                                    <span className="absolute inset-x-0 top-0 h-1 brand-rule lg:inset-y-0 lg:left-0 lg:right-auto lg:h-full lg:w-1" aria-hidden="true" />
                                    <p className="text-xs font-semibold uppercase tracking-caps text-crimson">Lead story · {formatDate(featured.published_at)}</p>
                                    <h3 className="mt-5 font-display text-3xl font-semibold leading-[1.12] tracking-tight text-navy-900 text-balance sm:text-4xl lg:text-[2.65rem]">
                                        {featured.title}
                                    </h3>
                                    {featured.excerpt && <p className="mt-6 line-clamp-4 text-base leading-8 text-ink-muted sm:text-lg">{featured.excerpt}</p>}
                                    <div className="mt-8 h-px w-full bg-line" />
                                    <Link
                                        href={route('news.show', featured.slug)}
                                        className="mt-7 inline-flex w-fit items-center gap-2.5 text-sm font-semibold text-crimson transition hover:text-crimson-600"
                                    >
                                        Read the full publication
                                        <span className="grid h-9 w-9 place-items-center rounded-full bg-crimson text-white transition duration-200 group-hover:translate-x-1 group-hover:bg-crimson-600"><Icon name="arrow" className="h-4 w-4" /></span>
                                    </Link>
                                </div>
                            </article>
                        </Reveal>
                    </div>
                </section>
            )}

            <section className={sectionPad}>
                <div className={shell}>
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                        <FilterBar
                            items={filterItems}
                            active={activeFilter}
                            onChange={(item) => navigate({ category: item === 'All' ? null : item }, filters)}
                        />
                        <label className="relative block w-full lg:max-w-xs">
                            <span className="sr-only">Search publications</span>
                            <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" />
                            <input
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder={t('news_search_placeholder', 'Search publications…')}
                                className="w-full rounded-full border-line bg-white py-3 pl-12 pr-5 text-sm text-ink shadow-card placeholder:text-ink-faint focus:border-navy-800 focus:ring-navy-800"
                            />
                        </label>
                    </div>

                    {!featured && (
                        <p className="mt-6 text-sm font-medium text-ink-faint">
                            {articles.total} {articles.total === 1 ? 'result' : 'results'}
                            {filters.category ? ` in ${filters.category}` : ''}
                            {filters.q ? ` matching “${filters.q}”` : ''}
                        </p>
                    )}

                    {articles.data.length === 0 && <p className="mt-10 text-ink-muted">{t('news_empty', 'No publications match your search yet.')}</p>}

                    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {articles.data.map((item, index) => (
                            <Reveal key={item.slug} delay={(index % 3) * 80}>
                                <Link href={route('news.show', item.slug)} className={`${card} group flex h-full flex-col overflow-hidden`}>
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={item.cover_image_path ?? '/images/amcham-live/tic-news.jpg'}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                        {item.category && (
                                            <span className="absolute left-5 top-5 rounded-full bg-navy-950/85 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                                                {item.category}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                                            <span>{formatDate(item.published_at)}</span>
                                            <span aria-hidden="true">·</span>
                                            <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
                                                <Icon name="clock" className="h-3.5 w-3.5" />
                                                {readingLabel(item.reading_time)}
                                            </span>
                                        </p>
                                        <h2 className="mt-2.5 text-lg font-bold leading-snug text-navy-800 transition group-hover:text-crimson">
                                            {item.title}
                                        </h2>
                                        {item.excerpt && <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-ink-muted">{item.excerpt}</p>}
                                        <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-crimson">
                                            Read article
                                            <Icon name="arrow" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                        </p>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>

                    <Pagination
                        currentPage={articles.current_page}
                        lastPage={articles.last_page}
                        params={{ category: filters.category, q: filters.q }}
                    />
                </div>
            </section>
        </PublicLayout>
    );
}
