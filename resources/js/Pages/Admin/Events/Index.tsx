import ApprovalActions from '@/Components/Admin/ApprovalActions';
import StatusBadge from '@/Components/Admin/StatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Event, PageProps } from '@/types';
import { confirmAndDelete } from '@/utils/alerts';

type EventsIndexProps = PageProps<{
    events: Event[];
    filters: { status: string };
}>;

const statusFilters = ['', 'draft', 'pending_review', 'published', 'rejected'];

export default function EventsIndex({ events, filters }: EventsIndexProps) {
    const setStatus = (status: string) => {
        router.get(route('admin.events.index'), status ? { status } : {}, { preserveState: true });
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Content</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Events</h1>
                </div>
            }
        >
            <Head title="Admin — Events" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    {statusFilters.map((status) => (
                        <button
                            key={status || 'all'}
                            type="button"
                            onClick={() => setStatus(status)}
                            className={
                                'border px-4 py-2 text-sm font-bold ' +
                                (filters.status === status ? 'border-[#14234a] bg-[#14234a] text-white' : 'border-[#d7c8a9] bg-white text-[#14234a]')
                            }
                        >
                            {status ? status.replace('_', ' ') : 'All'}
                        </button>
                    ))}
                </div>
                <Link href={route('admin.events.create')} className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">
                    New event
                </Link>
            </div>

            <div className="grid gap-3">
                {events.map((event) => (
                    <article key={event.id} className="grid gap-4 border border-[#d7c8a9] bg-white p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <StatusBadge status={event.status} />
                                <span className={`px-2.5 py-1 text-xs font-black uppercase tracking-[0.1em] ${event.audience === 'members' ? 'bg-[#f0d99a] text-[#14234a]' : 'bg-[#eadfc8] text-[#5c6579]'}`}>
                                    {event.audience === 'members' ? 'Members only' : 'Public'}
                                </span>
                                {event.company && <span className="text-xs font-bold text-[#667085]">Organized by {event.company.name}</span>}
                            </div>
                            <Link href={route('admin.events.edit', event.uuid)} className="mt-2 block text-lg font-bold text-[#14234a] hover:text-[#cf2f3b]">
                                {event.title}
                            </Link>
                            <p className="mt-1 text-sm text-[#667085]">
                                {new Date(event.starts_at).toLocaleString()} · {event.location}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {event.status === 'pending_review' && (
                                <ApprovalActions
                                    approveUrl={route('admin.events.approve', event.uuid)}
                                    rejectUrl={route('admin.events.reject', event.uuid)}
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => confirmAndDelete(route('admin.events.destroy', event.uuid), 'this event')}
                                className="text-sm font-bold text-[#cf2f3b]"
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}
                {events.length === 0 && <p className="text-[#667085]">No events match this filter.</p>}
            </div>
        </AdminLayout>
    );
}
