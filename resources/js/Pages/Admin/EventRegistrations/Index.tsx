import ApprovalActions from '@/Components/Admin/ApprovalActions';
import StatusBadge from '@/Components/Admin/StatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { Event, EventRegistration, PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';

type Props = PageProps<{
    registrations: EventRegistration[];
    events: Pick<Event, 'id' | 'title'>[];
    filters: { event_id: number | ''; status: string };
}>;

const statusFilters = ['', 'pending', 'approved', 'rejected'];

export default function EventRegistrationsIndex({ registrations, events, filters }: Props) {
    const setFilters = (next: Partial<{ event_id: number | ''; status: string }>) => {
        const query = { ...filters, ...next };
        router.get(
            route('admin.event-registrations.index'),
            { ...(query.event_id ? { event_id: query.event_id } : {}), ...(query.status ? { status: query.status } : {}) },
            { preserveState: true },
        );
    };
    const exportUrl = route('admin.event-registrations.export', filters.event_id ? { event_id: filters.event_id } : {});

    return (
        <AdminLayout header={<div><p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Events</p><h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Event registrations</h1></div>}>
            <Head title="Admin — Event registrations" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    {statusFilters.map((status) => (
                        <button
                            key={status || 'all'}
                            type="button"
                            onClick={() => setFilters({ status })}
                            className={
                                'border px-4 py-2 text-sm font-bold ' +
                                (filters.status === status ? 'border-[#14234a] bg-[#14234a] text-white' : 'border-[#d7c8a9] bg-white text-[#14234a]')
                            }
                        >
                            {status || 'All'}
                        </button>
                    ))}
                    <select
                        value={filters.event_id}
                        onChange={(event) => setFilters({ event_id: event.target.value ? Number(event.target.value) : '' })}
                        className="border-[#d7c8a9] bg-white text-sm font-semibold text-[#14234a]"
                    >
                        <option value="">All events</option>
                        {events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
                    </select>
                </div>
                <a href={exportUrl} className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">Export to Excel</a>
            </div>

            <div className="overflow-x-auto border border-[#d7c8a9] bg-white">
                <table className="min-w-full divide-y divide-[#d7c8a9] text-left text-sm">
                    <thead className="bg-[#f7f3ea] text-xs uppercase tracking-wider text-[#667085]"><tr>
                        {['Registrant', 'Event', 'Phone', 'Company / title', 'Status', 'Registered', ''].map((heading) => <th key={heading} className="px-5 py-3">{heading}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-[#eee5d4]">
                        {registrations.map((registration) => <tr key={registration.id}>
                            <td className="px-5 py-4"><p className="font-bold text-[#14234a]">{registration.name}</p><a href={`mailto:${registration.email}`} className="text-[#cf2f3b]">{registration.email}</a></td>
                            <td className="px-5 py-4"><p className="font-semibold text-[#14234a]">{registration.event.title}</p><p className="text-xs text-[#667085]">{new Date(registration.event.starts_at).toLocaleString()}</p></td>
                            <td className="px-5 py-4 text-[#667085]">{registration.phone}</td>
                            <td className="px-5 py-4 text-[#667085]">{registration.company || '—'}{registration.job_title && <p className="text-xs">{registration.job_title}</p>}</td>
                            <td className="px-5 py-4">
                                <StatusBadge status={registration.status} />
                                {registration.status === 'rejected' && registration.rejection_reason && (
                                    <p className="mt-1 max-w-[14rem] text-xs text-[#667085]">{registration.rejection_reason}</p>
                                )}
                            </td>
                            <td className="px-5 py-4 text-[#667085]">{new Date(registration.created_at).toLocaleString()}</td>
                            <td className="px-5 py-4">
                                {registration.status === 'pending' && (
                                    <ApprovalActions
                                        approveUrl={route('admin.event-registrations.approve', registration.uuid)}
                                        rejectUrl={route('admin.event-registrations.reject', registration.uuid)}
                                    />
                                )}
                            </td>
                        </tr>)}
                        {registrations.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-[#667085]">No registrations found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
