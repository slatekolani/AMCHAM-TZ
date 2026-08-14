import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { PageProps } from '@/types';
import Icon from '@/Components/Public/Icon';
import { NewsroomDesktopPanel, NewsroomMobileAccordion } from '@/Components/Public/NewsroomMegaMenu';

/* ------------------------------------------------------------------ */
/* Model                                                               */
/* ------------------------------------------------------------------ */

export type NavPreview = {
    image: string;
    eyebrow: string;
    title: string;
    meta?: string;
    href: string;
};

export type NavLink = {
    title: string;
    desc: string;
    href: string;
    preview: NavPreview;
    /** Optional small uppercase heading rendered above this link in the dropdown — groups
     *  related links (e.g. "Publications") without introducing a nested flyout menu. */
    section?: string;
};

export type NavFooterLink = {
    label: string;
    href: string;
};

export type NavGroup = {
    key: string;
    label: string;
    links: NavLink[];
    /** Shown in the preview pane when no link is hovered. Events/News groups feed this from the backend.
     *  Omitted for the bespoke Newsroom panel, which renders its own preview list instead. */
    feature?: NavPreview;
    /** "View all …" style links shown in a bar below the panel. */
    footer?: NavFooterLink[];
    matches: string[];
    align: 'left' | 'center' | 'right';
};

/** How many live items (events / articles) the nav lists before deferring to "View all". */
const NAV_MAX_ITEMS = 4;

function formatEventDate(value: string): string {
    return new Date(value).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function buildNavGroups(nav: PageProps['nav'], cms: Record<string, string> = {}): NavGroup[] {
    const t = (key: string, fallback: string) => cms[key]?.trim() || fallback;
    const events = nav?.events ?? [];
    const eventsTotal = nav?.eventsTotal ?? events.length;

    const aboutPreview: NavPreview = {
        image: t('about_hero_image', '/images/amcham-live/boards.jpg'),
        eyebrow: 'The Chamber',
        title: 'Advancing U.S.–Tanzania trade and investment',
        href: '/about-us',
    };

    const membershipPreview: NavPreview = {
        image: t('membership_hero_image', '/images/amcham-live/hero-minara.jpg'),
        eyebrow: 'Membership',
        title: 'Join a network of leading American and Tanzanian companies',
        href: '/membership',
    };

    const tradeLink: NavLink = {
        title: 'Trade',
        desc: 'Bilateral trade-in-goods and services figures between the U.S. and Tanzania',
        href: '/trade',
        preview: {
            image: t('trade_hero_image', '/images/amcham-live/tic-news.jpg'),
            eyebrow: 'Trade Data',
            title: 'U.S.–Tanzania trade at a glance',
            href: '/trade',
        },
    };

    const investmentLink: NavLink = {
        title: 'Investment',
        desc: 'Foreign direct investment flows and stock between the U.S. and Tanzania',
        href: '/investment',
        preview: {
            image: t('investment_hero_image', '/images/amcham-live/boards.jpg'),
            eyebrow: 'Investment Data',
            title: 'U.S.–Tanzania investment at a glance',
            href: '/investment',
        },
    };

    const eventsFallbackPreview: NavPreview = {
        image: t('events_hero_image', '/images/amcham-live/thanksgiving.png'),
        eyebrow: 'Events',
        title: 'Flagship dinners, roundtables and briefings',
        href: '/events',
    };

    // Live events from the backend become the dropdown list; the rest are reached via "View all".
    const eventLinks: NavLink[] = events.length
        ? events.slice(0, NAV_MAX_ITEMS).map((event) => {
              const meta = [formatEventDate(event.starts_at), event.location].filter(Boolean).join(' · ');
              const href = route('events.show', event.slug);
              return {
                  title: event.title,
                  desc: meta,
                  href,
                  preview: {
                      image: event.cover_image_path ?? t('events_fallback_image', t('events_hero_image', '/images/amcham-live/thanksgiving.png')),
                      eyebrow: event.category ?? 'Upcoming Event',
                      title: event.title,
                      meta,
                      href,
                  },
              };
          })
        : [
              {
                  title: 'Upcoming Events',
                  desc: 'Dinners, roundtables and briefings across the year',
                  href: '/events',
                  preview: eventsFallbackPreview,
              },
              {
                  title: 'Members-Only Gatherings',
                  desc: 'Exclusive access for member companies and their teams',
                  href: '/events',
                  preview: {
                      image: t('events_hero_image', '/images/amcham-live/thanksgiving.png'),
                      eyebrow: 'Members Only',
                      title: 'Appreciation days, briefings and executive evenings',
                      href: '/events',
                  },
              },
          ];

    const eventsShown = Math.min(events.length, NAV_MAX_ITEMS);

    const ourWorkItems = nav?.ourWorkItems ?? [];
    const ourWorkFallbackPreview: NavPreview = {
        image: t('our_work_hero_image', '/images/amcham-live/boards.jpg'),
        eyebrow: 'Our Work',
        title: 'How the chamber advances U.S.–Tanzania business',
        href: '/our-work',
    };
    const ourWorkLinks: NavLink[] = ourWorkItems.length
        ? ourWorkItems.map((item) => {
              const href = route('our-work.show', item.slug);
              return {
                  title: item.title,
                  desc: item.summary ?? '',
                  href,
                  preview: {
                      image: item.cover_image_path ?? t('our_work_hero_image', '/images/amcham-live/boards.jpg'),
                      eyebrow: 'Our Work',
                      title: item.title,
                      href,
                  },
              };
          })
        : [
              {
                  title: 'Our Work',
                  desc: 'How the chamber advances U.S.–Tanzania business',
                  href: '/our-work',
                  preview: ourWorkFallbackPreview,
              },
          ];

    const workingGroupsItems = nav?.workingGroups ?? [];
    const workingGroupsFallbackPreview: NavPreview = {
        image: t('working_groups_hero_image', '/images/amcham-live/boards.jpg'),
        eyebrow: 'Working Groups',
        title: 'Sector-based member committees driving chamber priorities',
        href: '/working-groups',
    };
    const workingGroupsLinks: NavLink[] = workingGroupsItems.length
        ? workingGroupsItems.map((item) => {
              const href = route('working-groups.show', item.slug);
              return {
                  title: item.title,
                  desc: item.summary ?? '',
                  href,
                  preview: {
                      image: item.cover_image_path ?? t('working_groups_hero_image', '/images/amcham-live/boards.jpg'),
                      eyebrow: 'Working Groups',
                      title: item.title,
                      href,
                  },
              };
          })
        : [
              {
                  title: 'Working Groups',
                  desc: 'Sector-based member committees driving chamber priorities',
                  href: '/working-groups',
                  preview: workingGroupsFallbackPreview,
              },
          ];
    return [
        {
            key: 'about',
            label: t('nav_about', 'About'),
            align: 'left',
            matches: ['/about-us', '/board-members', '/contact-us'],
            feature: aboutPreview,
            links: [
                {
                    title: 'About Us',
                    desc: 'Who we are, our mission and the values that guide the chamber',
                    href: '/about-us',
                    preview: aboutPreview,
                },
                {
                    title: 'Board Members',
                    desc: 'Meet the business leaders guiding the chamber’s strategy and governance',
                    href: '/board-members',
                    preview: {
                        image: t('board_hero_image', '/images/amcham-live/boards.jpg'),
                        eyebrow: 'Leadership',
                        title: 'Meet the AMCHAM Tanzania Board Members',
                        href: '/board-members',
                    },
                },
                {
                    title: 'Contact Us',
                    desc: 'Reach the Secretariat for enquiries, support and partnership',
                    href: '/contact-us',
                    preview: {
                        image: t('contact_hero_image', '/images/amcham-live/hero-minara.jpg'),
                        eyebrow: 'Contact',
                        title: 'Talk to the Secretariat in Dar es Salaam',
                        href: '/contact-us',
                    },
                },
            ],
        },
        {
            key: 'work',
            label: t('nav_our_work', 'Our Work'),
            align: 'left',
            matches: ['/our-work'],
            feature: ourWorkLinks[0]?.preview ?? ourWorkFallbackPreview,
            links: ourWorkLinks,
        },
        {
            key: 'data',
            label: t('nav_data', 'Data'),
            align: 'left',
            matches: ['/trade', '/investment'],
            feature: tradeLink.preview,
            links: [tradeLink, investmentLink],
        },
        {
            key: 'membership',
            label: t('nav_membership', 'Membership'),
            align: 'center',
            matches: ['/membership', '/members'],
            feature: membershipPreview,
            links: [
                {
                    title: 'Membership Overview',
                    desc: 'Tiers, benefits and pricing for every kind of organisation',
                    href: '/membership',
                    preview: membershipPreview,
                },
                {
                    title: 'Member Directory',
                    desc: 'The companies shaping U.S.–Tanzania business',
                    href: '/members',
                    preview: {
                        image: t('members_hero_image', '/images/amcham-live/hero-minara.jpg'),
                        eyebrow: 'Directory',
                        title: 'American and Tanzanian companies across 12+ sectors',
                        href: '/members',
                    },
                },
                {
                    title: 'Join AmCham TZ',
                    desc: 'Start your membership application today',
                    href: '/membership',
                    preview: {
                        image: t('membership_hero_image', '/images/amcham-live/hero-minara.jpg'),
                        eyebrow: 'Become a Member',
                        title: 'Your seat at the table starts here',
                        href: '/membership',
                    },
                },
            ],
            footer: [{ label: 'Compare all membership tiers', href: '/membership' }],
        },
        {
            key: 'events',
            label: t('nav_events', 'Events'),
            align: 'center',
            matches: ['/events'],
            feature: eventLinks[0]?.preview ?? eventsFallbackPreview,
            links: eventLinks,
            footer: [
                {
                    label: eventsTotal > eventsShown ? `View all ${eventsTotal} events` : 'View all events',
                    href: '/events',
                },
            ],
        },
        {
            key: 'press',
            label: t('nav_news', 'Newsroom'),
            align: 'right',
            matches: ['/news', '/resources', '/newsletters', '/policy-updates'],
            // Rendered by the bespoke NewsroomDesktopPanel/NewsroomMobileAccordion instead of the
            // generic links + single-preview layout every other group uses — see DesktopNav/MobileNavGroups.
            links: [],
        },
        {
            key: 'workingGroups',
            label: t('nav_working_groups', 'Working Groups'),
            align: 'right',
            matches: ['/working-groups'],
            feature: workingGroupsLinks[0]?.preview ?? workingGroupsFallbackPreview,
            links: workingGroupsLinks,
        },
    ];
}

/* ------------------------------------------------------------------ */
/* Desktop mega nav                                                    */
/* ------------------------------------------------------------------ */

const alignClasses: Record<NavGroup['align'], string> = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0',
};

function PreviewPane({ preview, onNavigate }: { preview: NavPreview; onNavigate: () => void }) {
    return (
        <Link
            href={preview.href}
            onClick={onNavigate}
            className="group/preview relative flex h-full min-h-[16.5rem] flex-col justify-end overflow-hidden rounded-xl bg-navy-900"
        >
            <img
                key={preview.image}
                src={preview.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 animate-fade-in group-hover/preview:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
            <div className="relative p-5">
                <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-caps text-gold">
                    <span className="h-px w-5 bg-current" />
                    {preview.eyebrow}
                </p>
                <p className="mt-2 line-clamp-2 text-[15px] font-bold leading-snug text-white">{preview.title}</p>
                {preview.meta && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-white/70">
                        <Icon name="calendar" className="h-3.5 w-3.5 text-gold" />
                        {preview.meta}
                    </p>
                )}
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90">
                    View
                    <Icon name="arrow" className="h-3.5 w-3.5 transition-transform duration-200 group-hover/preview:translate-x-0.5" />
                </p>
            </div>
        </Link>
    );
}

export function DesktopNav({ className = '' }: { className?: string }) {
    const { url, props } = usePage<PageProps>();
    const groups = buildNavGroups(props.nav, props.cms);

    const [openKey, setOpenKey] = useState<string | null>(null);
    const [hovered, setHovered] = useState<NavPreview | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancelClose = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = null;
    };

    const open = (key: string) => {
        cancelClose();
        setOpenKey((current) => {
            if (current !== key) setHovered(null);
            return key;
        });
    };

    const scheduleClose = () => {
        cancelClose();
        closeTimer.current = setTimeout(() => {
            setOpenKey(null);
            setHovered(null);
        }, 160);
    };

    const closeNow = () => {
        cancelClose();
        setOpenKey(null);
        setHovered(null);
    };

    // Close when the route changes and on Escape.
    useEffect(() => closeNow(), [url]);
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeNow();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <nav className={'flex items-center gap-1.5 2xl:gap-2.5 ' + className} aria-label="Primary">
            {groups.map((group) => {
                const active = group.matches.some((prefix) => url.startsWith(prefix));
                const isOpen = openKey === group.key;

                return (
                    <div key={group.key} className="relative" onMouseEnter={() => open(group.key)} onMouseLeave={scheduleClose}>
                        <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-haspopup="true"
                            onClick={() => (isOpen ? closeNow() : open(group.key))}
                            onFocus={() => open(group.key)}
                            className={
                                'group relative flex items-center gap-1.5 whitespace-nowrap rounded-md px-3.5 py-2.5 text-sm font-semibold transition 2xl:px-4.5 ' +
                                (active || isOpen ? 'text-navy-800' : 'text-ink-muted hover:text-navy-800')
                            }
                        >
                            {group.label}
                            <Icon
                                name="chevron-down"
                                className={'h-3.5 w-3.5 transition-transform duration-200 ' + (isOpen ? 'rotate-180 text-crimson' : 'text-ink-faint')}
                            />
                            <span
                                className={
                                    'absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-crimson transition-transform duration-300 ' +
                                    (active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')
                                }
                            />
                        </button>

                        {isOpen && (
                            <div
                                className={'absolute top-full z-50 pt-3 ' + alignClasses[group.align]}
                                onMouseEnter={cancelClose}
                                onMouseLeave={scheduleClose}
                            >
                                {group.key === 'press' ? (
                                    <NewsroomDesktopPanel nav={props.nav} cms={props.cms} onNavigate={closeNow} />
                                ) : (
                                <div className="w-[44rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-white shadow-card-lg animate-fade-up [animation-duration:350ms]">
                                    <span className="block h-1 brand-rule" />
                                    <div className="grid grid-cols-[0.92fr_1.08fr] gap-6 p-5">
                                        <div className="flex flex-col gap-0.5">
                                            {group.links.map((link, index) => (
                                                <div key={link.title + link.href}>
                                                {link.section && link.section !== group.links[index - 1]?.section && (
                                                    <p className={'px-3 pb-1 text-[11px] font-bold uppercase tracking-caps text-ink-faint ' + (index > 0 ? 'pt-3' : '')}>
                                                        {link.section}
                                                    </p>
                                                )}
                                                <Link
                                                    href={link.href}
                                                    onClick={closeNow}
                                                    onMouseEnter={() => setHovered(link.preview)}
                                                    onFocus={() => setHovered(link.preview)}
                                                    className="group/link block rounded-xl p-3 transition duration-200 hover:bg-mist"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <span className="line-clamp-2 text-[15px] font-bold leading-snug text-navy-800">{link.title}</span>
                                                        <Icon
                                                            name="arrow"
                                                            className="mt-1 h-4 w-4 shrink-0 -translate-x-1 text-crimson opacity-0 transition duration-200 group-hover/link:translate-x-0 group-hover/link:opacity-100"
                                                        />
                                                    </div>
                                                    <p className="mt-0.5 line-clamp-1 text-[13px] leading-5 text-ink-faint">{link.desc}</p>
                                                </Link>
                                                </div>
                                            ))}
                                        </div>
                                        {group.feature && <PreviewPane preview={hovered ?? group.feature} onNavigate={closeNow} />}
                                    </div>
                                    {group.footer && (
                                        <div className="flex items-center justify-between gap-4 border-t border-line bg-mist/60 px-5 py-3">
                                            {group.footer.length === 1 && <span aria-hidden="true" />}
                                            {group.footer.map((item) => (
                                                <Link
                                                    key={item.href + item.label}
                                                    href={item.href}
                                                    onClick={closeNow}
                                                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy-800 transition hover:text-crimson"
                                                >
                                                    {item.label}
                                                    <Icon name="arrow" className="h-3.5 w-3.5" />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

/* ------------------------------------------------------------------ */
/* Mobile accordion nav                                                */
/* ------------------------------------------------------------------ */

export function MobileNavGroups({ onNavigate }: { onNavigate: () => void }) {
    const { url, props } = usePage<PageProps>();
    const groups = buildNavGroups(props.nav, props.cms);
    const [openKey, setOpenKey] = useState<string | null>(groups.find((g) => g.matches.some((m) => url.startsWith(m)))?.key ?? null);

    return (
        <div className="grid gap-2">
            {groups.map((group) => {
                const active = group.matches.some((prefix) => url.startsWith(prefix));
                const isOpen = openKey === group.key;

                return (
                    <div key={group.key} className={'overflow-hidden rounded-xl border transition ' + (isOpen ? 'border-navy-200 bg-mist' : 'border-line')}>
                        <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => setOpenKey(isOpen ? null : group.key)}
                            className={
                                'flex w-full items-center justify-between px-4 py-3.5 text-[15px] font-semibold transition ' +
                                (active || isOpen ? 'text-navy-800' : 'text-ink-muted')
                            }
                        >
                            {group.label}
                            <Icon
                                name="chevron-down"
                                className={'h-4 w-4 transition-transform duration-200 ' + (isOpen ? 'rotate-180 text-crimson' : 'text-ink-faint')}
                            />
                        </button>
                        {isOpen && group.key === 'press' && (
                            <NewsroomMobileAccordion nav={props.nav} cms={props.cms} onNavigate={onNavigate} />
                        )}
                        {isOpen && group.key !== 'press' && (
                            <div className="grid gap-1 px-2 pb-2">
                                {group.links.map((link, index) => (
                                    <div key={link.title + link.href}>
                                    {link.section && link.section !== group.links[index - 1]?.section && (
                                        <p className={'px-3 pb-1 text-[11px] font-bold uppercase tracking-caps text-ink-faint ' + (index > 0 ? 'pt-2' : '')}>
                                            {link.section}
                                        </p>
                                    )}
                                    <Link
                                        href={link.href}
                                        onClick={onNavigate}
                                        className="flex min-w-0 items-center gap-3.5 overflow-hidden rounded-lg bg-white px-3 py-3 transition hover:bg-navy-50"
                                    >
                                        <img src={link.preview.image} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-bold text-navy-800">{link.title}</span>
                                            <span className="mt-0.5 block truncate text-xs text-ink-faint">{link.desc}</span>
                                        </span>
                                    </Link>
                                    </div>
                                ))}
                                {group.footer?.map((item) => (
                                    <Link
                                        key={item.href + item.label}
                                        href={item.href}
                                        onClick={onNavigate}
                                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-crimson transition hover:bg-navy-50"
                                    >
                                        {item.label}
                                        <Icon name="arrow" className="h-4 w-4" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
