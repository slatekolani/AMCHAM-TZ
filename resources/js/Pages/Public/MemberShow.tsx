import Icon from '@/Components/Public/Icon';
import Reveal from '@/Components/Public/Reveal';
import { btn, card, cardStatic, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { Company, PageProps } from '@/types';
import { renderEventDescription } from '@/utils/event';

/** Only the columns the controller actually selects. */
type MemberNews = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string | null;
    published_at: string | null;
    cover_image_path: string | null;
    reading_time: number;
};

type MemberEvent = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    location: string | null;
    starts_at: string;
    created_at: string;
    published_at: string | null;
    cover_image_path: string | null;
    category: string | null;
};

type MemberShowProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    member: Company;
    news: MemberNews[];
    events: MemberEvent[];
}>;

function stripHtml(html: string | null): string {
    return (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatDate(value: string | null): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/** Strips protocol so the link reads as a domain rather than a URL. */
function prettyDomain(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export default function MemberShow({ canLogin, canRegister, member, news, events }: MemberShowProps) {
    const details: { icon: 'globe' | 'mail' | 'phone' | 'pin'; label: string; value: string; href?: string }[] = [];

    if (member.website) {
        details.push({ icon: 'globe', label: 'Website', value: prettyDomain(member.website), href: member.website });
    }
    if (member.email) {
        details.push({ icon: 'mail', label: 'Email', value: member.email, href: `mailto:${member.email}` });
    }
    if (member.phone) {
        details.push({ icon: 'phone', label: 'Telephone', value: member.phone, href: `tel:${member.phone}` });
    }
    if (member.address) {
        details.push({ icon: 'pin', label: 'Address', value: member.address });
    }

    return (
        <PublicLayout canLogin={canLogin} canRegister={canRegister} seo={{ image: member.cover_image_path ?? member.logo_path ?? undefined }}>
            <Head title={`${member.name} | AMCHAM Tanzania Member`} />

            {/* ── Company header ── */}
            <section className="relative overflow-hidden bg-navy-950 text-white">
                {member.cover_image_path && <img src={member.cover_image_path} alt="" className="absolute inset-0 h-full w-full object-cover" />}
                <div className={'absolute inset-0 ' + (member.cover_image_path ? 'bg-[linear-gradient(100deg,rgba(6,13,29,0.96)_0%,rgba(6,13,29,0.82)_48%,rgba(6,13,29,0.34)_100%)]' : 'bg-[radial-gradient(circle_at_82%_30%,rgba(59,94,151,0.28),transparent_35%)]')} />
                <div className="absolute inset-x-0 bottom-0 h-1 brand-rule" />
                <div className={`${shell} relative px-5 py-20 sm:px-8 lg:py-28`}>
                    <nav aria-label="Breadcrumb" className="mb-8">
                        <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/50">
                            <li><Link href="/" className="transition hover:text-white">Home</Link></li>
                            <li aria-hidden="true">/</li>
                            <li><Link href="/members" className="transition hover:text-white">Members</Link></li>
                            <li aria-hidden="true">/</li>
                            <li className="text-white/80">{member.name}</li>
                        </ol>
                    </nav>

                    <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
                        <div className="grid h-28 w-28 shrink-0 place-items-center rounded-2xl bg-white p-4">
                            {member.logo_path ? (
                                <img src={member.logo_path} alt={member.name} className="max-h-full max-w-full object-contain" />
                            ) : (
                                <span className="font-display text-4xl font-semibold text-navy-800">{member.name.charAt(0)}</span>
                            )}
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5">
                                {member.sector && (
                                    <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80 ring-1 ring-inset ring-white/15">
                                        {member.sector}
                                    </span>
                                )}
                                {member.membership_tier && (
                                    <span className="inline-flex rounded-full bg-gold/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold ring-1 ring-inset ring-gold/40">
                                        {member.membership_tier.name} member
                                    </span>
                                )}
                            </div>
                            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
                                {member.name}
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className={sectionPad}>
                <div className={`${shell} grid gap-10 lg:grid-cols-[1fr_21rem] lg:gap-14`}>
                    <div className="min-w-0">
                        {/* ── About ── */}
                        <Reveal>
                            <h2 className="font-display text-2xl font-semibold text-navy-800">About {member.name}</h2>
                            <p className="mt-5 whitespace-pre-line text-lg leading-8 text-ink-muted">
                                {member.description ||
                                    `${member.name} is an approved member of the American Chamber of Commerce in Tanzania.`}
                            </p>
                        </Reveal>

                        {/* ── Their publications ── */}
                        {news.length > 0 && (
                            <Reveal className="mt-16">
                                <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
                                    <h2 className="font-display text-2xl font-semibold text-navy-800">Publications</h2>
                                    <span className="text-sm font-medium text-ink-faint">{news.length}</span>
                                </div>
                                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                                    {news.map((article) => (
                                        <Link
                                            key={article.id}
                                            href={route('news.show', article.slug)}
                                            className={`${card} group flex flex-col overflow-hidden`}
                                        >
                                            <div className="h-40 overflow-hidden bg-navy-100">
                                                <img
                                                    src={article.cover_image_path ?? '/images/amcham-live/tic-news.jpg'}
                                                    alt=""
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col p-5">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                                                    {article.category && <span className="text-crimson">{article.category} · </span>}
                                                    {formatDate(article.published_at)}
                                                </p>
                                                <h3 className="mt-2 font-bold leading-snug text-navy-800 transition group-hover:text-crimson">
                                                    {article.title}
                                                </h3>
                                                {article.excerpt && (
                                                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-ink-muted">{article.excerpt}</p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </Reveal>
                        )}

                        {/* ── Their events ── */}
                        {events.length > 0 && (
                            <Reveal className="mt-16">
                                <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
                                    <h2 className="font-display text-2xl font-semibold text-navy-800">Events</h2>
                                    <span className="text-sm font-medium text-ink-faint">{events.length}</span>
                                </div>
                                <div className="mt-7 grid gap-4">
                                    {events.map((event) => (
                                        <Link
                                            key={event.id}
                                            href={route('events.show', event.slug)}
                                            className={`${card} group flex gap-5 p-5`}
                                        >
                                            <div className="hidden h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-navy-100 sm:block">
                                                <img
                                                    src={event.cover_image_path ?? '/images/amcham-live/boards.jpg'}
                                                    alt=""
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                {event.category && (
                                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-crimson">{event.category}</p>
                                                )}
                                                <h3 className="mt-1.5 font-bold leading-snug text-navy-800 transition group-hover:text-crimson">
                                                    {event.title}
                                                </h3>
                                                <p className="mt-2 line-clamp-1 text-sm leading-6 text-ink-muted">{stripHtml(renderEventDescription(event))}</p>
                                                <p className="mt-2.5 text-xs font-medium text-ink-faint">Published on {formatDate(event.published_at ?? event.created_at)}</p>
                                                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-ink-faint">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Icon name="calendar" className="h-3.5 w-3.5" />
                                                        Event date and time: {new Date(event.starts_at).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Africa/Dar_es_Salaam' })} EAT
                                                    </span>
                                                    {event.location && (
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Icon name="pin" className="h-3.5 w-3.5" />
                                                            {event.location}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </Reveal>
                        )}

                        {news.length === 0 && events.length === 0 && (
                            <Reveal className="mt-14 rounded-2xl border border-dashed border-navy-200 bg-navy-50 p-8 text-center">
                                <p className="leading-7 text-ink-muted">
                                    {member.name} has not published news or events through the chamber yet.
                                </p>
                            </Reveal>
                        )}
                    </div>

                    {/* ── Details sidebar ── */}
                    <Reveal delay={120}>
                        <aside className="lg:sticky lg:top-32">
                            <div className={`${cardStatic} overflow-hidden`}>
                                <div className="border-b border-line bg-navy-950 px-6 py-5">
                                    <p className="text-xs font-semibold uppercase tracking-caps text-white/60">Company details</p>
                                </div>
                                <div className="grid gap-5 p-6">
                                    {details.length === 0 && (
                                        <p className="text-sm leading-6 text-ink-faint">
                                            Contact details are not published for this member.
                                        </p>
                                    )}
                                    {details.map((detail) => (
                                        <div key={detail.label} className="flex items-start gap-3.5">
                                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-800">
                                                <Icon name={detail.icon} className="h-4 w-4" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{detail.label}</p>
                                                {detail.href ? (
                                                    <a
                                                        href={detail.href}
                                                        target={detail.href.startsWith('http') ? '_blank' : undefined}
                                                        rel="noreferrer"
                                                        className="mt-1 block break-words text-sm font-semibold text-navy-800 transition hover:text-crimson"
                                                    >
                                                        {detail.value}
                                                    </a>
                                                ) : (
                                                    <p className="mt-1 break-words text-sm font-semibold text-navy-800">{detail.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link href="/members" className={`${btn.outline} mt-5 w-full`}>
                                <Icon name="arrow" className="h-4 w-4 rotate-180" />
                                Back to directory
                            </Link>
                        </aside>
                    </Reveal>
                </div>
            </section>
        </PublicLayout>
    );
}
