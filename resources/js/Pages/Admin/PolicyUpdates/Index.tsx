import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, PolicyUpdate } from '@/types';
import { confirmAndDelete } from '@/utils/alerts';

type PolicyUpdatesIndexProps = PageProps<{ policyUpdates: PolicyUpdate[] }>;

export default function PolicyUpdatesIndex({ policyUpdates }: PolicyUpdatesIndexProps) {
    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Content</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Policy updates</h1>
                    <p className="mt-2 max-w-2xl text-sm text-[#667085]">
                        Shown in the Newsroom navigation dropdown and on the public site. The five most recent published
                        updates appear in the nav.
                    </p>
                </div>
            }
        >
            <Head title="Admin — Policy updates" />

            <div className="mb-5 flex justify-end">
                <Link href={route('admin.policy-updates.create')} className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">
                    New policy update
                </Link>
            </div>

            <div className="grid gap-3">
                {policyUpdates.map((item) => (
                    <article key={item.id} className="grid gap-4 border border-[#d7c8a9] bg-white p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#cf2f3b]">{item.is_active ? 'Published' : 'Draft'}</p>
                            <Link href={route('admin.policy-updates.edit', item.uuid)} className="mt-2 block text-lg font-bold text-[#14234a] hover:text-[#cf2f3b]">
                                {item.title}
                            </Link>
                            <p className="mt-1 text-sm text-[#667085]">{item.summary}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href={route('admin.policy-updates.edit', item.uuid)} className="text-sm font-bold text-[#14234a]">
                                Edit
                            </Link>
                            <button
                                type="button"
                                onClick={() => confirmAndDelete(route('admin.policy-updates.destroy', item.uuid), 'this policy update')}
                                className="text-sm font-bold text-[#cf2f3b]"
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}
                {policyUpdates.length === 0 && <p className="text-[#667085]">No policy updates added yet.</p>}
            </div>
        </AdminLayout>
    );
}
