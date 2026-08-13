import AdminLayout from '@/Layouts/AdminLayout';
import { BoardMember, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type CompanyOption = { id: number; name: string };

export default function BoardMemberEdit({ boardMember, companies }: PageProps<{ boardMember: BoardMember | null; companies: CompanyOption[] }>) {
    const { data, setData, post, transform, processing, errors } = useForm({
        _method: boardMember ? 'put' : 'post', name: boardMember?.name ?? '', role_title: boardMember?.role_title ?? '', bio: boardMember?.bio ?? '', linkedin_url: boardMember?.linkedin_url ?? '', company_id: boardMember?.company_id ? String(boardMember.company_id) : '', sort_order: boardMember?.sort_order ?? 0, is_active: boardMember?.is_active ?? true, photo: null as File | null,
    });
    const [preview, setPreview] = useState(boardMember?.photo_path ?? null);
    const submit = (event: FormEvent) => {
        event.preventDefault();
        transform((current) => ({ ...current, company_id: current.company_id || null }));
        post(boardMember ? route('admin.board-members.update', boardMember.uuid) : route('admin.board-members.store'), { forceFormData: true });
    };
    const input = 'mt-2 w-full border-[#d7c8a9] bg-white px-4 py-3';
    return <AdminLayout header={<div><p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Content</p><h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">{boardMember ? `Edit ${boardMember.name}` : 'Add board member'}</h1></div>}>
        <Head title={`Admin — ${boardMember ? 'Edit board member' : 'Add board member'}`} />
        <form onSubmit={submit} className="grid max-w-4xl gap-5 border border-[#d7c8a9] bg-white p-6 md:grid-cols-[16rem_1fr]">
            <div><p className="text-sm font-bold text-[#14234a]">Portrait photo</p><div className="mt-2 h-72 overflow-hidden bg-[#f4efe5]">{preview ? <img src={preview} alt="Portrait preview" className="h-full w-full object-cover object-top" /> : <div className="grid h-full place-items-center text-sm text-[#667085]">No photo selected</div>}</div><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0] ?? null; setData('photo', file); if (file) setPreview(URL.createObjectURL(file)); }} className="mt-3 w-full text-xs" />{errors.photo && <span className="mt-1 block text-xs text-[#cf2f3b]">{errors.photo}</span>}</div>
            <div className="grid gap-5"><label className="text-sm font-bold text-[#14234a]">Full name<input value={data.name} onChange={(e) => setData('name', e.target.value)} className={input} required />{errors.name && <span className="text-xs text-[#cf2f3b]">{errors.name}</span>}</label><label className="text-sm font-bold text-[#14234a]">Board role and organisation<input value={data.role_title} onChange={(e) => setData('role_title', e.target.value)} className={input} required />{errors.role_title && <span className="text-xs text-[#cf2f3b]">{errors.role_title}</span>}</label><label className="text-sm font-bold text-[#14234a]">Biography<textarea value={data.bio} onChange={(e) => setData('bio', e.target.value)} className={`${input} min-h-28`} /></label><label className="text-sm font-bold text-[#14234a]">LinkedIn URL<input type="url" value={data.linkedin_url} onChange={(e) => setData('linkedin_url', e.target.value)} className={input} /></label><label className="text-sm font-bold text-[#14234a]">Linked member company<select value={data.company_id} onChange={(e) => setData('company_id', e.target.value)} className={input}><option value="">Not linked</option>{companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select><span className="mt-1 block text-xs font-normal text-[#667085]">Linking to an approved company lets that company submit one homepage testimonial.</span>{errors.company_id && <span className="text-xs text-[#cf2f3b]">{errors.company_id}</span>}</label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-[#14234a]">Display order<input type="number" min="0" value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} className={input} /></label><label className="flex items-center gap-3 self-end pb-3 text-sm font-bold text-[#14234a]"><input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />Show publicly</label></div><div className="flex gap-4"><button disabled={processing} className="bg-[#14234a] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white disabled:opacity-60">Save board member</button><Link href={route('admin.board-members.index')} className="px-6 py-3 text-sm font-bold text-[#667085]">Cancel</Link></div></div>
        </form>
    </AdminLayout>;
}
