import PageHero from '@/Components/Public/PageHero';
import Icon from '@/Components/Public/Icon';
import { btn, cardStatic, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm } from '@inertiajs/react';
import { Event, PageProps } from '@/types';
import { FormEvent } from 'react';
import { renderEventDescription } from '@/utils/event';

type EventShowProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    event: Event;
}>;

export default function EventShow({ canLogin, canRegister, event }: EventShowProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        job_title: '',
        notes: '',
    });
    const startDate = new Date(event.starts_at);
    const isPast = startDate.getTime() < Date.now();
    const dateLabel = startDate.toLocaleDateString('en-US', { dateStyle: 'full', timeZone: 'Africa/Dar_es_Salaam' });
    const timeLabel = startDate.toLocaleTimeString('en-US', { timeStyle: 'short', timeZone: 'Africa/Dar_es_Salaam' });
    const publishedLabel = new Date(event.published_at ?? event.created_at).toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'Africa/Dar_es_Salaam' });
    const renderedDescription = renderEventDescription(event);
    const submit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        post(route('events.register', event.slug), { preserveScroll: true, onSuccess: () => reset() });
    };

    const fieldClass = 'mt-2 w-full rounded-md border-line bg-white px-4 py-3 text-sm text-ink focus:border-navy-800 focus:ring-navy-800';

    return (
        <PublicLayout
            canLogin={canLogin}
            canRegister={canRegister}
            seo={{
                title: event.title,
                description: renderedDescription.replace(/<[^>]*>/g, '').slice(0, 160) || `Join AMCHAM Tanzania for ${event.title}.`,
                image: event.cover_image_path ?? '/images/brand/amcham-logo-white-bg.png',
                structuredData: {
                    '@type': 'Event',
                    name: event.title,
                    description: renderedDescription.replace(/<[^>]*>/g, ''),
                    startDate: event.starts_at,
                    endDate: event.ends_at,
                    eventStatus: 'https://schema.org/EventScheduled',
                    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                    location: {
                        '@type': 'Place',
                        name: event.location ?? 'Dar es Salaam, Tanzania',
                        address: { '@type': 'PostalAddress', addressLocality: 'Dar es Salaam', addressCountry: 'TZ' },
                    },
                    image: event.cover_image_path,
                    organizer: { '@type': 'Organization', name: event.company?.name ?? 'AMCHAM Tanzania' },
                },
            }}
        >
            <Head title={event.title} />
            <PageHero
                eyebrow={event.category ?? 'Event'}
                title={event.title}
                image={event.cover_image_path ?? '/images/amcham-live/boards.jpg'}
                breadcrumb={[{ label: 'Events', href: '/events' }, { label: event.title }]}
                compact
            />

            <section className="bg-white px-5 py-16 sm:px-8 lg:py-24">
                <div className={`${shell} grid gap-10 lg:grid-cols-[1fr_22rem]`}>
                    <div
                        className="article-prose max-w-none whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: renderedDescription }}
                    />

                    <aside className="lg:sticky lg:top-32 h-fit">
                        <div className={`${cardStatic} overflow-hidden`}>
                            <div className="border-b border-line bg-navy-950 px-7 py-5 text-white">
                                <p className="text-xs font-semibold uppercase tracking-caps text-white/60">Event Details</p>
                            </div>
                            <div className="grid gap-5 p-7">
                                <p className="border-b border-line pb-5 text-sm font-medium text-ink-faint">Published on {publishedLabel}</p>
                                <div className="flex items-start gap-3.5">
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-800">
                                        <Icon name="calendar" className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Date</p>
                                        <p className="mt-1 font-semibold text-navy-800">{dateLabel}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3.5">
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-800">
                                        <Icon name="clock" className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Time</p>
                                        <p className="mt-1 font-semibold text-navy-800">{timeLabel} EAT</p>
                                    </div>
                                </div>
                                {event.location && (
                                    <div className="flex items-start gap-3.5">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-800">
                                            <Icon name="pin" className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Location</p>
                                            <p className="mt-1 font-semibold text-navy-800">{event.location}</p>
                                        </div>
                                    </div>
                                )}
                                {event.company && (
                                    <div className="flex items-start gap-3.5">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-800">
                                            <Icon name="briefcase" className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Organised by</p>
                                            <p className="mt-1 font-semibold text-navy-800">{event.company.name}</p>
                                        </div>
                                    </div>
                                )}
                                {isPast ? (
                                    <p className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-line bg-mist px-5 py-3.5 text-center text-sm font-semibold text-ink-faint">
                                        This event has ended
                                    </p>
                                ) : (
                                    <a href="#register" className={`${btn.primary} mt-2 w-full`}>
                                        Register for this Event
                                        <Icon name="arrow" className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {!isPast && (
            <section id="register" className="scroll-mt-28 bg-sand-50 px-5 py-16 sm:px-8 lg:py-24">
                <div className={`${shell} grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16`}>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-caps text-crimson">Event registration</p>
                        <h2 className="mt-4 font-display text-3xl font-semibold text-navy-800 sm:text-4xl">Reserve your place.</h2>
                        <p className="mt-5 leading-7 text-ink-muted">
                            Register for {event.title}. Your details will be securely sent to the AMCHAM Tanzania events team.
                        </p>
                    </div>

                    <form onSubmit={submit} className={`${cardStatic} grid gap-5 p-6 sm:grid-cols-2 sm:p-8`}>
                        {[
                            ['name', 'Full name', true, 'text'],
                            ['email', 'Email address', true, 'email'],
                            ['phone', 'Phone number', true, 'tel'],
                            ['company', 'Company / organisation', false, 'text'],
                            ['job_title', 'Job title', false, 'text'],
                        ].map(([key, label, required, type]) => (
                            <label key={String(key)} className="text-sm font-semibold text-navy-800">
                                {label} {required && <span className="text-crimson">*</span>}
                                <input
                                    type={String(type)}
                                    required={Boolean(required)}
                                    value={data[key as keyof typeof data]}
                                    onChange={(inputEvent) => setData(key as keyof typeof data, inputEvent.target.value)}
                                    className={fieldClass}
                                />
                                {errors[key as keyof typeof errors] && <span className="mt-1 block text-xs text-crimson">{errors[key as keyof typeof errors]}</span>}
                            </label>
                        ))}
                        <label className="text-sm font-semibold text-navy-800 sm:col-span-2">
                            Notes or accessibility requirements
                            <textarea value={data.notes} onChange={(inputEvent) => setData('notes', inputEvent.target.value)} className={`${fieldClass} min-h-28`} />
                            {errors.notes && <span className="mt-1 block text-xs text-crimson">{errors.notes}</span>}
                        </label>
                        <button type="submit" disabled={processing} className={`${btn.primaryLg} w-full sm:col-span-2 sm:w-fit disabled:opacity-60`}>
                            {processing ? 'Submitting…' : 'Complete Registration'}
                            <Icon name="arrow" className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </section>
            )}
        </PublicLayout>
    );
}
