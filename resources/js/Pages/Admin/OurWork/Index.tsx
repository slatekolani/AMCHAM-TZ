import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { OurWorkItem, PageProps } from '@/types';
import { confirmAndDelete } from '@/utils/alerts';

type OurWorkIndexProps = PageProps<{ items: OurWorkItem[] }>;

export default function OurWorkIndex({ items }: OurWorkIndexProps) {
    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Content</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Our Work</h1>
                    <p className="mt-2 max-w-2xl text-sm text-[#667085]">
                        Shown in the "Our Work" navigation dropdown, ordered by display order. Each item links to its own
                        public page.
                    </p>
                </div>
            }
        >
            <Head title="Admin — Our Work" />

            <div className="mb-5 flex justify-end">
                <Link href={route('admin.our-work.create')} className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">
                    New work item
                </Link>
            </div>

            <div className="grid gap-3">
                {items.map((item) => (
                    <article key={item.id} className="grid gap-4 border border-[#d7c8a9] bg-white p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#cf2f3b]">
                                {item.is_active ? 'Published' : 'Draft'} · Order {item.sort_order}
                            </p>
                            <Link href={route('admin.our-work.edit', item.uuid)} className="mt-2 block text-lg font-bold text-[#14234a] hover:text-[#cf2f3b]">
                                {item.title}
                            </Link>
                            <p className="mt-1 text-sm text-[#667085]">{item.summary}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href={route('admin.our-work.edit', item.uuid)} className="text-sm font-bold text-[#14234a]">
                                Edit
                            </Link>
                            <button
                                type="button"
                                onClick={() => confirmAndDelete(route('admin.our-work.destroy', item.uuid), 'this work item')}
                                className="text-sm font-bold text-[#cf2f3b]"
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}
                {items.length === 0 && <p className="text-[#667085]">No work items added yet.</p>}
            </div>
        </AdminLayout>
    );
}
