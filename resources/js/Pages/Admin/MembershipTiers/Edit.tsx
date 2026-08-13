import AdminLayout from '@/Layouts/AdminLayout';
import { MembershipTier, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function MembershipTierEdit({ tier }: PageProps<{ tier: MembershipTier | null }>) {
    const { data, setData, post, put, processing, errors, transform } = useForm({
        name: tier?.name ?? '', price: tier?.price ?? '', currency: tier?.currency ?? 'USD', billing_period: tier?.billing_period ?? 'year',
        audience: tier?.audience ?? '', description: tier?.description ?? '', benefits_text: tier?.benefits.join('\n') ?? '',
        benefits: tier?.benefits ?? [] as string[], sort_order: tier?.sort_order ?? 0, is_active: tier?.is_active ?? true,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        transform((values) => ({ ...values, benefits: values.benefits_text.split('\n').map((item) => item.trim()).filter(Boolean) }));
        tier ? put(route('admin.membership-tiers.update', tier.uuid)) : post(route('admin.membership-tiers.store'));
    };
    const input = 'mt-2 w-full border-[#d7c8a9] bg-white px-4 py-3';
    return (
        <AdminLayout header={<div><p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Members</p><h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">{tier ? `Edit ${tier.name}` : 'New membership tier'}</h1></div>}>
            <Head title={`Admin — ${tier ? 'Edit tier' : 'New tier'}`} />
            <form onSubmit={submit} className="grid max-w-4xl gap-5 border border-[#d7c8a9] bg-white p-6 md:grid-cols-2">
                <Field label="Tier name" error={errors.name}><input value={data.name} onChange={(e) => setData('name', e.target.value)} className={input} required /></Field>
                <Field label="Who this tier is for" error={errors.audience}><input value={data.audience} onChange={(e) => setData('audience', e.target.value)} className={input} /></Field>
                <Field label="Price" error={errors.price}><input type="number" min="0" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} className={input} /></Field>
                <div className="grid grid-cols-2 gap-3"><Field label="Currency" error={errors.currency}><input maxLength={3} value={data.currency} onChange={(e) => setData('currency', e.target.value.toUpperCase())} className={input} required /></Field><Field label="Billing period" error={errors.billing_period}><input value={data.billing_period} onChange={(e) => setData('billing_period', e.target.value)} className={input} required /></Field></div>
                <Field label="Full description" error={errors.description} wide><textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className={`${input} min-h-28`} /></Field>
                <Field label="Benefits (one per line)" error={errors.benefits} wide><textarea value={data.benefits_text} onChange={(e) => setData('benefits_text', e.target.value)} className={`${input} min-h-44`} required /></Field>
                <Field label="Display order" error={errors.sort_order}><input type="number" min="0" value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} className={input} required /></Field>
                <label className="flex items-center gap-3 self-end pb-3 text-sm font-bold text-[#14234a]"><input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} /> Show this tier publicly</label>
                <div className="flex gap-4 md:col-span-2"><button disabled={processing} className="bg-[#14234a] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white disabled:opacity-60">Save tier</button><Link href={route('admin.membership-tiers.index')} className="px-6 py-3 text-sm font-bold text-[#667085]">Cancel</Link></div>
            </form>
        </AdminLayout>
    );
}

function Field({ label, error, wide = false, children }: { label: string; error?: string; wide?: boolean; children: React.ReactNode }) {
    return <label className={`text-sm font-bold text-[#14234a] ${wide ? 'md:col-span-2' : ''}`}>{label}{children}{error && <span className="mt-1 block text-xs text-[#cf2f3b]">{error}</span>}</label>;
}
