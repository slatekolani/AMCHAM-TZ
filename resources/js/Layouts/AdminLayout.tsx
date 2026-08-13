import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { PropsWithChildren, ReactNode } from 'react';
import SweetAlertFeedback from '@/Components/Alerts/SweetAlertFeedback';

const navGroups: { label: string; items: [string, string][] }[] = [
    {
        label: 'Overview',
        items: [['Dashboard', 'admin.dashboard']],
    },
    {
        label: 'Content',
        items: [
            ['Pages', 'admin.pages.index'],
            ['Our Work', 'admin.our-work.index'],
            ['Board members', 'admin.board-members.index'],
            ['Testimonials', 'admin.testimonials.index'],
            ['Trade & Investment Data', 'admin.economic-stats.index'],
            ['News', 'admin.news.index'],
            ['Policy updates', 'admin.policy-updates.index'],
            ['Working groups', 'admin.working-groups.index'],
            ['Events', 'admin.events.index'],
            ['Event registrations', 'admin.event-registrations.index'],
            ['Resources & newsletters', 'admin.resources.index'],
            ['Media library', 'admin.media.index'],
        ],
    },
    {
        label: 'Members',
        items: [
            ['Companies', 'admin.companies.index'],
            ['Membership tiers', 'admin.membership-tiers.index'],
            ['Membership applications', 'admin.membership-applications.index'],
            ['Users & roles', 'admin.users.index'],
        ],
    },
    {
        label: 'Communication',
        items: [
            ['Email campaigns', 'admin.campaigns.email.index'],
            ['WhatsApp campaigns', 'admin.campaigns.whatsapp.index'],
            ['Subscribers', 'admin.subscribers.index'],
        ],
    },
    {
        label: 'System',
        items: [['Website copy', 'admin.website-copy.edit'], ['Settings', 'admin.settings.index']],
    },
];

export default function AdminLayout({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
    const { props, url } = usePage<PageProps>();

    return (
        <div className="flex min-h-screen bg-[#f4efe5] text-[#17213d]">
            <aside className="hidden w-64 shrink-0 border-r border-[#d7c8a9] bg-[#14234a] text-white lg:block">
                <div className="border-b border-white/10 p-6">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/brand/amcham-logo.png" alt="AMCHAM Tanzania" className="h-10 w-auto" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-[#f0d99a]">Admin</span>
                    </Link>
                </div>
                <nav className="space-y-6 p-4">
                    {navGroups.map((group) => (
                        <div key={group.label}>
                            <p className="px-3 text-xs font-black uppercase tracking-[0.18em] text-white/40">{group.label}</p>
                            <div className="mt-2 space-y-1">
                                {group.items.map(([label, routeName]) => (
                                    <Link
                                        key={routeName}
                                        href={route(routeName)}
                                        className={
                                            'block px-3 py-2 text-sm font-semibold transition ' +
                                            (url.startsWith('/' + routeName.replace('admin.', '').replace(/\./g, '/'))
                                                ? 'bg-white text-[#14234a]'
                                                : 'text-white/70 hover:bg-white/10 hover:text-white')
                                        }
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1">
                <header className="flex items-center justify-between border-b border-[#d7c8a9] bg-white px-6 py-4">
                    <div>{header}</div>
                    <div className="flex items-center gap-4">
                        <Link href={route('dashboard')} className="text-sm font-semibold text-[#667085] hover:text-[#14234a]">
                            Exit admin
                        </Link>
                        <Link href={route('logout')} method="post" as="button" className="text-sm font-semibold text-[#cf2f3b]">
                            Log out
                        </Link>
                    </div>
                </header>

                <SweetAlertFeedback success={props.flash?.success} error={props.flash?.error} />

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
