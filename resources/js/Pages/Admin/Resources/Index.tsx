import AdminLayout from '@/Layouts/AdminLayout';
import CoverImageUpload from '@/Components/CoverImageUpload';
import { Head, useForm } from '@inertiajs/react';
import { PageProps, Resource } from '@/types';
import { confirmAndDelete } from '@/utils/alerts';
import { FormEvent, useState } from 'react';

type ResourcesIndexProps = PageProps<{ resources: Resource[] }>;

export default function ResourcesIndex({ resources }: ResourcesIndexProps) {
    const [editing, setEditing] = useState<Resource | null>(null);

    const { data, setData, post, processing, errors, reset, transform } = useForm<{
        title: string;
        description: string;
        category: string;
        file: File | null;
        cover_image: File | null;
    }>({
        title: '',
        description: '',
        category: 'Newsletter',
        file: null,
        cover_image: null,
    });

    const startEdit = (resource: Resource) => {
        setEditing(resource);
        setData({
            title: resource.title,
            description: resource.description ?? '',
            category: resource.category ?? '',
            file: null,
            cover_image: null,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditing(null);
        reset();
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (editing) {
            transform((current) => ({ ...current, _method: 'put' }));
            post(route('admin.resources.update', editing.uuid), {
                forceFormData: true,
                onSuccess: () => {
                    setEditing(null);
                    reset();
                },
            });
        } else {
            transform((current) => current);
            post(route('admin.resources.store'), { forceFormData: true, onSuccess: () => reset() });
        }
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Content</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Resources & newsletters</h1>
                </div>
            }
        >
            <Head title="Admin — Resources" />

            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <form onSubmit={submit} className="grid h-fit gap-4 border border-[#d7c8a9] bg-[#fbf8f0] p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-[#14234a]">{editing ? `Edit — ${editing.title}` : 'Upload newsletter or resource'}</h2>
                        {editing && (
                            <button type="button" onClick={cancelEdit} className="text-xs font-bold uppercase tracking-[0.08em] text-[#667085] hover:text-[#cf2f3b]">
                                Cancel
                            </button>
                        )}
                    </div>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Title
                        <input value={data.title} onChange={(event) => setData('title', event.target.value)} className="border-[#d7c8a9] bg-white" />
                        {errors.title && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.title}</span>}
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Publication type
                        <input list="resource-categories" value={data.category} onChange={(event) => setData('category', event.target.value)} className="border-[#d7c8a9] bg-white" />
                        <datalist id="resource-categories">
                            <option value="Newsletter" />
                            <option value="Policy Brief" />
                            <option value="Investor Guide" />
                            <option value="Membership Material" />
                        </datalist>
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Description
                        <textarea value={data.description} onChange={(event) => setData('description', event.target.value)} className="min-h-24 border-[#d7c8a9] bg-white" />
                    </label>
                    <CoverImageUpload
                        label="Cover picture (recommended — this is what shows on the card)"
                        currentImage={editing?.cover_image_path}
                        error={errors.cover_image}
                        onChange={(file) => setData('cover_image', file)}
                    />
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        File (PDF, Word, Excel — max 20MB){editing && <span className="font-normal text-[#667085]"> — leave blank to keep the current file</span>}
                        <input
                            type="file"
                            onChange={(event) => setData('file', event.target.files?.[0] ?? null)}
                            className="border-[#d7c8a9] bg-white"
                        />
                        {errors.file && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.file}</span>}
                    </label>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-fit bg-[#14234a] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white disabled:opacity-60"
                    >
                        {editing ? 'Save changes' : 'Upload'}
                    </button>
                </form>

                <div className="grid gap-3">
                    {resources.map((resource) => (
                        <article key={resource.id} className="flex items-center justify-between gap-4 border border-[#d7c8a9] bg-white p-5">
                            <div className="flex items-center gap-4">
                                {resource.cover_image_path ? (
                                    <img src={resource.cover_image_path} alt="" className="h-16 w-16 shrink-0 rounded-md border border-[#eadfc8] object-cover" />
                                ) : (
                                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-md border border-dashed border-[#d7c8a9] bg-[#fbf8f0] text-[10px] font-bold uppercase text-[#a89a72]">
                                        No image
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.1em] text-[#cf2f3b]">{resource.category}</p>
                                    <h3 className="mt-1 font-bold text-[#14234a]">{resource.title}</h3>
                                    <p className="mt-1 text-sm text-[#667085]">{resource.description}</p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-4">
                                <button type="button" onClick={() => startEdit(resource)} className="text-sm font-bold text-[#14234a] hover:text-[#1e7c89]">
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => confirmAndDelete(route('admin.resources.destroy', resource.uuid), 'this resource')}
                                    className="text-sm font-bold text-[#cf2f3b]"
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                    {resources.length === 0 && <p className="text-[#667085]">No resources uploaded yet.</p>}
                </div>
            </div>
        </AdminLayout>
    );
}
