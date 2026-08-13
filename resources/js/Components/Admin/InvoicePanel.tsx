import { router, useForm } from '@inertiajs/react';
import { Invoice } from '@/types';
import { FormEvent } from 'react';

export default function InvoicePanel({ invoice }: { invoice: Invoice }) {
    const { data, setData, post, processing, errors, reset } = useForm<{ invoice_file: File | null }>({
        invoice_file: null,
    });

    const send = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.invoices.send', invoice.uuid), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const markPaid = () => {
        router.post(route('admin.invoices.mark-paid', invoice.uuid), {}, { preserveScroll: true });
    };

    return (
        <div className="border border-[#d7c8a9] bg-[#fbf8f0] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-[#14234a]">Invoice #{invoice.invoice_number}</p>
                    <p className="mt-1 text-sm text-[#667085]">
                        {invoice.tier_name} — {invoice.currency} {Number(invoice.amount).toLocaleString()}
                        {invoice.due_date && <> · due {new Date(invoice.due_date).toLocaleDateString()}</>}
                    </p>
                </div>
                <span className={`px-3 py-1 text-xs font-black uppercase ${invoice.status === 'paid' ? 'bg-[#e3f3ea] text-[#1e7c89]' : 'bg-[#fdeeee] text-[#cf2f3b]'}`}>
                    {invoice.status}
                </span>
            </div>

            {invoice.file_path && (
                <p className="mt-3 text-xs text-[#667085]">
                    <a href={`/storage/${invoice.file_path}`} target="_blank" rel="noreferrer" className="font-bold text-[#14234a] underline">
                        View last invoice sent ↗
                    </a>
                    {invoice.sent_at && <> · emailed {new Date(invoice.sent_at).toLocaleString()}</>}
                </p>
            )}

            {invoice.status !== 'paid' && (
                <>
                    <form onSubmit={send} className="mt-3 flex flex-wrap items-end gap-3">
                        <label className="text-xs font-bold text-[#14234a]">
                            {invoice.file_path ? 'Replace invoice & resend' : 'Upload invoice (PDF, with bank details)'}
                            <input
                                type="file"
                                accept="application/pdf,image/jpeg,image/png"
                                onChange={(event) => setData('invoice_file', event.target.files?.[0] ?? null)}
                                className="mt-1 block text-xs text-[#667085]"
                            />
                            {errors.invoice_file && <span className="mt-1 block text-xs text-[#cf2f3b]">{errors.invoice_file}</span>}
                        </label>
                        <button
                            type="submit"
                            disabled={processing || !data.invoice_file}
                            className="bg-[#14234a] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white disabled:opacity-60"
                        >
                            {processing ? 'Sending…' : invoice.file_path ? 'Resend invoice' : 'Send invoice to member'}
                        </button>
                    </form>
                    <button
                        type="button"
                        onClick={markPaid}
                        className="mt-3 bg-[#1e7c89] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white"
                    >
                        Mark invoice as paid &amp; activate account
                    </button>
                </>
            )}
        </div>
    );
}
