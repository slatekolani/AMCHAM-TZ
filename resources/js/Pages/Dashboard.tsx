import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Dashboard({ auth }: PageProps) {
    const user = auth.user!;
    const isAdmin = auth.roles.includes('admin') || auth.roles.includes('super-admin');
    const isMember = auth.roles.includes('member');

    const modules: [string, string, string][] = [
        ...(isAdmin ? [['Admin Command Center', 'Manage pages, members, events, news, campaigns, subscribers and analytics.', 'admin.dashboard'] as [string, string, string]] : []),
        ...(isMember ? [['Member Company Portal', 'Submit articles, update company profile, publish events and manage documents.', 'member.portal'] as [string, string, string]] : []),
        ['Public Website', 'Review the live public-facing AMCHAM website experience.', 'home'],
    ];

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Platform overview</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Welcome back, {user.name}</h1>
                </div>
            }
        >
            <Head title="AMCHAM Platform Dashboard" />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-3">
                    {modules.map(([title, body, routeName]) => (
                        <Link
                            key={title}
                            href={routeName === 'home' ? '/' : route(routeName)}
                            className="border border-[#d7c8a9] bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <h2 className="text-2xl font-bold text-[#14234a]">{title}</h2>
                            <p className="mt-4 leading-7 text-[#667085]">{body}</p>
                            <p className="mt-8 text-sm font-black uppercase tracking-[0.16em] text-[#cf2f3b]">Open module</p>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
