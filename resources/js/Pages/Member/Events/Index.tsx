import StatusBadge from '@/Components/Admin/StatusBadge';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Event, PageProps } from '@/types';
import { confirmAndDelete } from '@/utils/alerts';

type EventsIndexProps = PageProps<{ events: Event[] }>;

export default function MemberEventsIndex({ events }: EventsIndexProps) {
    return (
        <MemberLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Member portal</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Event submissions</h1>
                </div>
            }
        >
            <Head title="Member — Events" />

            <div className="mb-5">
                <Link href={route('member.events.create')} className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">
                    New event
                </Link>
            </div>

            <div className="grid gap-3">
                {events.map((event) => (
                    <article key={event.id} className="grid gap-3 border border-[#d7c8a9] bg-white p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <StatusBadge status={event.status} />
                                <h3 className="text-lg font-bold text-[#14234a]">{event.title}</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                {['draft', 'rejected'].includes(event.status) && (
                                    <>
                                        <Link href={route('member.events.edit', event.uuid)} className="text-sm font-bold text-[#14234a]">
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => router.post(route('member.events.submit', event.uuid), {}, { preserveScroll: true })}
                                            className="text-sm font-bold text-[#1e7c89]"
                                        >
                                            Submit for review
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => confirmAndDelete(route('member.events.destroy', event.uuid), 'this draft')}
                                            className="text-sm font-bold text-[#cf2f3b]"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        {event.status === 'rejected' && event.rejection_reason && (
                            <p className="border border-[#cf2f3b] bg-[#fdeeee] p-3 text-sm text-[#cf2f3b]">
                                Rejected: {event.rejection_reason}
                            </p>
                        )}
                        <p className="text-sm text-[#667085]">
                            {new Date(event.starts_at).toLocaleString()} · {event.location}
                        </p>
                    </article>
                ))}
                {events.length === 0 && <p className="text-[#667085]">You haven't proposed any events yet.</p>}
            </div>
        </MemberLayout>
    );
}
