import { Link } from '@inertiajs/react';
import Icon, { IconName } from '@/Components/Public/Icon';
import Reveal from '@/Components/Public/Reveal';
import { btn, eyebrow as eyebrowClass, eyebrowDot, sectionPad, shell } from '@/Components/Public/ui';

export type Pillar = { title: string; body: string; image?: string | null };

/**
 * Icons are matched on the pillar's wording rather than its position, so reordering or
 * renaming pillars in the CMS keeps the right symbol.
 */
function iconFor(title?: string | null): IconName {
    const text = (title ?? '').toLowerCase();
    if (text.includes('trade') || text.includes('invest') || text.includes('econom')) return 'chart';
    if (text.includes('member')) return 'briefcase';
    if (text.includes('event')) return 'calendar';
    if (text.includes('publication') || text.includes('news') || text.includes('press')) return 'megaphone';
    if (text.includes('advoca') || text.includes('policy')) return 'landmark';
    if (text.includes('network') || text.includes('communit')) return 'users';
    return 'shield';
}

/** Each pillar links to the page that actually covers it, matched on wording like the icons. */
function hrefFor(title?: string | null): string {
    const text = (title ?? '').toLowerCase();
    if (text.includes('trade') || text.includes('invest') || text.includes('econom')) return '/resources';
    if (text.includes('member')) return '/membership';
    if (text.includes('event')) return '/events';
    if (text.includes('publication') || text.includes('news') || text.includes('press')) return '/news';
    if (text.includes('advoca') || text.includes('policy')) return '/news';
    if (text.includes('network') || text.includes('communit')) return '/members';
    return '/about-us';
}

type ChamberPillarsProps = {
    heading: string;
    body: string;
    pillars: Pillar[];
    copy?: Record<string, string>;
};

export default function ChamberPillars({ heading, body, pillars, copy = {} }: ChamberPillarsProps) {
    const validPillars = (pillars ?? []).filter((pillar) => pillar && (pillar.title?.trim() || pillar.body?.trim()));
    if (validPillars.length === 0) return null;

    return (
        <section className={sectionPad}>
            <div className={shell}>
                {/* Header runs the full width so the pillars below can breathe as one band. */}
                <Reveal className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
                    <div>
                        <p className={eyebrowClass}>
                            <span className={eyebrowDot} />
                            {copy.pillars_eyebrow || 'Why AmCham Tanzania'}
                        </p>
                        <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-navy-800 text-balance sm:text-4xl">
                            {heading}
                        </h2>
                    </div>
                    <div>
                        <p className="text-lg leading-8 text-ink-muted">{body}</p>
                        <Link href="/about-us" className={`${btn.ghost} group mt-6`}>
                            {copy.pillars_link_label || 'Learn more about the chamber'}
                            <Icon name="arrow" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </Reveal>

                <div className="mt-16 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
                    {validPillars.map((pillar, index) => {
                        const title = pillar.title?.trim() || 'Chamber service';
                        return (
                        <Reveal
                            key={`${title}-${index}`}
                            delay={index * 80}
                            className={
                                'group border-line pt-7 sm:pt-9 sm:pb-2 lg:border-l lg:pl-8 lg:pr-6 ' +
                                // Only inner columns take a left rule, so the band reads as one unit.
                                (index === 0 ? 'lg:border-l-0 lg:pl-0 ' : '') +
                                (index > 0 ? 'border-t sm:border-t-0 ' : '')
                            }
                        >
                            <Link href={hrefFor(title)} className="flex h-full flex-col">
                                <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-navy-800 transition duration-300 group-hover:bg-navy-800 group-hover:text-gold">
                                    <Icon name={iconFor(title)} className="h-6 w-6" />
                                </span>

                                <span aria-hidden="true" className="mt-6 block h-px w-8 bg-gold transition-all duration-300 group-hover:w-14" />

                                <h3 className="mt-5 font-display text-xl font-semibold leading-snug text-navy-800 transition-colors duration-200 group-hover:text-crimson">
                                    {title}
                                </h3>
                                <p className="mt-3 flex-1 text-sm leading-7 text-ink-muted">{pillar.body}</p>

                                <span className="mt-4 inline-flex items-center gap-2 pb-7 text-sm font-semibold text-crimson sm:mt-5 sm:pb-9">
                                    {copy.pillars_item_link_label || 'Read more'}
                                    <Icon name="arrow" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
