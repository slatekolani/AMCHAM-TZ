import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { PropsWithChildren, ReactNode } from 'react';
import SweetAlertFeedback from '@/Components/Alerts/SweetAlertFeedback';
import { notifyPlatinumOnly } from '@/utils/alerts';

const navItems: [string, string, ('publish' | 'testimonial')?][] = [
    ['Portal home', 'member.portal'],
    ['Members Events', 'member.member-events.index'],
    ['Company profile', 'member.profile.edit'],
    ['News submissions', 'member.news.index', 'publish'],
    ['Event submissions', 'member.events.index', 'publish'],
    ['Testimonial', 'member.testimonial.edit', 'testimonial'],
];

export default function MemberLayout({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
    const { props, url } = usePage<PageProps>();
    const canPublish = props.auth.canPublish;
    const canTestimonial = props.auth.canTestimonial;
    const visibleNavItems = navItems.filter(([, , gate]) => gate !== 'testimonial' || canTestimonial);

    return (
        <div className="flex min-h-screen bg-[#f4efe5] text-[#17213d]">
            <aside className="hidden w-64 shrink-0 border-r border-[#d7c8a9] bg-[#14234a] text-white lg:block">
                <div className="border-b border-white/10 p-6">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/brand/amcham-logo.png" alt="AMCHAM Tanzania" className="h-10 w-auto" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-[#f0d99a]">Member portal</span>
                    </Link>
                </div>
                <nav className="space-y-1 p-4">
                    {visibleNavItems.map(([label, routeName, gate]) => {
                        const locked = gate === 'publish' && !canPublish;
                        const className =
                            'block px-3 py-2 text-sm font-semibold transition ' +
                            (locked
                                ? 'text-white/40 hover:bg-white/5 hover:text-white/60'
                                : url.startsWith('/' + routeName.replace('member.', 'member-portal/').replace(/\./g, '/')) || url === '/member-portal'
                                  ? 'bg-white text-[#14234a]'
                                  : 'text-white/70 hover:bg-white/10 hover:text-white');

                        if (locked) {
                            return (
                                <button key={routeName} type="button" onClick={notifyPlatinumOnly} className={`${className} w-full text-left`}>
                                    {label}
                                </button>
                            );
                        }

                        return (
                            <Link key={routeName} href={route(routeName)} className={className}>
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <div className="flex-1">
                <header className="flex items-center justify-between border-b border-[#d7c8a9] bg-white px-6 py-4">
                    <div>{header}</div>
                    <div className="flex items-center gap-4">
                        <Link href={route('dashboard')} className="text-sm font-semibold text-[#667085] hover:text-[#14234a]">
                            Exit portal
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
