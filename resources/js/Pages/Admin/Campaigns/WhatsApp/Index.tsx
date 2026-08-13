import StatusBadge from '@/Components/Admin/StatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { confirmAndDelete, confirmAndPost } from '@/utils/alerts';

type Campaign = {
    id: number;
    uuid: string;
    message: string;
    audience: string;
    status: string;
    logs_count: number;
    sent_at: string | null;
};

type IndexProps = PageProps<{ campaigns: Campaign[] }>;

export default function WhatsAppCampaignsIndex({ campaigns }: IndexProps) {
    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Communication</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">WhatsApp campaigns</h1>
                </div>
            }
        >
            <Head title="Admin — WhatsApp campaigns" />

            <p className="mb-5 max-w-2xl border border-[#d7c8a9] bg-[#fbf8f0] p-4 text-sm text-[#667085]">
                WhatsApp is sent to approved member companies with a phone number on file, via the Meta WhatsApp Cloud API once configured.
                Until <code>WHATSAPP_PROVIDER=cloud_api</code> is set with valid credentials in <code>.env</code>, sends are logged only — no live message is dispatched.
            </p>

            <div className="mb-5">
                <Link href={route('admin.campaigns.whatsapp.create')} className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">
                    New campaign
                </Link>
            </div>

            <div className="grid gap-3">
                {campaigns.map((campaign) => (
                    <article key={campaign.id} className="grid gap-3 border border-[#d7c8a9] bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                        <div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={campaign.status} />
                                <p className="text-sm text-[#667085]">{campaign.logs_count} recipients logged</p>
                            </div>
                            <p className="mt-2 font-semibold text-[#14234a]">{campaign.message}</p>
                        </div>
                        <div className="flex gap-3">
                            {campaign.status === 'draft' && (
                                <button
                                    type="button"
                                    onClick={() => confirmAndPost(route('admin.campaigns.whatsapp.send', campaign.uuid), 'this WhatsApp campaign')}
                                    className="bg-[#1e7c89] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white"
                                >
                                    Send now
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => confirmAndDelete(route('admin.campaigns.whatsapp.destroy', campaign.uuid), 'this WhatsApp campaign')}
                                className="text-sm font-bold text-[#cf2f3b]"
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}
                {campaigns.length === 0 && <p className="text-[#667085]">No WhatsApp campaigns created yet.</p>}
            </div>
        </AdminLayout>
    );
}
