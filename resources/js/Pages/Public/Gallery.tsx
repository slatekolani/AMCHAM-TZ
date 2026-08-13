import PageHero from '@/Components/Public/PageHero';
import Icon from '@/Components/Public/Icon';
import Reveal from '@/Components/Public/Reveal';
import Pagination from '@/Components/Public/Pagination';
import { card, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Event, Paginated, PageProps } from '@/types';
import { Dialog, Transition } from '@headlessui/react';
import { Head, Link } from '@inertiajs/react';
import { Fragment, useState } from 'react';
import { useCms } from '@/utils/cms';

type MediaItem = { id: number; url: string; filename: string; description: string | null; created_at: string };

export default function Gallery({ canLogin, canRegister, media, events }: PageProps<{ canLogin: boolean; canRegister: boolean; media: Paginated<MediaItem>; events: Event[] }>) {
    const [selected, setSelected] = useState<MediaItem | null>(null);
    const t = useCms();
    return <PublicLayout canLogin={canLogin} canRegister={canRegister}>
        <Head title="AMCHAM Tanzania Gallery" />
        <PageHero eyebrow="Gallery" title={t('gallery_hero_title', 'Moments from the AMCHAM community.')} description={t('gallery_hero_description', 'Events, delegations and conversations connecting business leaders across Tanzania and the United States.')} image={t('gallery_hero_image', '/images/amcham-live/thanksgiving.png')} breadcrumb={[{ label: 'Gallery' }]} />

        <section className={sectionPad}><div className={shell}>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-caps text-crimson">{t('gallery_section_eyebrow', 'Photo library')}</p><h2 className="mt-3 font-display text-3xl font-semibold text-navy-800 sm:text-4xl">{t('gallery_section_title', 'The chamber in action.')}</h2></div><p className="text-sm text-ink-faint">{media.total} {media.total === 1 ? 'photo' : 'photos'}</p></div>
            {media.data.length > 0 ? <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">{media.data.map((item, index) => <Reveal key={item.id} delay={(index % 3) * 70} className="mb-5 break-inside-avoid"><button type="button" onClick={() => setSelected(item)} className={`${card} group w-full overflow-hidden text-left`}><div className="overflow-hidden"><img src={item.url} alt={item.description || item.filename} className="max-h-[28rem] w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-5"><p className="leading-7 text-ink-muted">{item.description}</p><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">{new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div></button></Reveal>)}</div> : <p className="mt-10 text-ink-muted">{t('gallery_empty', 'Gallery images will be published soon.')}</p>}
            <Pagination currentPage={media.current_page} lastPage={media.last_page} href="/gallery" />
        </div></section>

        <section className="bg-mist px-5 py-20 sm:px-8 lg:py-28"><div className={shell}>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-caps text-crimson">Event gallery</p><h2 className="mt-3 font-display text-3xl font-semibold text-navy-800 sm:text-4xl">Events across our calendar.</h2></div><Link href={route('events')} className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800">View all events <Icon name="arrow" className="h-4 w-4" /></Link></div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{events.map((event, index) => <Reveal key={event.slug} delay={(index % 3) * 70}><Link href={route('events.show', event.slug)} className={`${card} group block h-full overflow-hidden`}><div className="h-56 overflow-hidden"><img src={event.cover_image_path!} alt={event.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-6"><p className="text-xs font-semibold uppercase tracking-wide text-crimson">{event.category || 'Event'}</p><h3 className="mt-2 text-xl font-bold leading-snug text-navy-800">{event.title}</h3><p className="mt-3 text-xs font-medium text-ink-faint">Published on {new Date(event.published_at ?? event.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Africa/Dar_es_Salaam' })}</p><p className="mt-1 text-sm text-ink-faint"><strong className="text-navy-800">Event date and time:</strong> {new Date(event.starts_at).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Africa/Dar_es_Salaam' })} EAT{event.location ? ` · ${event.location}` : ''}</p></div></Link></Reveal>)}</div>
            {events.length === 0 && <p className="mt-10 text-ink-muted">Published event images will appear here.</p>}
        </div></section>

        <Transition appear show={selected !== null} as={Fragment}><Dialog as="div" className="relative z-[70]" onClose={() => setSelected(null)}><Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm" /></Transition.Child><div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-5"><Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"><Dialog.Panel className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-card-lg">{selected && <><img src={selected.url} alt={selected.description || selected.filename} className="max-h-[70vh] w-full bg-navy-950 object-contain" /><div className="p-6"><Dialog.Title className="text-lg font-semibold leading-7 text-navy-800">{selected.description}</Dialog.Title></div></>}<button onClick={() => setSelected(null)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-navy-800 shadow-lg" aria-label="Close image"><Icon name="close" className="h-4 w-4" /></button></Dialog.Panel></Transition.Child></div></div></Dialog></Transition>
    </PublicLayout>;
}
