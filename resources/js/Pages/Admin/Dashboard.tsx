import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

type Activity = {
    id: number;
    description: string;
    subject_type: string | null;
    causer: { name: string } | null;
    created_at: string;
};

type DashboardProps = PageProps<{
    stats: {
        pendingCompanies: number;
        pendingNews: number;
        pendingEvents: number;
        approvedCompanies: number;
        subscribers: number;
        publishedNews: number;
        publishedEvents: number;
    };
    recentActivity: Activity[];
}>;

export default function AdminDashboard({ stats, recentActivity }: DashboardProps) {
    const totalPending = stats.pendingCompanies + stats.pendingNews + stats.pendingEvents;

    const metrics = [
        [stats.approvedCompanies, 'Active members'],
        [totalPending, 'Approvals pending'],
        [stats.subscribers, 'Subscribers'],
        [stats.publishedNews + stats.publishedEvents, 'Published items'],
    ];

    const queues = [
        { label: 'Membership applications', count: stats.pendingCompanies, href: route('admin.companies.index', { status: 'pending' }) },
        { label: 'News awaiting review', count: stats.pendingNews, href: route('admin.news.index', { status: 'pending_review' }) },
        { label: 'Events awaiting review', count: stats.pendingEvents, href: route('admin.events.index', { status: 'pending_review' }) },
    ];

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Administration</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">AMCHAM command center</h1>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="grid gap-px overflow-hidden border border-[#d7c8a9] bg-[#d7c8a9] md:grid-cols-4">
                {metrics.map(([value, label]) => (
                    <div key={label} className="bg-white p-6">
                        <p className="text-4xl font-black text-[#14234a]">{value}</p>
                        <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-[#667085]">{label}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                <section className="border border-[#d7c8a9] bg-white p-7">
                    <h2 className="text-2xl font-bold text-[#14234a]">Approval queue</h2>
                    <div className="mt-5 grid gap-3">
                        {queues.map((queue) => (
                            <Link
                                key={queue.label}
                                href={queue.href}
                                className="grid gap-2 border border-[#eadfc8] bg-[#fbf8f0] p-5 transition hover:border-[#14234a] sm:grid-cols-[1fr_0.3fr] sm:items-center"
                            >
                                <p className="font-bold text-[#14234a]">{queue.label}</p>
                                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#cf2f3b]">{queue.count} pending</p>
                            </Link>
                        ))}
                    </div>
                </section>
                <section className="border border-[#eadfc8] bg-[#14234a] p-6 text-white">
                    <h2 className="text-2xl font-bold">Recent activity</h2>
                    <div className="mt-5 space-y-3">
                        {recentActivity.length === 0 && <p className="text-white/60">No activity recorded yet.</p>}
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="border border-white/15 bg-white/10 p-4">
                                <p className="font-semibold">{activity.description}</p>
                                <p className="mt-1 text-xs text-white/60">
                                    {activity.causer?.name ?? 'System'} · {new Date(activity.created_at).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
