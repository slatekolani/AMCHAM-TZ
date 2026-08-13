import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Company, HeroCarouselConfig, HeroCarouselSlide } from '@/types';
import Icon from '@/Components/Public/Icon';
import CountUp from '@/Components/Public/CountUp';
import Reveal from '@/Components/Public/Reveal';
import { btn, eyebrowDot, eyebrowLight, shell } from '@/Components/Public/ui';

type BilateralCorridorProps = {
    companies: Company[];
    images: string[];
    config: HeroCarouselConfig;
};

type SlideCopy = {
    eyebrow: string;
    heading: string;
    accent: string;
    body: string;
};

const CORRIDOR_PATH = 'M 26 64 Q 200 4 374 64';
const AUTO_ADVANCE_MS = 6500;

const slideCopy: SlideCopy[] = [
    {
        eyebrow: 'The Bilateral Advantage',
        heading: 'Connecting enterprise.',
        accent: 'Across borders.',
        body: 'From Washington to Dar es Salaam, AmCham Tanzania is the standing bridge between American and Tanzanian enterprise — opening doors to policymakers, capital and counterparts on both sides of the corridor.',
    },
    {
        eyebrow: 'Trade & Investment',
        heading: 'Local insight.',
        accent: 'Global opportunity.',
        body: 'We help companies navigate Tanzania’s business environment, build trusted relationships and identify opportunities that advance bilateral trade and long-term investment.',
    },
    {
        eyebrow: 'A Trusted Business Network',
        heading: 'Stronger connections.',
        accent: 'Greater influence.',
        body: 'Members convene with business leaders, public institutions and international partners through executive dialogue, policy engagement and high-value commercial networks.',
    },
    {
        eyebrow: 'The Voice of American Business',
        heading: 'Business leadership.',
        accent: 'Shared progress.',
        body: 'AmCham Tanzania represents a growing community committed to a competitive business climate and stronger economic ties between the United States and Tanzania.',
    },
];

function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(query.matches);
        const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, []);

    return reduced;
}

function TypingTagline({ reduced, lineOne, lineTwo }: { reduced: boolean; lineOne: string; lineTwo: string }) {
    const target = `${lineOne}\n${lineTwo}`;
    const [length, setLength] = useState(reduced ? target.length : 0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (reduced) {
            setLength(target.length);
            setDeleting(false);
            return;
        }

        let delay = deleting ? 38 : 72;
        if (!deleting && length === target.length) delay = 1800;
        if (deleting && length === 0) delay = 500;

        const timer = window.setTimeout(() => {
            if (!deleting && length === target.length) {
                setDeleting(true);
            } else if (deleting && length === 0) {
                setDeleting(false);
            } else {
                setLength((current) => current + (deleting ? -1 : 1));
            }
        }, delay);

        return () => window.clearTimeout(timer);
    }, [deleting, length, reduced, target.length]);

    const [firstLine, secondLine] = target.slice(0, length).split('\n');
    const caret = <span aria-hidden="true" className="ml-1 inline-block h-[0.85em] w-0.5 animate-pulse bg-crimson align-[-0.05em]" />;

    return (
        <p aria-label={`${lineOne} ${lineTwo}`} className="min-h-[3.8rem] font-display text-2xl font-semibold leading-tight text-white sm:min-h-[4.5rem] sm:text-3xl">
            <span aria-hidden="true">
                {firstLine}{secondLine === undefined ? caret : null}
                {secondLine !== undefined && <span className="block text-gold">{secondLine}{caret}</span>}
            </span>
        </p>
    );
}

function Corridor({ reduced, config, label }: { reduced: boolean; config: HeroCarouselConfig; label: string }) {
    const corridorDuration = `${(Math.max(config.corridorDurationMs, 1000) * 2) / 1000}s`;
    return (
        <figure className="mt-10">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                <TypingTagline reduced={reduced} lineOne={config.taglineLineOne} lineTwo={config.taglineLineTwo} />
                <span className="hidden text-[10px] font-semibold uppercase tracking-caps text-white/35 sm:block">{label}</span>
            </div>
            <svg viewBox="0 0 400 80" fill="none" className="w-full" role="img" aria-label="Trade corridor between the United States and Tanzania">
                <path d={CORRIDOR_PATH} stroke="rgba(201,162,39,0.35)" strokeWidth="1.25" strokeDasharray="5 6" strokeLinecap="round" />
                <defs>
                    <filter id="moving-dot-glow" x="-250%" y="-250%" width="600%" height="600%">
                        <feGaussianBlur stdDeviation="2.4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                <circle cx="26" cy="64" r="9" fill="rgba(200,16,46,0.22)" />
                <circle cx="26" cy="64" r="4" fill="#C8102E" />
                <circle cx="374" cy="64" r="9" fill="rgba(201,162,39,0.22)" />
                <circle cx="374" cy="64" r="4" fill="#C9A227" />
                {!reduced && (
                    <circle r="3.5" fill="#ffffff" filter="url(#moving-dot-glow)">
                        <animateMotion
                            dur={corridorDuration}
                            repeatCount="indefinite"
                            path={CORRIDOR_PATH}
                            keyPoints="0;1;0"
                            keyTimes="0;0.5;1"
                            calcMode="spline"
                            keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
                        />
                        <animate
                            attributeName="fill"
                            calcMode="discrete"
                            values="#ffffff;#1EB53A;#1EB53A"
                            keyTimes="0;0.5;1"
                            dur={corridorDuration}
                            repeatCount="indefinite"
                        />
                    </circle>
                )}
            </svg>
            <figcaption className="mt-1 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-caps text-white/50">
                <span>{config.originLabel}</span>
                <span className="text-white/70">{config.destinationLabel}</span>
            </figcaption>
        </figure>
    );
}

export default function BilateralCorridor({ companies, images, config, copy: cmsCopy = {} }: BilateralCorridorProps & { copy?: Record<string, string> }) {
    const reduced = useReducedMotion();
    const fallbackImages = images.length > 0 ? images : ['/images/amcham-live/boards.jpg'];
    const fallbackSlides: HeroCarouselSlide[] = slideCopy.map((slide, slideIndex) => ({
        ...slide,
        main_image: fallbackImages[slideIndex % fallbackImages.length],
        secondary_image: fallbackImages[(slideIndex + 1) % fallbackImages.length],
        primary_cta_label: 'Join the Chamber', primary_cta_url: '/membership',
        secondary_cta_label: "See who's already in", secondary_cta_url: '/members',
    }));
    const slides = config.slides.length > 0 ? config.slides : fallbackSlides;
    const [index, setIndex] = useState(0);
    const memberCount = companies.length;
    const sectorCount = new Set(companies.map((company) => company.sector).filter(Boolean)).size;
    const copy = slides[index % slides.length];
    const secondaryImage = copy.secondary_image || slides[(index + 1) % slides.length].main_image;

    useEffect(() => {
        if (slides.length < 2 || reduced) return;
        const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), config.autoAdvanceMs || AUTO_ADVANCE_MS);
        return () => window.clearInterval(timer);
    }, [config.autoAdvanceMs, reduced, slides.length]);

    const go = (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length);

    const facts = [
        { value: memberCount > 0 ? `${memberCount}` : '150+', label: cmsCopy.hero_members_label || 'Member companies' },
        { value: sectorCount > 0 ? `${sectorCount}` : '12', label: cmsCopy.hero_sectors_label || 'Sectors represented' },
    ];

    return (
        <section
            className="relative overflow-hidden bg-navy-950 text-white"
            aria-roledescription="carousel"
            aria-label="AmCham Tanzania bilateral advantage"
        >
            <div className="absolute inset-x-0 top-0 h-1 brand-rule" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.55]"
                style={{
                    backgroundImage:
                        'radial-gradient(60rem 32rem at 12% 18%, rgba(59,94,151,0.28) 0%, transparent 70%), radial-gradient(48rem 28rem at 88% 82%, rgba(200,16,46,0.16) 0%, transparent 72%)',
                }}
            />

            <div className={`${shell} relative grid items-center gap-10 px-5 py-12 sm:gap-16 sm:px-8 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20 lg:py-28`}>
                {/* Mobile: one cohesive card containing controls, image, copy and route. */}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-900 shadow-card-lg lg:hidden">
                    {slides.length > 1 && (
                        <div className="border-b border-white/10 bg-navy-950/70 p-3">
                            <div className="flex items-center gap-2.5">
                                <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/5 text-white">
                                    <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" />
                                </button>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2" role="tablist" aria-label="Choose hero slide">
                                        {slides.map((_, slideIndex) => (
                                            <button
                                                key={slideIndex}
                                                type="button"
                                                role="tab"
                                                aria-selected={slideIndex === index}
                                                aria-label={`Show slide ${slideIndex + 1}`}
                                                onClick={() => setIndex(slideIndex)}
                                                className={'h-1.5 rounded-full transition-all duration-300 ' + (slideIndex === index ? 'w-7 bg-crimson' : 'w-2 bg-white/35')}
                                            />
                                        ))}
                                    </div>
                                    <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-white/15" aria-label="Time until next slide">
                                        <span key={`mobile-progress-${index}`} className="block h-full origin-left rounded-full bg-gradient-to-r from-white via-gold to-crimson animate-hero-progress" style={{ animationDuration: `${config.autoAdvanceMs}ms` }} />
                                    </div>
                                </div>
                                <button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/5 text-white">
                                    <Icon name="arrow" className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="relative min-h-[31rem] overflow-hidden">
                        {slides.map((slide, slideIndex) => (
                            <img
                                key={`mobile-${slide.main_image}-${slideIndex}`}
                                src={slide.main_image}
                                alt=""
                                aria-hidden={slideIndex !== index}
                                className={'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ' + (slideIndex === index ? 'opacity-100' : 'opacity-0')}
                            />
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/10" />
                        <div key={`mobile-copy-${index}`} className="absolute inset-x-0 bottom-0 animate-fade-up p-6 sm:p-8">
                            <p className={eyebrowLight}><span className={eyebrowDot} />{copy.eyebrow}</p>
                            <h1 className="mt-4 font-display text-[2rem] font-semibold leading-[1.06] tracking-tight text-balance sm:text-4xl">
                                {copy.heading}<span className="block text-gold">{copy.accent}</span>
                            </h1>
                            <p className="mt-4 text-sm leading-6 text-white/75 sm:text-base sm:leading-7">{copy.body}</p>
                        </div>
                    </div>

                    <div className="border-t border-white/10 bg-navy-950/60 px-5 pb-5">
                        <Corridor reduced={reduced} config={config} label={cmsCopy.hero_corridor_label || 'Bilateral corridor'} />
                    </div>
                </div>

                <Reveal className="lg:block">
                    <div key={`copy-${index}`} className="hidden animate-fade-up lg:block">
                        <p className={eyebrowLight}>
                            <span className={eyebrowDot} />
                            {copy.eyebrow}
                        </p>

                        <h1 className="mt-5 font-display text-[2rem] font-semibold leading-[1.08] tracking-tight text-balance sm:mt-6 sm:text-4xl lg:text-[2.9rem]">
                            {copy.heading}
                            <span className="block text-gold">{copy.accent}</span>
                        </h1>

                        <p className="mt-5 max-w-xl text-base leading-7 text-white/65 sm:mt-6 sm:text-lg sm:leading-8">{copy.body}</p>
                    </div>

                    <div className="hidden lg:block">
                        <Corridor reduced={reduced} config={config} label={cmsCopy.hero_corridor_label || 'Bilateral corridor'} />
                    </div>

                    <dl className="mt-0 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 lg:mt-10">
                        {facts.map((fact, factIndex) => (
                            <div key={fact.label} className="bg-navy-950/80 px-4 py-5 backdrop-blur-sm sm:px-6 sm:py-6">
                                <dt className="sr-only">{fact.label}</dt>
                                <dd>
                                    <span className="block font-display text-3xl font-semibold tabular-nums text-white sm:text-4xl">
                                        <CountUp value={fact.value} duration={1700} delay={factIndex * 180} />
                                    </span>
                                    <span className="mt-2 block text-[11px] font-semibold uppercase tracking-caps text-white/45">{fact.label}</span>
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-8 flex flex-col gap-3 [&>a]:w-full sm:mt-10 sm:flex-row sm:gap-4 sm:[&>a]:w-auto">
                        <Link href={copy.primary_cta_url} className={btn.primary}>
                            {copy.primary_cta_label}
                            <Icon name="arrow" className="h-4 w-4" />
                        </Link>
                        <Link href={copy.secondary_cta_url} className={btn.outlineLight}>{copy.secondary_cta_label}</Link>
                    </div>

                </Reveal>

                <Reveal delay={140} className="relative hidden lg:block">
                    <div className="relative mx-auto max-w-lg pb-8 sm:pb-0 lg:mr-0">
                        <div aria-hidden="true" className="absolute right-0 top-10 h-20 w-20 rounded-full border border-gold/25 sm:-right-6 sm:-top-6 sm:h-32 sm:w-32" />

                        {slides.length > 1 && (
                            <div className="relative z-20 mb-3 rounded-xl border border-white/15 bg-navy-900/70 p-3 shadow-card backdrop-blur-md sm:mb-4 sm:p-4">
                                <div className="flex items-center gap-2.5 sm:gap-3">
                                    <button
                                        type="button"
                                        onClick={() => go(index - 1)}
                                        aria-label="Previous slide"
                                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-white/60 hover:bg-white/15 sm:h-9 sm:w-9"
                                    >
                                        <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" />
                                    </button>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2" role="tablist" aria-label="Choose hero slide">
                                                {slides.map((_, slideIndex) => (
                                                    <button
                                                        key={slideIndex}
                                                        type="button"
                                                        role="tab"
                                                        aria-selected={slideIndex === index}
                                                        aria-label={`Show slide ${slideIndex + 1}`}
                                                        onClick={() => setIndex(slideIndex)}
                                                        className={'h-1.5 rounded-full transition-all duration-300 ' + (slideIndex === index ? 'w-7 bg-crimson' : 'w-2 bg-white/35 hover:bg-white/70')}
                                                    />
                                                ))}
                                            </div>
                                            <span className="hidden shrink-0 text-[9px] font-semibold uppercase tracking-caps text-white/55 sm:inline">
                                                Next {String(((index + 1) % slides.length) + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-white/15" aria-label="Time until next slide">
                                            <span
                                                    key={`progress-${index}`}
                                                    className="block h-full origin-left rounded-full bg-gradient-to-r from-white via-gold to-crimson animate-hero-progress"
                                                    style={{ animationDuration: `${config.autoAdvanceMs}ms` }}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => go(index + 1)}
                                        aria-label="Next slide"
                                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-white/60 hover:bg-white/15 sm:h-9 sm:w-9"
                                    >
                                        <Icon name="arrow" className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-navy-900 shadow-card-lg">
                            {slides.map((slide, slideIndex) => (
                                <img
                                    key={`${slide.main_image}-${slideIndex}`}
                                    src={slide.main_image}
                                    alt=""
                                    aria-hidden={slideIndex !== index}
                                    className={'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ' + (slideIndex === index ? 'opacity-100' : 'opacity-0')}
                                />
                            ))}
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />

                        </div>

                        <div key={`secondary-${index}`} className="absolute bottom-0 left-0 w-32 overflow-hidden rounded-xl shadow-card-lg ring-4 ring-navy-950 sm:-bottom-8 sm:-left-10 sm:w-52 sm:ring-8">
                            <img src={secondaryImage} alt="" className="aspect-square w-full object-cover" />
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
