import PageHero from '@/Components/Public/PageHero';
import Icon from '@/Components/Public/Icon';
import Reveal from '@/Components/Public/Reveal';
import { card, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import CountUp from '@/Components/Public/CountUp';
import FilterBar from '@/Components/Public/FilterBar';
import Pagination from '@/Components/Public/Pagination';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, Paginated, Resource } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { useCms } from '@/utils/cms';

type ResourcesProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    resources: Paginated<Resource>;
    pageMode: 'resources' | 'newsletters';
    categories: string[];
    filters: { category: string | null; q: string | null };
}>;

export default function Resources({ canLogin, canRegister, resources, pageMode, categories, filters }: ResourcesProps) {
    const t = useCms();
    const isNewsletters = pageMode === 'newsletters';
    const [category, setCategory] = useState(filters.category ?? 'All');
    const [query, setQuery] = useState(filters.q ?? '');
    const firstRender = useRef(true);
    const destination = isNewsletters ? '/newsletters' : '/resources';
    const navigate = (nextCategory: string, nextQuery: string) => {
        const params: Record<string, string> = {};
        if (!isNewsletters && nextCategory !== 'All') params.category = nextCategory;
        if (nextQuery.trim()) params.q = nextQuery.trim();
        router.get(destination, params, { preserveState: true, preserveScroll: true, replace: true });
    };
    useEffect(() => {
        if (firstRender.current) { firstRender.current = false; return; }
        const timer = window.setTimeout(() => navigate(category, query), 350);
        return () => window.clearTimeout(timer);
    }, [query]);
    const chooseCategory = (next: string) => { setCategory(next); navigate(next, query); };

    return (
        <PublicLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title={isNewsletters ? 'AMCHAM Tanzania Newsletters' : 'AMCHAM Tanzania Resources'} />
            <PageHero
                eyebrow={isNewsletters ? 'Newsletters' : 'Resource Library'}
                title={isNewsletters ? t('newsletters_hero_title', 'Updates and insight from the chamber.') : t('resources_hero_title', 'A resource library for investors, members and partners.')}
                description={isNewsletters ? t('newsletters_hero_description', 'Read and download AMCHAM Tanzania newsletters featuring chamber news, member updates, events and business insight.') : t('resources_hero_description', 'Investor guides, policy briefs and membership materials to help your business navigate the Tanzanian market.')}
                image={isNewsletters ? t('newsletters_hero_image', '/images/amcham-live/tic-news.jpg') : t('resources_hero_image', '/images/amcham-live/boards.jpg')}
                breadcrumb={[{ label: isNewsletters ? 'Newsletters' : 'Resources' }]}
                compact
            />

            <section className="relative z-10 -mt-8 px-5 sm:px-8"><div className={shell}>
                <div className="grid overflow-hidden rounded-2xl border border-white/20 bg-white shadow-card-lg sm:grid-cols-2">
                    <div className="relative px-7 py-6 sm:px-9"><span className="absolute inset-x-0 top-0 h-1 brand-rule" /><p className="font-display text-3xl font-semibold text-navy-900"><CountUp value={`${resources.total}`} /></p><p className="mt-1 text-sm font-bold text-navy-800">Published {isNewsletters ? 'editions' : 'resources'}</p></div>
                    <div className="border-t border-line px-7 py-6 sm:border-l sm:border-t-0 sm:px-9"><p className="text-xs font-semibold uppercase tracking-caps text-crimson">{t('resources_knowledge_title', 'Knowledge you can use')}</p><p className="mt-2 text-sm leading-6 text-ink-muted">{t('resources_knowledge_body', 'Curated insight for members, investors and partners operating across both markets.')}</p></div>
                </div>
            </div></section>

            <section className={`${sectionPad} bg-mist`}>
                <div className={shell}>
                    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-caps text-crimson">{t('resources_browse_eyebrow', 'Browse the library')}</p><h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">{t('resources_browse_title', 'Insight for informed decisions.')}</h2></div><p className="max-w-md text-sm leading-6 text-ink-muted">{t('resources_browse_body', 'Download practical material prepared by the chamber and its trusted partners.')}</p></div>
                    <div className="mb-8 rounded-2xl border border-line bg-white p-4 shadow-card"><div className="flex flex-col gap-4 lg:flex-row lg:items-center"><label className="relative block min-w-0 flex-1"><span className="sr-only">Search resources</span><Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isNewsletters ? t('newsletters_search_placeholder', 'Search newsletters…') : t('resources_search_placeholder', 'Search resources…')} className="min-h-12 w-full rounded-xl border border-line bg-mist pl-11 pr-4 text-sm focus:border-navy-800 focus:ring-navy-100" /></label><p className="shrink-0 text-sm font-semibold text-navy-700">{resources.total} results</p></div>{!isNewsletters && categories.length > 0 && <div className="mt-4 border-t border-line pt-4"><FilterBar items={['All', ...categories]} active={category} onChange={chooseCategory} /></div>}</div>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {resources.data.length === 0 && <p className="text-ink-muted">{isNewsletters ? 'No newsletters match your search.' : 'No resources match your search.'}</p>}
                    {resources.data.map((resource, index) => (
                        <Reveal key={resource.id} delay={(index % 2) * 100}>
                            <article className={`${card} group relative flex h-full flex-col overflow-hidden`}>
                                {resource.cover_image_path ? (
                                    <div className="h-40 shrink-0 overflow-hidden bg-navy-100">
                                        <img
                                            src={resource.cover_image_path}
                                            alt=""
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-crimson via-gold to-navy-700" />
                                )}
                                <div className="flex min-w-0 flex-1 flex-col p-7">
                                    {!resource.cover_image_path && (
                                        <div className="mb-6 grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold transition duration-300 group-hover:-rotate-3 group-hover:bg-crimson group-hover:text-white">
                                            <Icon name="document" className="h-7 w-7" />
                                        </div>
                                    )}
                                    {resource.category && (
                                        <p className="text-xs font-semibold uppercase tracking-caps text-crimson">{resource.category}</p>
                                    )}
                                    <h2 className="mt-2 font-display text-xl font-semibold leading-snug text-navy-800">{resource.title}</h2>
                                    {resource.description && <p className="mt-3 flex-1 leading-7 text-ink-muted">{resource.description}</p>}
                                    <div className="mt-6">
                                        <a
                                            href={route('resources.download', resource.uuid)}
                                            className="inline-flex items-center gap-2.5 rounded-md border border-navy-200 px-5 py-3 text-sm font-semibold text-navy-800 transition duration-200 hover:border-navy-800 hover:bg-navy-800 hover:text-white"
                                        >
                                            <Icon name="download" className="h-4 w-4" />
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                    </div>
                    <Pagination currentPage={resources.current_page} lastPage={resources.last_page} href={destination} params={{ category: filters.category, q: filters.q }} />
                </div>
            </section>

            <section className="bg-navy-950 px-5 py-14 text-white sm:px-8"><div className={`${shell} flex flex-col gap-7 md:flex-row md:items-center md:justify-between`}><div><p className="text-xs font-semibold uppercase tracking-caps text-gold">{t('resources_cta_eyebrow', 'Stay ahead')}</p><h2 className="mt-3 font-display text-3xl font-semibold">{t('resources_cta_title', 'Get chamber insight in your inbox.')}</h2></div><Link href="/contact-us" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-crimson px-6 py-3 text-sm font-semibold text-white">{t('resources_cta_button', 'Connect with the Secretariat')} <Icon name="arrow" className="h-4 w-4" /></Link></div></section>
        </PublicLayout>
    );
}
