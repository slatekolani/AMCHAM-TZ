import MemberLayout from '@/Layouts/MemberLayout';
import { Head, useForm } from '@inertiajs/react';
import { Company, PageProps } from '@/types';
import { FormEvent, useState } from 'react';

type ProfileEditProps = PageProps<{ company: Company | null }>;

export default function ProfileEdit({ company }: ProfileEditProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        sector: company?.sector ?? '',
        description: company?.description ?? '',
        website: company?.website ?? '',
        phone: company?.phone ?? '',
        email: company?.email ?? '',
        address: company?.address ?? '',
        logo: null as File | null,
        cover_image: null as File | null,
    });
    const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo_path ?? null);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('member.profile.update'), { forceFormData: true });
    };

    if (!company) {
        return (
            <MemberLayout header={<h1 className="text-3xl font-display font-semibold text-[#14234a]">Company profile</h1>}>
                <Head title="Member — Company profile" />
                <p className="text-[#667085]">Your account is not linked to a member company yet.</p>
            </MemberLayout>
        );
    }

    return (
        <MemberLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Member portal</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">{company.name}</h1>
                </div>
            }
        >
            <Head title="Member — Company profile" />

            <p className="mb-6 max-w-2xl text-sm text-[#667085]">
                Company name and membership tier are managed by the AMCHAM Secretariat. You can update the rest of your public
                directory listing below.
            </p>

            <form onSubmit={submit} className="grid max-w-2xl gap-5">
                <label className="grid gap-3 text-sm font-bold text-[#14234a]">
                    Services cover image
                    <span className="text-xs font-normal leading-5 text-[#667085]">Showcase your services, facilities or team. This wide image appears in the hero of your public company page.</span>
                    {company.cover_image_path && <img src={company.cover_image_path} alt={`${company.name} services cover`} className="aspect-[16/7] w-full rounded-xl border border-[#d7c8a9] bg-white object-cover" />}
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setData('cover_image', event.target.files?.[0] ?? null)} className="border border-[#d7c8a9] bg-white p-3 file:mr-4 file:border-0 file:bg-[#f4efe5] file:px-4 file:py-2 file:font-bold file:text-[#14234a]" />
                    <span className="text-xs font-normal text-[#667085]">Recommended ratio 16:7. JPG, PNG or WebP, up to 8 MB.</span>
                    {errors.cover_image && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.cover_image}</span>}
                </label>
                <label className="grid gap-3 text-sm font-bold text-[#14234a]">
                    Company logo
                    {logoPreview && <img src={logoPreview} alt={`${company.name} logo preview`} className="h-28 w-44 border border-[#d7c8a9] bg-white object-contain p-3" />}
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0] ?? null; setData('logo', file); if (file) setLogoPreview(URL.createObjectURL(file)); }} className="border border-[#d7c8a9] bg-white p-3 file:mr-4 file:border-0 file:bg-[#f4efe5] file:px-4 file:py-2 file:font-bold file:text-[#14234a]" />
                    <span className="text-xs font-normal text-[#667085]">JPG, PNG or WebP. Maximum file size: 5 MB.</span>
                    {errors.logo && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.logo}</span>}
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
                        {errors.email && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.email}</span>}
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
                    Save profile
                </button>
            </form>
        </MemberLayout>
    );
}
