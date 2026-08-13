import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import { Event, PageProps } from '@/types';

type MemberEvent = Pick<Event, 'id' | 'uuid' | 'title' | 'slug' | 'description' | 'starts_at' | 'location' | 'category' | 'audience' | 'cover_image_path'>;

type Props = PageProps<{ events: MemberEvent[] }>;

function stripHtml(html: string | null): string {
    return (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function MemberEventsIndex({ events }: Props) {
    return (
        <MemberLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Member portal</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Members Events</h1>
                </div>
            }
        >
            <Head title="Member — Members Events" />

            <p className="mb-6 max-w-2xl text-sm leading-6 text-[#667085]">
                Upcoming AMCHAM events you can attend — public events open to everyone, plus events reserved exclusively for
                active members.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <Link
                        key={event.id}
                        href={route('events.show', event.slug)}
                        className="border border-[#d7c8a9] bg-white p-5 transition hover:border-[#14234a] hover:shadow-sm"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span
                                className={`px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.1em] ${
                                    event.audience === 'members' ? 'bg-[#f0d99a] text-[#14234a]' : 'bg-[#eadfc8] text-[#5c6579]'
                                }`}
                            >
                                {event.audience === 'members' ? 'Members only' : 'Public'}
                            </span>
                            {event.category && <span className="text-xs font-bold text-[#667085]">{event.category}</span>}
                        </div>
                        <h2 className="mt-3 text-lg font-bold leading-snug text-[#14234a]">{event.title}</h2>
                        <p className="mt-2 text-sm font-semibold text-[#667085]">
                            {new Date(event.starts_at).toLocaleString('en-US', {
                                month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
                            })}{' '}
                            EAT
                        </p>
                        {event.location && <p className="mt-1 text-sm text-[#667085]">{event.location}</p>}
                        {event.description && (
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#667085]">{stripHtml(event.description)}</p>
                        )}
                    </Link>
                ))}
                {events.length === 0 && (
                    <p className="text-[#667085] sm:col-span-2 lg:col-span-3">No upcoming events at the moment. Check back soon.</p>
                )}
            </div>
        </MemberLayout>
    );
}
