import Icon from '@/Components/Public/Icon';
import PageHero from '@/Components/Public/PageHero';
import Reveal from '@/Components/Public/Reveal';
import { eyebrow as eyebrowClass, eyebrowDot, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { BoardMember, PageProps } from '@/types';
import { Dialog, Transition } from '@headlessui/react';
import { Head } from '@inertiajs/react';
import { Fragment, useState } from 'react';
import { useCms } from '@/utils/cms';

export default function BoardMembers({ canLogin, canRegister, boardMembers }: PageProps<{ canLogin: boolean; canRegister: boolean; boardMembers: BoardMember[] }>) {
    const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
    const t = useCms();

    return <PublicLayout canLogin={canLogin} canRegister={canRegister}>
        <Head title="AMCHAM Tanzania Board Members" />
        <PageHero eyebrow={t('board_hero_eyebrow', 'Leadership')} title={t('board_hero_title', 'The leaders guiding the chamber.')} description={t('board_hero_description', 'Meet the business leaders volunteering their experience, judgement and networks to advance AMCHAM Tanzania.')} image={t('board_hero_image', '/images/amcham-live/boards.jpg')} breadcrumb={[{ label: t('nav_about', 'About'), href: '/about-us' }, { label: t('nav_members', 'Board Members') }]} />

        <section className={`${sectionPad} overflow-hidden`}>
            <div className={shell}>
                <Reveal className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
                    <div><p className={eyebrowClass}><span className={eyebrowDot} />{t('board_section_eyebrow', 'Governance')}</p><h2 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight text-navy-800 sm:text-5xl">{t('board_section_title', 'A board drawn from the business community.')}</h2></div>
                    <p className="text-lg leading-8 text-ink-muted">{t('board_section_description', 'Our directors represent the breadth of the U.S.–Tanzania commercial relationship and serve the chamber on behalf of its members.')}</p>
                </Reveal>
                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {boardMembers.map((member, index) => <Reveal key={member.id} delay={(index % 3) * 80} className={index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}>
                        <button type="button" onClick={() => setSelectedMember(member)} className={`group relative block w-full overflow-hidden rounded-2xl bg-navy-800 text-left ${index === 0 ? 'h-[30rem] sm:h-[32rem]' : 'h-[26rem]'}`}>
                            {member.photo_path ? <img src={member.photo_path} alt={member.name} className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" /> : <div className="absolute inset-0 grid place-items-center font-display text-8xl text-white/20">{member.name.charAt(0)}</div>}
                            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,13,29,0.95)_0%,rgba(6,13,29,0.78)_30%,rgba(6,13,29,0.30)_58%,rgba(6,13,29,0)_78%)]" />
                            {index === 0 && <span className="absolute left-6 top-6 rounded-full bg-crimson px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">Board Chairman</span>}
                            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8"><h3 className={`${index === 0 ? 'text-3xl' : 'text-2xl'} font-display font-semibold text-white`}>{member.name}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-white/65">{member.role_title}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">View profile <Icon name="arrow-up-right" className="h-4 w-4" /></span></div>
                        </button>
                    </Reveal>)}
                </div>
                {boardMembers.length === 0 && <p className="mt-12 text-ink-muted">{t('board_empty', 'Board member profiles will be published soon.')}</p>}
            </div>
        </section>

        <Transition appear show={selectedMember !== null} as={Fragment}><Dialog as="div" className="relative z-[70]" onClose={() => setSelectedMember(null)}><Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-navy-950/75 backdrop-blur-sm" /></Transition.Child><div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-5"><Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 translate-y-4 scale-95" enterTo="opacity-100 translate-y-0 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 translate-y-0 scale-100" leaveTo="opacity-0 translate-y-4 scale-95"><Dialog.Panel className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-card-lg md:grid-cols-[18rem_1fr]">{selectedMember && <><div className="min-h-80 bg-mist">{selectedMember.photo_path ? <img src={selectedMember.photo_path} alt={selectedMember.name} className="h-full w-full object-cover object-top" /> : <div className="grid h-full place-items-center font-display text-7xl text-navy-800">{selectedMember.name.charAt(0)}</div>}</div><div className="p-7 sm:p-9"><p className="text-xs font-semibold uppercase tracking-caps text-crimson">Board member</p><Dialog.Title className="mt-3 font-display text-3xl font-semibold text-navy-800">{selectedMember.name}</Dialog.Title><p className="mt-3 font-semibold leading-7 text-navy-700">{selectedMember.role_title}</p><p className="mt-6 leading-7 text-ink-muted">{selectedMember.bio || `${selectedMember.name} serves on the AMCHAM Tanzania Board, contributing leadership and industry perspective to the chamber’s mission.`}</p>{selectedMember.linkedin_url && <a href={selectedMember.linkedin_url} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 font-semibold text-[#0A66C2]">View LinkedIn profile <Icon name="arrow-up-right" className="h-4 w-4" /></a>}</div></>}<button onClick={() => setSelectedMember(null)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-navy-800 shadow-lg" aria-label="Close board member profile"><Icon name="close" className="h-4 w-4" /></button></Dialog.Panel></Transition.Child></div></div></Dialog></Transition>
    </PublicLayout>;
}
