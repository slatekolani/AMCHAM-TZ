import { Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { BoardMember } from '@/types';
import Icon from '@/Components/Public/Icon';
import Reveal from '@/Components/Public/Reveal';
import BoardMemberDialog from '@/Components/Public/BoardMemberDialog';
import { btn, eyebrow as eyebrowClass, eyebrowDot, sectionPad, shell } from '@/Components/Public/ui';

/**
 * Board titles usually arrive as "Board Member | Partner, Deloitte" — split so the seat and
 * the organisation can be typeset differently.
 *
 * Some records carry no separator. A short one ("Executive Director") is a seat, but a long
 * one ("Public Policy Manager for East and Horn of Africa, Meta Inc.") is really an
 * organisation line — setting that in the seat's uppercase crimson would shout.
 */
const SEAT_MAX_LENGTH = 32;

function splitTitle(roleTitle: string): { seat: string | null; org: string | null } {
    const [first, ...rest] = roleTitle.split('|').map((part) => part.trim());

    if (rest.length > 0) {
        return { seat: first, org: rest.join(' | ') };
    }

    return first.length > SEAT_MAX_LENGTH ? { seat: null, org: first } : { seat: first, org: null };
}

function initials(name: string): string {
    return name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('');
}

export default function LeadershipStrip({ members = [], copy = {} }: { members?: BoardMember[]; copy?: Record<string, string> }) {
    const [selected, setSelected] = useState<BoardMember | null>(null);
    const [activeCard, setActiveCard] = useState(0);
    const railRef = useRef<HTMLDivElement>(null);

    /** Below lg the portraits are a snap rail; keep the indicator in step with the scroll. */
    const trackRail = () => {
        const rail = railRef.current;
        if (!rail) return;
        const railCentre = rail.getBoundingClientRect().left + rail.clientWidth / 2;
        let nearest = 0;
        let shortest = Number.POSITIVE_INFINITY;
        Array.from(rail.children).forEach((card, index) => {
            const box = card.getBoundingClientRect();
            const distance = Math.abs(box.left + box.width / 2 - railCentre);
            if (distance < shortest) {
                shortest = distance;
                nearest = index;
            }
        });
        setActiveCard(nearest);
    };

    const scrollToCard = (index: number) => {
        const rail = railRef.current;
        const card = rail?.children[index] as HTMLElement | undefined;
        if (!rail || !card) return;
        rail.scrollTo({ left: card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2, behavior: 'smooth' });
    };

    // Tolerate absent props (partial Inertia reloads, cached page objects) rather than throwing.
    if (!Array.isArray(members) || members.length === 0) return null;

    return (
        <section className={`${sectionPad} bg-white`}>
            <div className={shell}>
                <Reveal className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-16">
                    <div>
                        <p className={eyebrowClass}>
                            <span className={eyebrowDot} />
                            {copy.leadership_eyebrow || 'Governance'}
                        </p>
                        <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-navy-800 text-balance sm:text-4xl">
                            {copy.leadership_heading || "Led by the region's business leaders."}
                        </h2>
                    </div>
                    <p className="max-w-xl text-lg leading-8 text-ink-muted">
                        {copy.leadership_body || 'The chamber is directed by a volunteer board drawn from the executives who build, finance and operate across the U.S.–Tanzania corridor.'}
                    </p>
                </Reveal>

                <div
                    ref={railRef}
                    onScroll={trackRail}
                    className="hide-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:mt-14 lg:grid lg:grid-cols-6 lg:gap-x-6 lg:gap-y-10 lg:overflow-visible lg:pb-0"
                >
                    {members.map((member, index) => {
                        const { seat, org } = splitTitle(member.role_title);

                        return (
                            <Reveal key={member.id} delay={(index % 6) * 70} className="w-[78vw] shrink-0 snap-center sm:w-[44vw] lg:w-auto lg:shrink">
                                <figure className="group">
                                  <button
                                      type="button"
                                      onClick={() => setSelected(member)}
                                      className="block w-full text-left"
                                      aria-label={`View profile of ${member.name}`}
                                  >
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-navy-100">
                                        {/* Portraits stay in full colour — desaturating people reads as memorial. */}
                                        {member.photo_path ? (
                                            <img
                                                src={member.photo_path}
                                                alt={member.name}
                                                loading="lazy"
                                                className="h-full w-full object-cover object-top transition duration-500 ease-out group-hover:scale-[1.04]"
                                            />
                                        ) : (
                                            <span className="grid h-full w-full place-items-center font-display text-3xl font-semibold text-navy-400">
                                                {initials(member.name)}
                                            </span>
                                        )}
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-navy-950/70 via-navy-950/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                        />
                                    </div>

                                    <figcaption className="mt-4">
                                        <span aria-hidden="true" className="block h-px w-7 bg-gold transition-all duration-300 group-hover:w-12" />
                                        <p className="mt-3 text-sm font-bold leading-snug text-navy-800">{member.name}</p>
                                        {seat && <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-crimson">{seat}</p>}
                                        {org && <p className="mt-1.5 text-xs leading-5 text-ink-faint">{org}</p>}
                                        {/* Touch devices never hover, so the cue stays visible until there is a pointer. */}
                                        <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-crimson transition-opacity duration-200 lg:opacity-0 lg:group-hover:opacity-100">
                                            {copy.leadership_profile_label || 'View profile'}
                                            <Icon name="arrow-up-right" className="h-3 w-3" />
                                        </span>
                                    </figcaption>
                                  </button>
                                </figure>
                            </Reveal>
                        );
                    })}
                </div>

                <div className="mt-6 flex items-center justify-center gap-2.5 lg:hidden">
                    {members.map((member, index) => (
                        <button
                            key={member.id}
                            type="button"
                            onClick={() => scrollToCard(index)}
                            aria-label={`Show ${member.name}`}
                            aria-current={index === activeCard}
                            className={
                                'h-2 rounded-full transition-all duration-300 ' +
                                (index === activeCard ? 'w-7 bg-crimson' : 'w-2 bg-navy-200 hover:bg-navy-300')
                            }
                        />
                    ))}
                </div>

                <Reveal className="mt-10 flex justify-end border-t border-line pt-7 lg:mt-12">
                    <Link href="/board-members" className={btn.outline}>
                        {copy.leadership_button || 'Board Members'}
                        <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                </Reveal>
            </div>

            <BoardMemberDialog member={selected} onClose={() => setSelected(null)} />
        </section>
    );
}
