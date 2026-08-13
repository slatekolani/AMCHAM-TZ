import Icon from '@/Components/Public/Icon';
import PageHero from '@/Components/Public/PageHero';
import { shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { NewsArticle, PageProps } from '@/types';

type NewsShowProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    article: NewsArticle;
}>;

export default function NewsShow({ canLogin, canRegister, article }: NewsShowProps) {
    const published = article.published_at
        ? new Date(article.published_at).toLocaleDateString('en-US', { dateStyle: 'long' })
        : '';

    return (
        <PublicLayout
            canLogin={canLogin}
            canRegister={canRegister}
            seo={{
                title: article.title,
                description: article.excerpt ?? 'News and business insight from AMCHAM Tanzania.',
                image: article.cover_image_path ?? '/images/amcham-live/tic-news.jpg',
                type: 'article',
                structuredData: {
                    '@type': 'NewsArticle',
                    headline: article.title,
                    description: article.excerpt,
                    image: article.cover_image_path,
                    datePublished: article.published_at,
                    author: { '@type': 'Organization', name: article.company?.name ?? 'AMCHAM Tanzania' },
                    publisher: { '@id': '/#organization' },
                    mainEntityOfPage: { '@type': 'WebPage', '@id': `/news/${article.slug}` },
                },
            }}
        >
            <Head title={article.title} />

            <PageHero eyebrow={article.category ?? 'News'} title={article.title} description={article.excerpt ?? undefined} image={article.cover_image_path ?? '/images/amcham-live/tic-news.jpg'} breadcrumb={[{ label: 'News', href: '/news' }, { label: article.title }]} compact />
            <section className="border-b border-line bg-mist px-5 py-5 sm:px-8"><div className="mx-auto max-w-3xl"><div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-ink-faint">
                        {published && (
                            <span className="inline-flex items-center gap-2">
                                <Icon name="calendar" className="h-4 w-4" />
                                {published}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-2">
                            <Icon name="clock" className="h-4 w-4" />
                            {article.reading_time} min read
                        </span>
                        {article.company && (
                            <span className="inline-flex items-center gap-2">
                                <Icon name="briefcase" className="h-4 w-4" />
                                Submitted by {article.company.name}
                            </span>
                        )}
                    </div></div></section>

            <section className="bg-white px-5 py-14 sm:px-8 lg:py-20">
                <div className="mx-auto max-w-3xl">
                    <div className="article-prose whitespace-pre-line" dangerouslySetInnerHTML={{ __html: article.body }} />
                    <div className="mt-14 border-t border-line pt-8">
                        <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 transition hover:text-crimson">
                            <Icon name="arrow" className="h-4 w-4 rotate-180" />
                            Back to all publications
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
