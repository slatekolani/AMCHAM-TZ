import StatusBadge from '@/Components/Admin/StatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { confirmAndDelete } from '@/utils/alerts';
import { FormEvent, useState } from 'react';

type Subscriber = {
    id: number;
    uuid: string;
    name: string | null;
    email: string;
    status: string;
    source: string | null;
    created_at: string;
};

type SubscribersIndexProps = PageProps<{
    subscribers: { data: Subscriber[]; links: { url: string | null; label: string; active: boolean }[] };
}>;

export default function SubscribersIndex({ subscribers }: SubscribersIndexProps) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', email: '' });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.subscribers.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Communication</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Subscribers</h1>
                </div>
            }
        >
            <Head title="Admin — Subscribers" />

            <div className="mb-5 flex justify-end">
                <button
                    type="button"
                    onClick={() => setShowForm((value) => !value)}
                    className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white"
                >
                    {showForm ? 'Cancel' : '+ Add subscriber'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={submit} className="mb-5 grid gap-4 border border-[#d7c8a9] bg-[#fbf8f0] p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Name <span className="font-normal text-[#667085]">(optional)</span>
                        <input value={data.name} onChange={(event) => setData('name', event.target.value)} className="border-[#d7c8a9] bg-white" />
                        {errors.name && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.name}</span>}
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Email
                        <input type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} className="border-[#d7c8a9] bg-white" required />
                        {errors.email && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.email}</span>}
                    </label>
                    <button
                        type="submit"
                        disabled={processing}
                        className="h-fit bg-[#1e7c89] px-5 py-2.5 text-sm font-black uppercase tracking-[0.1em] text-white disabled:opacity-60"
                    >
                        {processing ? 'Adding…' : 'Add subscriber'}
                    </button>
                </form>
            )}

            <div className="overflow-hidden border border-[#d7c8a9] bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#fbf8f0] text-xs font-black uppercase tracking-[0.1em] text-[#667085]">
                        <tr>
                            <th className="p-4">Email</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Source</th>
                            <th className="p-4">Status</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eadfc8]">
                        {subscribers.data.map((subscriber) => (
                            <tr key={subscriber.id}>
                                <td className="p-4 font-bold text-[#14234a]">{subscriber.email}</td>
                                <td className="p-4 text-[#667085]">{subscriber.name ?? '—'}</td>
                                <td className="p-4 text-[#667085]">{subscriber.source ?? '—'}</td>
                                <td className="p-4"><StatusBadge status={subscriber.status} /></td>
                                <td className="p-4 text-right">
                                    <button
                                        type="button"
                                        onClick={() => confirmAndDelete(route('admin.subscribers.destroy', subscriber.uuid), 'this subscriber')}
                                        className="text-sm font-bold text-[#cf2f3b]"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                {subscribers.links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url ?? '#'}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={'border px-3 py-1.5 text-sm font-bold ' + (link.active ? 'border-[#14234a] bg-[#14234a] text-white' : 'border-[#d7c8a9] bg-white text-[#14234a]')}
                    />
                ))}
            </div>
        </AdminLayout>
    );
}
