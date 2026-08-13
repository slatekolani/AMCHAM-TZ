import Icon from '@/Components/Public/Icon';
import PageHero from '@/Components/Public/PageHero';
import Reveal from '@/Components/Public/Reveal';
import { card, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, WorkingGroup } from '@/types';

type WorkingGroupsProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    items: WorkingGroup[];
}>;

export default function WorkingGroups({ canLogin, canRegister, items }: WorkingGroupsProps) {
    return (
        <PublicLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title="AMCHAM Tanzania — Working Groups" />
            <PageHero
                eyebrow="Working Groups"
                title="Sector communities driving member priorities."
                description="AMCHAM Tanzania working groups bring together members in the same industry to shape advocacy, share intelligence and build sector-specific relationships."
                image="/images/amcham-live/boards.jpg"
                breadcrumb={[{ label: 'Working Groups' }]}
            />

            <section className={sectionPad}>
                <div className={shell}>
                    {items.length === 0 && <p className="text-ink-muted">No working groups published yet.</p>}

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((item, index) => (
                            <Reveal key={item.slug} delay={(index % 3) * 80}>
                                <Link href={route('working-groups.show', item.slug)} className={`${card} group flex h-full flex-col overflow-hidden`}>
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={item.cover_image_path ?? '/images/amcham-live/boards.jpg'}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        <h2 className="text-lg font-bold leading-snug text-navy-800 transition group-hover:text-crimson">
                                            {item.title}
                                        </h2>
                                        {item.summary && <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-ink-muted">{item.summary}</p>}
                                        <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-crimson">
                                            Learn more
                                            <Icon name="arrow" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                        </p>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
