import AdminLayout from '@/Layouts/AdminLayout';
import InvoicePanel from '@/Components/Admin/InvoicePanel';
import { MembershipApplication, PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { confirmAndDelete } from '@/utils/alerts';

export default function MembershipApplicationsIndex({ applications, filters }: PageProps<{ applications: MembershipApplication[]; filters: { status: string } }>) {
    return (
        <AdminLayout header={<div><p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Members</p><h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Membership applications</h1></div>}>
            <Head title="Admin — Membership applications" />
            <div className="mb-5 flex flex-wrap gap-2">{['', 'pending', 'approved', 'rejected'].map((status) => <button key={status || 'all'} onClick={() => router.get(route('admin.membership-applications.index'), status ? { status } : {}, { preserveState: true })} className={`border px-4 py-2 text-sm font-bold ${filters.status === status ? 'border-[#14234a] bg-[#14234a] text-white' : 'border-[#d7c8a9] bg-white text-[#14234a]'}`}>{status || 'All'}</button>)}</div>
            <div className="grid gap-4">{applications.map((application) => <ApplicationCard key={application.id} application={application} />)}{applications.length === 0 && <p className="text-[#667085]">No applications found.</p>}</div>
        </AdminLayout>
    );
}

function ApplicationCard({ application }: { application: MembershipApplication }) {
    const { data, setData, put, processing } = useForm({ status: application.status, admin_notes: application.admin_notes ?? '' });
    return <article className="border border-[#d7c8a9] bg-white p-6"><div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div><div className="flex flex-wrap gap-2"><span className="bg-[#f7f3ea] px-3 py-1 text-xs font-black uppercase text-[#cf2f3b]">{application.status}</span><span className="px-3 py-1 text-xs font-bold text-[#667085]">{new Date(application.created_at).toLocaleString()}</span></div><div className="mt-3 flex items-center gap-4">{application.logo_path && <img src={application.logo_path} alt={`${application.company_name} logo`} className="h-16 w-24 border border-[#eadfc8] bg-white object-contain p-2" />}<div><h2 className="text-xl font-bold text-[#14234a]">{application.company_name}</h2><p className="mt-1 text-[#667085]">{application.applicant_name} · {application.email} · {application.phone}</p></div></div><p className="mt-4 font-bold text-[#14234a]">Selected: {application.tier_name} — {application.tier_price ? `${application.tier_currency} ${Number(application.tier_price).toLocaleString()} / ${application.tier_billing_period}` : 'Free'}</p><ul className="mt-2 list-disc pl-5 text-sm text-[#667085]">{application.tier_benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
            {application.company_profile && <div className="mt-4"><p className="text-xs font-black uppercase tracking-[0.1em] text-[#14234a]">Company profile</p><p className="mt-1 whitespace-pre-line text-sm text-[#667085]">{application.company_profile}</p></div>}
            {application.notes && <p className="mt-4 text-sm text-[#667085]">Applicant notes: {application.notes}</p>}
            {(application.certificate_of_incorporation_path || application.business_license_path || application.tin_certificate_path) && (
                <div className="mt-4">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-[#14234a]">Uploaded documents</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {([['certificate_of_incorporation_path', 'Certificate of Incorporation'], ['business_license_path', 'Business Licence'], ['tin_certificate_path', 'TIN Certificate']] as const).map(([key, label]) => application[key] && (
                            <a key={key} href={application[key]!} target="_blank" rel="noreferrer" className="border border-[#d7c8a9] bg-[#f7f3ea] px-3 py-2 text-xs font-bold text-[#14234a] hover:bg-[#eadfc8]">{label} ↗</a>
                        ))}
                    </div>
                </div>
            )}
            {application.invoice && <div className="mt-4"><InvoicePanel invoice={application.invoice} /></div>}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); put(route('admin.membership-applications.update', application.uuid), { preserveScroll: true }); }} className="grid content-start gap-3"><label className="text-sm font-bold text-[#14234a]">Status<select value={data.status} onChange={(e) => setData('status', e.target.value as typeof data.status)} className="mt-2 w-full border-[#d7c8a9]"><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></label><label className="text-sm font-bold text-[#14234a]">Admin notes<textarea value={data.admin_notes} onChange={(e) => setData('admin_notes', e.target.value)} className="mt-2 min-h-24 w-full border-[#d7c8a9]" /></label><button disabled={processing} className="bg-[#14234a] px-4 py-3 text-sm font-bold text-white">Update application</button>
            <button
                type="button"
                onClick={() => confirmAndDelete(route('admin.membership-applications.destroy', application.uuid), `${application.company_name}'s application`)}
                className="border border-[#cf2f3b] px-4 py-3 text-sm font-bold text-[#cf2f3b]"
            >
                Delete application
            </button>
        </form>
    </div></article>;
}
