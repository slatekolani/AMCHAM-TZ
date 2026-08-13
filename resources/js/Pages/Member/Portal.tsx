import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Company, PageProps } from '@/types';
import { notifyPlatinumOnly } from '@/utils/alerts';

type PortalProps = PageProps<{
    company: Company | null;
    stats: {
        newsDraft: number;
        newsPending: number;
        newsPublished: number;
        eventsPending: number;
        eventsPublished: number;
    };
}>;

export default function MemberPortal({ company, stats }: PortalProps) {
    const { props } = usePage<PageProps>();
    const canPublish = props.auth.canPublish;
    const gatedTileClass = 'block w-full border border-dashed border-[#d7c8a9] bg-white p-6 text-left opacity-70 transition hover:border-[#14234a] hover:opacity-100';

    return (
        <MemberLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Member portal</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Company workspace</h1>
                </div>
            }
        >
            <Head title="Member Company Portal" />

            {!company && (
                <div className="border border-[#cf2f3b] bg-[#fdeeee] p-6 text-[#cf2f3b]">
                    Your account is not yet linked to a member company. Contact the AMCHAM Secretariat to complete setup.
                </div>
            )}

            {company && company.status !== 'approved' && company.latest_invoice && company.latest_invoice.status !== 'paid' && (
                <div className="mb-6 border border-[#f0d99a] bg-[#fdf7e8] p-6">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#a5760a]">Payment pending</p>
                    <p className="mt-2 leading-7 text-[#5c4b1e]">
                        Your membership application was approved. To activate your public profile and unlock full member benefits, please settle
                        invoice <strong>#{company.latest_invoice.invoice_number}</strong> — {company.latest_invoice.currency}{' '}
                        {Number(company.latest_invoice.amount).toLocaleString()}
                        {company.latest_invoice.due_date && <> (due {new Date(company.latest_invoice.due_date).toLocaleDateString()})</>}.{' '}
                        {company.latest_invoice.sent_at
                            ? 'We emailed the invoice with full payment and bank details to your registered email address.'
                            : 'The AMCHAM finance team is preparing your invoice and will email it to your registered address shortly.'}
                    </p>
                </div>
            )}

            {company && (
                <section className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
                    <aside className="border border-[#d7c8a9] bg-white p-7">
                        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1e7c89]">Current company</p>
                        <h2 className="mt-4 text-3xl font-bold text-[#14234a]">{company.name}</h2>
                        <p className="mt-4 leading-7 text-[#667085]">
                            {company.membership_tier?.name ?? 'No tier'} member · {company.sector ?? 'Sector not set'} ·{' '}
                            {company.status === 'approved' ? 'Public profile active' : 'Pending approval'}
                        </p>
                        <div className="mt-7 grid grid-cols-3 gap-px bg-[#d7c8a9]">
                            {[
                                [company.membership_tier?.name ?? '—', 'Tier'],
                                [stats.newsDraft + stats.newsPending, 'News in progress'],
                                [stats.eventsPending, 'Events pending'],
                            ].map(([value, label]) => (
                                <div key={label} className="bg-[#fbf8f0] p-4">
                                    <p className="text-2xl font-black text-[#14234a]">{value}</p>
                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#667085]">{label}</p>
                                </div>
                            ))}
                        </div>
                        <Link href={route('member.profile.edit')} className="mt-6 inline-flex border border-[#14234a] px-5 py-3 text-sm font-bold text-[#14234a]">
                            Edit company profile
                        </Link>
                    </aside>

                    <div className="grid gap-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <article className="border border-[#eadfc8] bg-[#fbf8f0] p-5">
                                <p className="text-3xl font-black text-[#14234a]">{stats.newsPublished}</p>
                                <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-[#667085]">News published</p>
                            </article>
                            <article className="border border-[#eadfc8] bg-[#fbf8f0] p-5">
                                <p className="text-3xl font-black text-[#14234a]">{stats.eventsPublished}</p>
                                <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-[#667085]">Events published</p>
                            </article>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Link href={route('member.member-events.index')} className="border border-[#d7c8a9] bg-white p-6 transition hover:border-[#14234a]">
                                <h3 className="text-xl font-bold text-[#14234a]">Members Events</h3>
                                <p className="mt-3 leading-6 text-[#667085]">Browse public and members-only AMCHAM events you can attend.</p>
                            </Link>
                            {canPublish ? (
                                <Link href={route('member.news.index')} className="border border-[#d7c8a9] bg-white p-6 transition hover:border-[#14234a]">
                                    <h3 className="text-xl font-bold text-[#14234a]">News submissions</h3>
                                    <p className="mt-3 leading-6 text-[#667085]">Draft articles and submit them for AMCHAM review.</p>
                                </Link>
                            ) : (
                                <button type="button" onClick={notifyPlatinumOnly} className={gatedTileClass}>
                                    <h3 className="text-xl font-bold text-[#14234a]">News submissions</h3>
                                    <p className="mt-3 leading-6 text-[#667085]">Draft articles and submit them for AMCHAM review.</p>
                                </button>
                            )}
                            {canPublish ? (
                                <Link href={route('member.events.index')} className="border border-[#d7c8a9] bg-white p-6 transition hover:border-[#14234a]">
                                    <h3 className="text-xl font-bold text-[#14234a]">Event submissions</h3>
                                    <p className="mt-3 leading-6 text-[#667085]">Propose events for the public AMCHAM calendar.</p>
                                </Link>
                            ) : (
                                <button type="button" onClick={notifyPlatinumOnly} className={gatedTileClass}>
                                    <h3 className="text-xl font-bold text-[#14234a]">Event submissions</h3>
                                    <p className="mt-3 leading-6 text-[#667085]">Propose events for the public AMCHAM calendar.</p>
                                </button>
                            )}
                            <Link href={route('member.profile.edit')} className="border border-[#d7c8a9] bg-white p-6 transition hover:border-[#14234a]">
                                <h3 className="text-xl font-bold text-[#14234a]">Company profile</h3>
                                <p className="mt-3 leading-6 text-[#667085]">Update your public directory listing details.</p>
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </MemberLayout>
    );
}
