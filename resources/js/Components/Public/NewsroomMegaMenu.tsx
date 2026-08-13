import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { PageProps } from '@/types';
import Icon from '@/Components/Public/Icon';

type NewsroomCategory = 'news' | 'publications' | 'policy' | 'workingGroups';

type ListItem = {
    key: number;
    href: string;
    image: string;
    title: string;
    meta: string;
};

type CmsLookup = (key: string, fallback: string) => string;

function formatDate(value: string | null): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const categories: { key: NewsroomCategory; label: string; desc: string; href: string; total: (nav: PageProps['nav']) => number }[] = [
    { key: 'news', label: 'News', desc: 'Chamber updates, investment and policy coverage', href: '/news', total: (nav) => nav.articlesTotal },
    { key: 'publications', label: 'Publications', desc: 'Newsletters and chamber publications', href: '/newsletters', total: (nav) => nav.newslettersTotal },
    { key: 'policy', label: 'Policy Updates', desc: 'Advocacy positions and regulatory developments', href: '/policy-updates', total: (nav) => nav.policyUpdatesTotal },
    { key: 'workingGroups', label: 'Working Groups', desc: 'Sector-based member committees', href: '/working-groups', total: (nav) => nav.workingGroupsTotal },
];

function buildCategoryItems(category: NewsroomCategory, nav: PageProps['nav'], t: CmsLookup): ListItem[] {
    if (category === 'news') {
        return nav.articles.slice(0, 5).map((article) => ({
            key: article.id,
            href: route('news.show', article.slug),
            image: article.cover_image_path ?? t('news_fallback_image', '/images/amcham-live/tic-news.jpg'),
            title: article.title,
            meta: [article.category, formatDate(article.published_at)].filter(Boolean).join(' · '),
        }));
    }
    if (category === 'publications') {
        return nav.newsletters.slice(0, 5).map((item) => ({
            key: item.id,
            href: route('resources.download', item.uuid),
            image: item.cover_image_path ?? t('newsletters_hero_image', '/images/amcham-live/tic-news.jpg'),
            title: item.title,
            meta: formatDate(item.created_at),
        }));
    }
    if (category === 'policy') {
        return nav.policyUpdates.slice(0, 5).map((item) => ({
            key: item.id,
            href: route('policy-updates.show', item.slug),
            image: item.cover_image_path ?? t('policy_updates_hero_image', '/images/amcham-live/tic-news.jpg'),
            title: item.title,
            meta: formatDate(item.published_at),
        }));
    }
    return nav.workingGroups.slice(0, 5).map((item) => ({
        key: item.id,
        href: route('working-groups.show', item.slug),
        image: item.cover_image_path ?? '/images/amcham-live/boards.jpg',
        title: item.title,
        meta: item.summary ?? '',
    }));
}

/** Desktop: category list on the left (hover switches the preview), a flex-row item list on the right. */
export function NewsroomDesktopPanel({ nav, cms = {}, onNavigate }: { nav: PageProps['nav']; cms?: Record<string, string>; onNavigate: () => void }) {
    const t: CmsLookup = (key, fallback) => cms[key]?.trim() || fallback;
    const [active, setActive] = useState<NewsroomCategory>('news');
    const items = buildCategoryItems(active, nav, t);
    const activeCategory = categories.find((category) => category.key === active) ?? categories[0];

    return (
        <div className="w-[42rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-white shadow-card-lg animate-fade-up [animation-duration:350ms]">
            <span className="block h-1 brand-rule" />
            <div className="grid grid-cols-[0.8fr_1.2fr] gap-6 p-5">
                <div className="flex flex-col gap-1">
                    {categories.map((category) => (
                        <Link
                            key={category.key}
                            href={category.href}
                            onClick={onNavigate}
                            onMouseEnter={() => setActive(category.key)}
                            onFocus={() => setActive(category.key)}
                            className={'group/cat rounded-xl p-3 transition duration-200 ' + (active === category.key ? 'bg-mist' : 'hover:bg-mist')}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <span className="text-[15px] font-bold leading-snug text-navy-800">{category.label}</span>
                                <Icon
                                    name="arrow"
                                    className={
                                        'mt-1 h-4 w-4 shrink-0 text-crimson transition duration-200 ' +
                                        (active === category.key ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0 group-hover/cat:translate-x-0 group-hover/cat:opacity-100')
                                    }
                                />
                            </div>
                            <p className="mt-0.5 text-[13px] leading-5 text-ink-faint">{category.desc}</p>
                        </Link>
                    ))}
                </div>

                <div className="flex max-h-[26rem] flex-col gap-1 overflow-y-auto">
                    {items.map((item) => (
                        <Link
                            key={item.key}
                            href={item.href}
                            onClick={onNavigate}
                            className="group/item flex items-center gap-3.5 rounded-xl p-2 transition duration-200 hover:bg-mist"
                        >
                            <img src={item.image} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
                            <div className="min-w-0 flex-1">
                                <p className="line-clamp-2 text-sm font-bold leading-snug text-navy-800 transition group-hover/item:text-crimson">{item.title}</p>
                                {item.meta && <p className="mt-1 text-xs text-ink-faint">{item.meta}</p>}
                            </div>
                        </Link>
                    ))}
                    {items.length === 0 && <p className="p-3 text-sm text-ink-faint">Nothing published yet.</p>}
                </div>
            </div>
            <div className="flex items-center justify-end border-t border-line bg-mist/60 px-5 py-3">
                <Link href={activeCategory.href} onClick={onNavigate} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy-800 transition hover:text-crimson">
                    View all {activeCategory.total(nav) > items.length ? `${activeCategory.total(nav)} ` : ''}{activeCategory.label.toLowerCase()}
                    <Icon name="arrow" className="h-3.5 w-3.5" />
                </Link>
            </div>
        </div>
    );
}

/** Mobile: tap a category to expand its item list inline (no hover available). */
export function NewsroomMobileAccordion({ nav, cms = {}, onNavigate }: { nav: PageProps['nav']; cms?: Record<string, string>; onNavigate: () => void }) {
    const t: CmsLookup = (key, fallback) => cms[key]?.trim() || fallback;
    const [openCategory, setOpenCategory] = useState<NewsroomCategory | null>('news');

    return (
        <div className="grid gap-1.5 px-2 pb-2">
            {categories.map((category) => {
                const isOpen = openCategory === category.key;
                const items = isOpen ? buildCategoryItems(category.key, nav, t) : [];

                return (
                    <div key={category.key} className="overflow-hidden rounded-lg bg-white">
                        <button
                            type="button"
                            onClick={() => setOpenCategory(isOpen ? null : category.key)}
                            className="flex w-full items-center justify-between px-3 py-3 text-sm font-bold text-navy-800"
                        >
                            {category.label}
                            <Icon name="chevron-down" className={'h-4 w-4 transition-transform duration-200 ' + (isOpen ? 'rotate-180 text-crimson' : 'text-ink-faint')} />
                        </button>
                        {isOpen && (
                            <div className="grid gap-1 px-2 pb-2">
                                {items.map((item) => (
                                    <Link key={item.key} href={item.href} onClick={onNavigate} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-navy-50">
                                        <img src={item.image} alt="" className="h-14 w-16 shrink-0 rounded-lg object-cover" />
                                        <div className="min-w-0">
                                            <p className="line-clamp-2 text-sm font-bold text-navy-800">{item.title}</p>
                                            {item.meta && <p className="mt-0.5 text-xs text-ink-faint">{item.meta}</p>}
                                        </div>
                                    </Link>
                                ))}
                                {items.length === 0 && <p className="px-2 py-2 text-xs text-ink-faint">Nothing published yet.</p>}
                                <Link href={category.href} onClick={onNavigate} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm font-semibold text-crimson">
                                    View all {category.total(nav) > items.length ? `${category.total(nav)} ` : ''}{category.label.toLowerCase()}
                                    <Icon name="arrow" className="h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
