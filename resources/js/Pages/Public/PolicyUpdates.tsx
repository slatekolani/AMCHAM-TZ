import Icon from '@/Components/Public/Icon';
import PageHero from '@/Components/Public/PageHero';
import Pagination from '@/Components/Public/Pagination';
import Reveal from '@/Components/Public/Reveal';
import { card, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { Paginated, PageProps, PolicyUpdate } from '@/types';

type PolicyUpdatesProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    policyUpdates: Paginated<PolicyUpdate>;
}>;

function formatDate(value: string | null): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function PolicyUpdates({ canLogin, canRegister, policyUpdates }: PolicyUpdatesProps) {
    return (
        <PublicLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title="AMCHAM Tanzania Policy Updates" />
            <PageHero
                eyebrow="Policy Updates"
                title="Advocacy and regulatory developments."
                description="Positions, briefings and regulatory developments the chamber is tracking on behalf of members."
                image="/images/amcham-live/tic-news.jpg"
                breadcrumb={[{ label: 'Policy Updates' }]}
            />

            <section className={sectionPad}>
                <div className={shell}>
                    {policyUpdates.data.length === 0 && <p className="text-ink-muted">No policy updates published yet.</p>}

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {policyUpdates.data.map((item, index) => (
                            <Reveal key={item.slug} delay={(index % 3) * 80}>
                                <Link href={route('policy-updates.show', item.slug)} className={`${card} group flex h-full flex-col overflow-hidden`}>
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={item.cover_image_path ?? '/images/amcham-live/tic-news.jpg'}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{formatDate(item.published_at)}</p>
                                        <h2 className="mt-2.5 text-lg font-bold leading-snug text-navy-800 transition group-hover:text-crimson">
                                            {item.title}
                                        </h2>
                                        {item.summary && <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-ink-muted">{item.summary}</p>}
                                        <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-crimson">
                                            Read update
                                            <Icon name="arrow" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                        </p>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>

                    <Pagination currentPage={policyUpdates.current_page} lastPage={policyUpdates.last_page} params={{}} />
                </div>
            </section>
        </PublicLayout>
    );
}
