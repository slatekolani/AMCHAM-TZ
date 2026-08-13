import { Dialog, Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Company } from '@/types';
import Icon from '@/Components/Public/Icon';
import { btn, shell } from '@/Components/Public/ui';

/** Pixels advanced per tick, and the tick rate. Together ≈ 40px/second. */
const STEP_PX = 1;
const TICK_MS = 25;

/** Logo tile (w-52) plus the gap-5 between tiles. */
const CARD_ADVANCE_PX = 228;

/** Widest viewport the loop should still work on. */
const TARGET_TRACK_PX = 2400;

/**
 * The rail wraps by jumping back exactly one set. That jump is only reachable if the
 * scrollable distance is at least one set wide, so short member lists need more copies —
 * with only two copies of six logos the rail dead-ends before it can ever loop.
 */
function copiesNeeded(count: number): number {
    if (count === 0) return 0;
    const setWidth = count * CARD_ADVANCE_PX;
    return Math.max(2, Math.ceil(TARGET_TRACK_PX / setWidth) + 1);
}

export default function CompanyMarquee({ companies, copy = {} }: { companies: Company[]; copy?: Record<string, string> }) {
    const [selected, setSelected] = useState<Company | null>(null);
    const [paused, setPaused] = useState(false);
    const railRef = useRef<HTMLDivElement>(null);

    // Repeat the set enough times that a one-set wrap is always reachable.
    const copies = copiesNeeded(companies.length);
    const repeated = Array.from({ length: copies }, () => companies).flat();

    useEffect(() => {
        const rail = railRef.current;
        if (!rail || paused || repeated.length === 0) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const id = window.setInterval(() => {
            const setWidth = rail.scrollWidth / copies;
            if (setWidth <= 0) return;
            const next = rail.scrollLeft + STEP_PX;
            rail.scrollLeft = next >= setWidth ? next - setWidth : next;
        }, TICK_MS);

        return () => window.clearInterval(id);
    }, [paused, copies, repeated.length]);

    /** Keeps hand-scrolling inside the loop so the rail never dead-ends. */
    const handleScroll = () => {
        const rail = railRef.current;
        if (!rail) return;
        const setWidth = rail.scrollWidth / copies;
        if (setWidth > 0 && rail.scrollLeft >= setWidth) rail.scrollLeft -= setWidth;
    };

    const nudge = (direction: -1 | 1) => {
        const rail = railRef.current;
        if (!rail) return;
        const setWidth = rail.scrollWidth / copies;
        const step = Math.min(rail.clientWidth * 0.8, 480);

        // Hop forward a full set first so stepping back from the start still has runway.
        if (direction === -1 && rail.scrollLeft - step < 0 && setWidth > 0) {
            rail.scrollLeft += setWidth;
        }

        rail.scrollBy({ left: direction * step, behavior: 'smooth' });
    };

    if (companies.length === 0) return null;

    return (
        <>
            <section className="border-b border-line bg-white py-11">
                <div className={shell}>
                    <p className="px-5 text-center text-xs font-semibold uppercase tracking-caps text-ink-faint sm:px-8">
                        {copy.companies_eyebrow || 'Our member companies'}
                    </p>
                </div>

                <div
                    className="relative mt-8"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onTouchStart={() => setPaused(true)}
                    onTouchEnd={() => setPaused(false)}
                    onFocusCapture={() => setPaused(true)}
                    onBlurCapture={() => setPaused(false)}
                >
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-28" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-28" />

                    <button
                        type="button"
                        onClick={() => nudge(-1)}
                        aria-label="Previous member companies"
                        className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-navy-800 shadow-card transition hover:border-navy-800 hover:text-crimson sm:grid"
                    >
                        <Icon name="arrow" className="h-4 w-4 rotate-180" />
                    </button>
                    <button
                        type="button"
                        onClick={() => nudge(1)}
                        aria-label="Next member companies"
                        className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-navy-800 shadow-card transition hover:border-navy-800 hover:text-crimson sm:grid"
                    >
                        <Icon name="arrow" className="h-4 w-4" />
                    </button>

                    <div
                        ref={railRef}
                        onScroll={handleScroll}
                        className="hide-scrollbar flex gap-5 overflow-x-auto px-2"
                    >
                        {repeated.map((company, index) => (
                            <button
                                key={`${company.id}-${index}`}
                                type="button"
                                onClick={() => setSelected(company)}
                                aria-label={`View ${company.name}`}
                                // The second copy exists only to make the loop seamless.
                                aria-hidden={index >= companies.length}
                                tabIndex={index >= companies.length ? -1 : 0}
                                className="grid h-28 w-52 shrink-0 place-items-center rounded-xl border border-line bg-mist px-6 transition hover:border-navy-300 hover:bg-white hover:shadow-card focus:border-navy-800 focus:outline-none"
                            >
                                {company.logo_path ? (
                                    <img src={company.logo_path} alt={company.name} className="max-h-16 max-w-full object-contain" />
                                ) : (
                                    <span className="text-center text-lg font-bold text-navy-800">{company.name}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="mt-5 text-center text-xs text-ink-faint">
                    {copy.companies_helper || 'Scroll or use the arrows · Select a company to learn more'}
                </p>
            </section>

            <Transition appear show={selected !== null} as={Fragment}>
                <Dialog as="div" className="relative z-[70]" onClose={() => setSelected(null)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-5 sm:p-8">
                            <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 translate-y-4 scale-95" enterTo="opacity-100 translate-y-0 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 translate-y-0 scale-100" leaveTo="opacity-0 translate-y-4 scale-95">
                                <Dialog.Panel className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-card-lg">
                                    <button
                                        type="button"
                                        onClick={() => setSelected(null)}
                                        className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-navy-800"
                                        aria-label="Close company details"
                                    >
                                        <Icon name="close" className="h-4 w-4" />
                                    </button>

                                    {selected && (
                                        <>
                                            <div className="grid min-h-44 place-items-center bg-mist p-8">
                                                {selected.logo_path ? (
                                                    <img src={selected.logo_path} alt={selected.name} className="max-h-24 max-w-xs object-contain" />
                                                ) : (
                                                    <span className="font-display text-4xl font-semibold text-navy-800">{selected.name}</span>
                                                )}
                                            </div>

                                            <div className="p-7 sm:p-9">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <Dialog.Title className="font-display text-3xl font-semibold text-navy-800">
                                                        {selected.name}
                                                    </Dialog.Title>
                                                    {selected.membership_tier && (
                                                        <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-700">
                                                            {selected.membership_tier.name}
                                                        </span>
                                                    )}
                                                </div>
                                                {selected.sector && <p className="mt-2 text-sm font-semibold text-crimson">{selected.sector}</p>}
                                                <p className="mt-5 leading-7 text-ink-muted">
                                                    {selected.description || copy.company_fallback_description ||
                                                        'This AMCHAM Tanzania member company is part of our growing U.S.–Tanzania business community.'}
                                                </p>

                                                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                                    <Link
                                                        href={route('members.show', selected.slug)}
                                                        onClick={() => setSelected(null)}
                                                        className={btn.primary}
                                                    >
                                                        {copy.company_profile_button || 'View member profile'}
                                                        <Icon name="arrow" className="h-4 w-4" />
                                                    </Link>
                                                    {selected.website && (
                                                        <a href={selected.website} target="_blank" rel="noreferrer" className={btn.outline}>
                                                            {copy.company_website_button || 'Visit website'}
                                                            <Icon name="arrow-up-right" className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
