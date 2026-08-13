import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { NewsArticle } from '@/types';
import Icon from '@/Components/Public/Icon';
import Reveal from '@/Components/Public/Reveal';
import { btn, eyebrow as eyebrowClass, eyebrowDot, sectionPad, shell } from '@/Components/Public/ui';

const FALLBACK_IMAGE = '/images/amcham-live/tic-news.jpg';

function formatDate(value: string | null): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Editorial index: a standing preview plate on the left, a numbered headline register on the
 * right. Hovering or focusing a headline swaps the plate — the reading pattern used by the
 * international business press, and far calmer than a scrolling card rail.
 */
export default function NewsroomIndex({ articles, copy = {} }: { articles: NewsArticle[]; copy?: Record<string, string> }) {
    const [active, setActive] = useState(0);

    if (articles.length === 0) {
        return (
            <section className={`${sectionPad} bg-mist`}>
                <div className={shell}>
                    <p className={eyebrowClass}>
                        <span className={eyebrowDot} />
                        {copy.news_eyebrow || 'Newsroom'}
                    </p>
                    <p className="mt-6 text-ink-muted">{copy.news_empty || 'No published articles yet — check back soon.'}</p>
                </div>
            </section>
        );
    }

    const activeArticle = articles[Math.min(active, articles.length - 1)];

    return (
        <section className={`${sectionPad} bg-mist`}>
            <div className={shell}>
                <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div>
                        <p className={eyebrowClass}>
                            <span className={eyebrowDot} />
                            {copy.news_eyebrow || 'Newsroom'}
                        </p>
                        <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-navy-800 text-balance sm:text-4xl">
                            {copy.news_heading || 'Latest at AmCham Tanzania.'}
                        </h2>
                    </div>
                    <Link href={route('news')} className={`${btn.ghost} shrink-0`}>
                        {copy.news_button || 'Browse all publications'}
                        <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                </Reveal>

                <div className="mt-14 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
                    {/* ── Standing preview plate (desktop only) ── */}
                    <Reveal className="hidden lg:block">
                        <Link
                            href={route('news.show', activeArticle.slug)}
                            className="group sticky top-32 block overflow-hidden rounded-2xl bg-navy-900 shadow-card-lg"
                            aria-label={activeArticle.title}
                        >
                            <div className="relative aspect-[4/5]">
                                {articles.map((article, index) => (
                                    <img
                                        key={article.slug}
                                        src={article.cover_image_path ?? FALLBACK_IMAGE}
                                        alt=""
                                        aria-hidden={index !== active}
                                        className={
                                            'absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ' +
                                            (index === active ? 'opacity-100' : 'opacity-0')
                                        }
                                    />
                                ))}
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-transparent" />

                                <div className="absolute inset-x-0 bottom-0 p-7">
                                    {activeArticle.category && (
                                        <span className="inline-flex rounded-full bg-crimson px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                                            {activeArticle.category}
                                        </span>
                                    )}
                                    <p className="mt-4 font-display text-2xl font-semibold leading-snug text-white">
                                        {activeArticle.title}
                                    </p>
                                    <p className="mt-3 flex items-center gap-2 text-xs font-medium text-white/70">
                                        <span>{formatDate(activeArticle.published_at)}</span>
                                        <span aria-hidden="true">·</span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Icon name="clock" className="h-3.5 w-3.5 text-gold" />
                                            {activeArticle.reading_time} min read
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </Reveal>

                    {/* ── Headline register ── */}
                    <Reveal delay={120}>
                        <ol className="border-t border-line">
                            {articles.map((article, index) => (
                                <li key={article.slug}>
                                    <Link
                                        href={route('news.show', article.slug)}
                                        onMouseEnter={() => setActive(index)}
                                        onFocus={() => setActive(index)}
                                        className={
                                            'group relative flex gap-4 border-b border-line py-5 transition-colors duration-200 sm:gap-7 sm:py-6 ' +
                                            (index === active ? 'lg:bg-white/60' : 'hover:bg-white/40')
                                        }
                                    >
                                        {/* Active marker rides the register on desktop. */}
                                        <span
                                            aria-hidden="true"
                                            className={
                                                'absolute left-0 top-0 hidden h-full w-0.5 origin-top bg-crimson transition-transform duration-300 lg:block ' +
                                                (index === active ? 'scale-y-100' : 'scale-y-0')
                                            }
                                        />

                                        <span className="hidden w-8 shrink-0 font-display text-sm font-semibold text-ink-faint lg:block lg:pl-5">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        {/* Thumbnail stands in for the plate on small screens. */}
                                        <span className="h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-navy-100 lg:hidden">
                                            <img
                                                src={article.cover_image_path ?? FALLBACK_IMAGE}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-wide text-ink-faint sm:text-[11px]">
                                                {article.category && <span className="text-crimson">{article.category}</span>}
                                                {article.category && <span aria-hidden="true">·</span>}
                                                <span>{formatDate(article.published_at)}</span>
                                                <span aria-hidden="true">·</span>
                                                <span className="normal-case tracking-normal">{article.reading_time} min read</span>
                                            </span>
                                            <span
                                                className={
                                                    // The active tint only means something next to the plate, which is desktop-only.
                                                    'mt-1.5 line-clamp-2 font-display text-base font-semibold leading-snug text-navy-800 transition-colors duration-200 group-hover:text-crimson sm:mt-2 sm:line-clamp-none sm:text-xl lg:text-2xl ' +
                                                    (index === active ? 'lg:text-crimson' : '')
                                                }
                                            >
                                                {article.title}
                                            </span>
                                            {article.excerpt && (
                                                <span className="mt-2 hidden text-sm leading-6 text-ink-muted sm:line-clamp-1">
                                                    {article.excerpt}
                                                </span>
                                            )}
                                        </span>

                                        <span className="hidden shrink-0 self-center text-crimson transition-transform duration-200 group-hover:translate-x-1 sm:block">
                                            <Icon name="arrow" className="h-5 w-5" />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
