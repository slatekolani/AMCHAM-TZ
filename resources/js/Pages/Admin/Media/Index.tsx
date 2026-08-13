import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FormEvent } from 'react';
import { confirmAndDelete } from '@/utils/alerts';

type MediaItem = {
    id: number;
    uuid: string;
    filename: string;
    description: string | null;
    mime_type: string | null;
    size: number | null;
    url: string;
    created_at: string;
};

type MediaIndexProps = PageProps<{
    media: { data: MediaItem[]; links: { url: string | null; label: string; active: boolean }[] };
}>;

export default function MediaIndex({ media }: MediaIndexProps) {
    const { data, setData, post, processing, errors, reset } = useForm<{ file: File | null; description: string }>({ file: null, description: '' });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.media.store'), { forceFormData: true, onSuccess: () => reset() });
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Content</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Media library</h1>
                </div>
            }
        >
            <Head title="Admin — Media library" />

            <form onSubmit={submit} className="mb-6 flex flex-wrap items-end gap-4 border border-[#d7c8a9] bg-[#fbf8f0] p-5">
                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Upload image
                    <input type="file" accept="image/*" onChange={(event) => setData('file', event.target.files?.[0] ?? null)} className="border-[#d7c8a9] bg-white" />
                    {errors.file && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.file}</span>}
                </label>
                <label className="grid min-w-[18rem] flex-1 gap-2 text-sm font-bold text-[#14234a]">
                    Image description
                    <input value={data.description} onChange={(event) => setData('description', event.target.value)} placeholder="Describe the people, place or activity shown" className="border-[#d7c8a9] bg-white" required />
                    {errors.description && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.description}</span>}
                </label>
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-[#14234a] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white disabled:opacity-60"
                >
                    Upload
                </button>
            </form>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {media.data.map((item) => (
                    <MediaCard key={item.id} item={item} />
                ))}
                {media.data.length === 0 && <p className="text-[#667085]">No media uploaded yet.</p>}
            </div>
        </AdminLayout>
    );
}

function MediaCard({ item }: { item: MediaItem }) {
    const { data, setData, put, processing, errors } = useForm({ description: item.description ?? '' });
    return <div className="group relative border border-[#d7c8a9] bg-white p-3">
        <img src={item.url} alt={item.description || item.filename} className="h-36 w-full object-cover" />
        <p className="mt-2 truncate text-xs font-semibold text-[#667085]">{item.filename}</p>
        <form onSubmit={(event) => { event.preventDefault(); put(route('admin.media.update', item.uuid), { preserveScroll: true }); }} className="mt-2 grid gap-2">
            <textarea value={data.description} onChange={(event) => setData('description', event.target.value)} placeholder="Image description" className="min-h-20 border-[#d7c8a9] text-sm" required />
            {errors.description && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.description}</span>}
            <button disabled={processing} className="bg-[#14234a] px-3 py-2 text-xs font-bold uppercase text-white disabled:opacity-60">Save description</button>
        </form>
        <button type="button" onClick={() => confirmAndDelete(route('admin.media.destroy', item.uuid), 'this image')} className="absolute right-2 top-2 hidden bg-[#cf2f3b] px-2 py-1 text-xs font-bold text-white group-hover:block">Delete</button>
    </div>;
}
