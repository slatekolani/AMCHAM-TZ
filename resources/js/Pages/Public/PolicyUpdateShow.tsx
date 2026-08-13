import Icon from '@/Components/Public/Icon';
import PageHero from '@/Components/Public/PageHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, PolicyUpdate } from '@/types';

type PolicyUpdateShowProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    policyUpdate: PolicyUpdate;
}>;

export default function PolicyUpdateShow({ canLogin, canRegister, policyUpdate }: PolicyUpdateShowProps) {
    const published = policyUpdate.published_at
        ? new Date(policyUpdate.published_at).toLocaleDateString('en-US', { dateStyle: 'long' })
        : '';

    return (
        <PublicLayout
            canLogin={canLogin}
            canRegister={canRegister}
            seo={{
                title: policyUpdate.title,
                description: policyUpdate.summary ?? 'A policy update from AMCHAM Tanzania.',
                image: policyUpdate.cover_image_path ?? '/images/brand/amcham-logo-white-bg.png',
                type: 'article',
            }}
        >
            <Head title={policyUpdate.title} />

            <PageHero
                eyebrow="Policy Updates"
                title={policyUpdate.title}
                description={policyUpdate.summary ?? undefined}
                image={policyUpdate.cover_image_path ?? '/images/amcham-live/tic-news.jpg'}
                breadcrumb={[{ label: 'Policy Updates', href: '/policy-updates' }, { label: policyUpdate.title }]}
                compact
            />

            {published && (
                <section className="border-b border-line bg-mist px-5 py-5 sm:px-8">
                    <div className="mx-auto max-w-3xl">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-faint">
                            <Icon name="calendar" className="h-4 w-4" />
                            {published}
                        </span>
                    </div>
                </section>
            )}

            <section className="bg-white px-5 py-14 sm:px-8 lg:py-20">
                <div className="mx-auto max-w-3xl">
                    <div className="article-prose whitespace-pre-line" dangerouslySetInnerHTML={{ __html: policyUpdate.body ?? '' }} />
                    <div className="mt-14 border-t border-line pt-8">
                        <Link href="/policy-updates" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 transition hover:text-crimson">
                            <Icon name="arrow" className="h-4 w-4 rotate-180" />
                            Back to all policy updates
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
