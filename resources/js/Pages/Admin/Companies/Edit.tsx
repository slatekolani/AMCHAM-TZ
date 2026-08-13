import AdminLayout from '@/Layouts/AdminLayout';
import InvoicePanel from '@/Components/Admin/InvoicePanel';
import { Head, useForm } from '@inertiajs/react';
import { Company, MembershipTier, PageProps } from '@/types';
import { FormEvent } from 'react';
import CoverImageUpload from '@/Components/CoverImageUpload';

type CompaniesEditProps = PageProps<{ company: Company; membershipTiers: MembershipTier[] }>;

export default function CompaniesEdit({ company, membershipTiers }: CompaniesEditProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: company.name,
        membership_tier_id: company.membership_tier_id ?? '',
        sector: company.sector ?? '',
        description: company.description ?? '',
        website: company.website ?? '',
        phone: company.phone ?? '',
        email: company.email ?? '',
        address: company.address ?? '',
        cover_image: null as File | null,
        logo: null as File | null,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.companies.update', company.uuid), { forceFormData: true });
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Members</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Edit — {company.name}</h1>
                </div>
            }
        >
            <Head title={`Admin — ${company.name}`} />

            <form onSubmit={submit} className="grid max-w-2xl gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                    <CoverImageUpload label="Company logo" currentImage={company.logo_path} error={errors.logo} onChange={(file) => setData('logo', file)} />
                    <CoverImageUpload label="Company services cover image" currentImage={company.cover_image_path} error={errors.cover_image} onChange={(file) => setData('cover_image', file)} />
                </div>
                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Company name
                    <input value={data.name} onChange={(event) => setData('name', event.target.value)} className="border-[#d7c8a9]" />
                    {errors.name && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.name}</span>}
                </label>

                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Membership tier
                    <select
                        value={data.membership_tier_id}
                        onChange={(event) => setData('membership_tier_id', event.target.value)}
                        className="border-[#d7c8a9]"
                    >
                        <option value="">No tier</option>
                        {membershipTiers.map((tier) => (
                            <option key={tier.id} value={tier.id}>{tier.name}</option>
                        ))}
                    </select>
                </label>

                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Sector
                    <input value={data.sector} onChange={(event) => setData('sector', event.target.value)} className="border-[#d7c8a9]" />
                </label>

                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Description
                    <textarea value={data.description} onChange={(event) => setData('description', event.target.value)} className="min-h-32 border-[#d7c8a9]" />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Website
                        <input value={data.website} onChange={(event) => setData('website', event.target.value)} className="border-[#d7c8a9]" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Phone
                        <input value={data.phone} onChange={(event) => setData('phone', event.target.value)} className="border-[#d7c8a9]" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Email
                        <input value={data.email} onChange={(event) => setData('email', event.target.value)} className="border-[#d7c8a9]" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Address
                        <input value={data.address} onChange={(event) => setData('address', event.target.value)} className="border-[#d7c8a9]" />
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-fit bg-[#14234a] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60"
                >
                    Save company
                </button>
            </form>

            {company.latest_invoice && (
                <div className="mt-10 max-w-2xl">
                    <h2 className="text-lg font-bold text-[#14234a]">Membership invoice</h2>
                    <div className="mt-3">
                        <InvoicePanel invoice={company.latest_invoice} />
                    </div>
                </div>
            )}

            {company.documents && company.documents.length > 0 && (
                <div className="mt-10 max-w-2xl">
                    <h2 className="text-lg font-bold text-[#14234a]">Company documents</h2>
                    <div className="mt-3 grid gap-2">
                        {company.documents.map((document) => (
                            <a
                                key={document.id}
                                href={`/storage/${document.file_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between border border-[#eadfc8] bg-white px-4 py-3 text-sm font-bold text-[#14234a] hover:bg-[#fbf8f0]"
                            >
                                {document.title}
                                <span className="text-xs font-black uppercase tracking-[0.1em] text-[#cf2f3b]">Preview ↗</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
