import RichTextEditor from '@/Components/Admin/RichTextEditor';
import CoverImageUpload from '@/Components/CoverImageUpload';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, useForm } from '@inertiajs/react';
import { Event, PageProps } from '@/types';
import { FormEvent } from 'react';

type EventsEditProps = PageProps<{ event: Event | null }>;

function toLocalInput(value: string | null): string {
    if (!value) return '';
    const date = new Date(value);
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Africa/Dar_es_Salaam', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(date).map((part) => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export default function MemberEventsEdit({ event }: EventsEditProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: event ? 'put' : undefined,
        title: event?.title ?? '',
        description: event?.description ?? '',
        location: event?.location ?? '',
        starts_at: toLocalInput(event?.starts_at ?? null),
        ends_at: toLocalInput(event?.ends_at ?? null),
        cover_image: null as File | null,
        category: event?.category ?? '',
        registration_url: event?.registration_url ?? '',
    });

    const submit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        post(event ? route('member.events.update', event.uuid) : route('member.events.store'), { forceFormData: true });
    };

    return (
        <MemberLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Member portal</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">{event ? 'Edit draft' : 'New event'}</h1>
                </div>
            }
        >
            <Head title="Member — Edit event" />

            <form onSubmit={submit} className="grid max-w-4xl gap-5">
                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Title
                    <input value={data.title} onChange={(formEvent) => setData('title', formEvent.target.value)} className="border-[#d7c8a9]" />
                    {errors.title && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.title}</span>}
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Starts at (East Africa Time)
                        <input
                            type="datetime-local"
                            value={data.starts_at}
                            onChange={(formEvent) => setData('starts_at', formEvent.target.value)}
                            className="border-[#d7c8a9]"
                        />
                        {errors.starts_at && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.starts_at}</span>}
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Ends at (East Africa Time)
                        <input
                            type="datetime-local"
                            value={data.ends_at}
                            onChange={(formEvent) => setData('ends_at', formEvent.target.value)}
                            className="border-[#d7c8a9]"
                        />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Location
                        <input value={data.location} onChange={(formEvent) => setData('location', formEvent.target.value)} className="border-[#d7c8a9]" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Category
                        <input value={data.category} onChange={(formEvent) => setData('category', formEvent.target.value)} className="border-[#d7c8a9]" />
                    </label>
                    <CoverImageUpload currentImage={event?.cover_image_path} error={errors.cover_image} onChange={(file) => setData('cover_image', file)} />
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Registration URL
                        <input value={data.registration_url} onChange={(formEvent) => setData('registration_url', formEvent.target.value)} className="border-[#d7c8a9]" />
                    </label>
                </div>

                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Description
                    <RichTextEditor value={data.description} onChange={(html) => setData('description', html)} />
                    <span className="text-xs font-medium text-slate-500">Use {'{{event_date}}'} where the scheduled event date should appear. It updates automatically from “Starts at”.</span>
                </label>

                <p className="text-sm text-[#667085]">
                    Saving keeps this as a draft only you can see. Submit it for review from the Event submissions list when ready.
                </p>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-fit bg-[#14234a] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60"
                >
                    Save draft
                </button>
            </form>
        </MemberLayout>
    );
}
