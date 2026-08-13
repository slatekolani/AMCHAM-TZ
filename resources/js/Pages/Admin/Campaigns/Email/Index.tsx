import StatusBadge from '@/Components/Admin/StatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { confirmAndDelete, confirmAndPost } from '@/utils/alerts';

type Campaign = {
    id: number;
    uuid: string;
    subject: string;
    audience: string;
    status: string;
    logs_count: number;
    sent_at: string | null;
    created_at: string;
};

type IndexProps = PageProps<{ campaigns: Campaign[] }>;

export default function EmailCampaignsIndex({ campaigns }: IndexProps) {
    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Communication</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Email campaigns</h1>
                </div>
            }
        >
            <Head title="Admin — Email campaigns" />

            <div className="mb-5">
                <Link href={route('admin.campaigns.email.create')} className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">
                    New campaign
                </Link>
            </div>

            <div className="grid gap-3">
                {campaigns.map((campaign) => (
                    <article key={campaign.id} className="grid gap-3 border border-[#d7c8a9] bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                        <div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={campaign.status} />
                                <h3 className="text-lg font-bold text-[#14234a]">{campaign.subject}</h3>
                            </div>
                            <p className="mt-2 text-sm text-[#667085]">
                                Audience: {campaign.audience} · {campaign.logs_count} recipients logged
                                {campaign.sent_at && <> · Sent {new Date(campaign.sent_at).toLocaleString()}</>}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {campaign.status === 'draft' && (
                                <button
                                    type="button"
                                    onClick={() => confirmAndPost(route('admin.campaigns.email.send', campaign.uuid), 'this email campaign')}
                                    className="bg-[#1e7c89] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white"
                                >
                                    Send now
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => confirmAndDelete(route('admin.campaigns.email.destroy', campaign.uuid), 'this email campaign')}
                                className="text-sm font-bold text-[#cf2f3b]"
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}
                {campaigns.length === 0 && <p className="text-[#667085]">No campaigns created yet.</p>}
            </div>
        </AdminLayout>
    );
}
