import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FormEvent } from 'react';

export default function WhatsAppCampaignCreate({}: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        message: '',
        audience: 'members' as 'subscribers' | 'members' | 'all',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.campaigns.whatsapp.store'));
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Communication</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">New WhatsApp campaign</h1>
                </div>
            }
        >
            <Head title="Admin — New WhatsApp campaign" />

            <form onSubmit={submit} className="grid max-w-2xl gap-5">
                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Audience
                    <select value={data.audience} onChange={(event) => setData('audience', event.target.value as typeof data.audience)} className="w-fit border-[#d7c8a9]">
                        <option value="members">Member companies</option>
                        <option value="subscribers">Public subscribers</option>
                        <option value="all">Everyone</option>
                    </select>
                    <span className="text-xs font-normal text-[#667085]">WhatsApp currently reaches approved member companies with a phone number on file.</span>
                </label>

                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Message ({data.message.length}/1024 characters)
                    <textarea
                        value={data.message}
                        onChange={(event) => setData('message', event.target.value)}
                        maxLength={1024}
                        className="min-h-32 border-[#d7c8a9]"
                    />
                    {errors.message && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.message}</span>}
                </label>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-fit bg-[#14234a] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60"
                >
                    Save as draft
                </button>
            </form>
        </AdminLayout>
    );
}
