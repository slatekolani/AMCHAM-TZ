import RichTextEditor from '@/Components/Admin/RichTextEditor';
import CoverImageUpload from '@/Components/CoverImageUpload';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps, WorkingGroup } from '@/types';
import { FormEvent } from 'react';

type WorkingGroupEditProps = PageProps<{ item: WorkingGroup | null }>;

export default function WorkingGroupEdit({ item }: WorkingGroupEditProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: item ? 'put' : undefined,
        title: item?.title ?? '',
        summary: item?.summary ?? '',
        body: item?.body ?? '',
        cover_image: null as File | null,
        sort_order: item?.sort_order ?? 0,
        is_active: item?.is_active ?? true,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(item ? route('admin.working-groups.update', item.uuid) : route('admin.working-groups.store'), { forceFormData: true });
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Content</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">{item ? 'Edit working group' : 'New working group'}</h1>
                </div>
            }
        >
            <Head title="Admin — Edit working group" />

            <form onSubmit={submit} className="grid max-w-4xl gap-5">
                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Title
                    <input value={data.title} onChange={(event) => setData('title', event.target.value)} className="border-[#d7c8a9]" />
                    {errors.title && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.title}</span>}
                </label>

                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Summary
                    <span className="text-xs font-normal text-[#667085]">Short line shown in the Newsroom navigation dropdown.</span>
                    <textarea value={data.summary} onChange={(event) => setData('summary', event.target.value)} className="min-h-20 border-[#d7c8a9]" />
                    {errors.summary && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.summary}</span>}
                </label>

                <CoverImageUpload currentImage={item?.cover_image_path} error={errors.cover_image} onChange={(file) => setData('cover_image', file)} />

                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Body
                    <span className="text-xs font-normal text-[#667085]">Full content shown on this working group's own public page.</span>
                    <RichTextEditor value={data.body} onChange={(html) => setData('body', html)} />
                    {errors.body && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.body}</span>}
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Display order
                        <input type="number" min="0" value={data.sort_order} onChange={(event) => setData('sort_order', Number(event.target.value))} className="border-[#d7c8a9]" />
                    </label>
                    <label className="flex items-center gap-3 self-end pb-3 text-sm font-bold text-[#14234a]">
                        <input type="checkbox" checked={data.is_active} onChange={(event) => setData('is_active', event.target.checked)} />
                        Published — visible in the Newsroom navigation and on the public site
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-fit bg-[#14234a] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60"
                >
                    Save working group
                </button>
            </form>
        </AdminLayout>
    );
}
