import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import CoverImageUpload from '@/Components/CoverImageUpload';

type Group = { label: string; fields: Record<string, string> };

export default function WebsiteCopyEdit({ groups, values }: { groups: Record<string, Group>; values: Record<string, string> }) {
    const { data, setData, post, processing, errors } = useForm<{ _method: string; copy: Record<string, string>; image_uploads: Record<string, File | null> }>({ _method: 'put', copy: values, image_uploads: {} });
    const submit = (event: FormEvent) => { event.preventDefault(); post(route('admin.website-copy.update'), { forceFormData: true }); };

    return (
        <AdminLayout header={<div><p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">CMS</p><h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Website copy</h1></div>}>
            <Head title="Admin — Website copy" />
            <form onSubmit={submit} className="grid max-w-5xl gap-7">
                <div className="border border-[#d7c8a9] bg-white p-6 text-sm leading-6 text-[#667085]">Manage shared navigation, footer, listing pages, calls to action, form guidance, empty states, and legal wording here. Records such as events and members remain in their dedicated dashboard sections.</div>
                {Object.entries(groups).map(([key, group]) => (
                    <section key={key} className="border border-[#d7c8a9] bg-white p-6">
                        <h2 className="font-display text-2xl font-semibold text-[#14234a]">{group.label}</h2>
                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                            {Object.entries(group.fields).map(([field, fallback]) => {
                                if (field.endsWith('_image')) return <div key={field} className="sm:col-span-2"><CoverImageUpload currentImage={data.copy[field] ?? fallback} label={field.split('_').slice(0, -1).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} error={(errors as Record<string, string>)[`image_uploads.${field}`]} onChange={(file) => setData('image_uploads', { ...data.image_uploads, [field]: file })} /></div>;
                                const multiline = fallback.length > 90 || field.endsWith('_body') || field.endsWith('_description');
                                return <label key={field} className="grid gap-2 text-sm font-bold text-[#14234a] sm:col-span-2">
                                    {field.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    {multiline ? <textarea value={data.copy[field] ?? fallback} onChange={(e) => setData('copy', { ...data.copy, [field]: e.target.value })} className="min-h-24 border-[#d7c8a9]" /> : <input value={data.copy[field] ?? fallback} onChange={(e) => setData('copy', { ...data.copy, [field]: e.target.value })} className="border-[#d7c8a9]" />}
                                    {(errors as Record<string, string>)[`copy.${field}`] && <span className="text-xs text-[#cf2f3b]">{(errors as Record<string, string>)[`copy.${field}`]}</span>}
                                </label>;
                            })}
                        </div>
                    </section>
                ))}
                <button type="submit" disabled={processing} className="w-fit bg-[#14234a] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60">Save all website copy</button>
            </form>
        </AdminLayout>
    );
}
