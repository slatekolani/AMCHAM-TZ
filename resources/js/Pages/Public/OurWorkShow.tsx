import Icon from '@/Components/Public/Icon';
import PageHero from '@/Components/Public/PageHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { OurWorkItem, PageProps } from '@/types';

type OurWorkShowProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    item: OurWorkItem;
}>;

export default function OurWorkShow({ canLogin, canRegister, item }: OurWorkShowProps) {
    return (
        <PublicLayout
            canLogin={canLogin}
            canRegister={canRegister}
            seo={{
                title: item.title,
                description: item.summary ?? 'A programme area from AMCHAM Tanzania.',
                image: item.cover_image_path ?? '/images/brand/amcham-logo-white-bg.png',
            }}
        >
            <Head title={item.title} />

            <PageHero
                eyebrow="Our Work"
                title={item.title}
                description={item.summary ?? undefined}
                image={item.cover_image_path ?? '/images/amcham-live/boards.jpg'}
                breadcrumb={[{ label: 'Our Work', href: '/our-work' }, { label: item.title }]}
                compact
            />

            <section className="bg-white px-5 py-14 sm:px-8 lg:py-20">
                <div className="mx-auto max-w-3xl">
                    <div className="article-prose whitespace-pre-line" dangerouslySetInnerHTML={{ __html: item.body ?? '' }} />
                    <div className="mt-14 border-t border-line pt-8">
                        <Link href="/our-work" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 transition hover:text-crimson">
                            <Icon name="arrow" className="h-4 w-4 rotate-180" />
                            Back to Our Work
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
