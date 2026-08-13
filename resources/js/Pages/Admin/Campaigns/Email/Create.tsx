import RichTextEditor from '@/Components/Admin/RichTextEditor';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FormEvent } from 'react';

export default function EmailCampaignCreate({}: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        body: '',
        audience: 'subscribers' as 'subscribers' | 'members' | 'all',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.campaigns.email.store'));
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Communication</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">New email campaign</h1>
                </div>
            }
        >
            <Head title="Admin — New email campaign" />

            <form onSubmit={submit} className="grid max-w-3xl gap-5">
                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Subject
                    <input value={data.subject} onChange={(event) => setData('subject', event.target.value)} className="border-[#d7c8a9]" />
                    {errors.subject && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.subject}</span>}
                </label>

                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Audience
                    <select value={data.audience} onChange={(event) => setData('audience', event.target.value as typeof data.audience)} className="w-fit border-[#d7c8a9]">
                        <option value="subscribers">Public subscribers</option>
                        <option value="members">Member portal users</option>
                        <option value="all">Everyone (subscribers + members)</option>
                    </select>
                </label>

                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Message
                    <RichTextEditor value={data.body} onChange={(html) => setData('body', html)} />
                    {errors.body && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.body}</span>}
                </label>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-fit bg-[#14234a] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60"
                >
                    Save as draft
                </button>
                <p className="text-sm text-[#667085]">
                    Saving creates a draft. Send it from the campaigns list once you're ready — recipients are queued and sent in the background.
                </p>
            </form>
        </AdminLayout>
    );
}
