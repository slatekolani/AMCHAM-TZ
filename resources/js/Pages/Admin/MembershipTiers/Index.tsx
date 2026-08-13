import AdminLayout from '@/Layouts/AdminLayout';
import { MembershipTier, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { confirmAndDelete } from '@/utils/alerts';

type TierWithCount = MembershipTier & { applications_count: number };

export default function MembershipTiersIndex({ tiers }: PageProps<{ tiers: TierWithCount[] }>) {
    return (
        <AdminLayout header={<div><p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Members</p><h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Membership tiers</h1></div>}>
            <Head title="Admin — Membership tiers" />
            <div className="mb-5 flex justify-end">
                <Link href={route('admin.membership-tiers.create')} className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">New tier</Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                {tiers.map((tier) => (
                    <article key={tier.id} className="border border-[#d7c8a9] bg-white p-6">
                        <div className="flex items-start justify-between gap-5">
                            <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#cf2f3b]">{tier.is_active ? 'Active' : 'Inactive'} · Order {tier.sort_order}</p><h2 className="mt-2 text-2xl font-bold text-[#14234a]">{tier.name}</h2></div>
                            <p className="text-xl font-black text-[#14234a]">{tier.price ? `${tier.currency} ${Number(tier.price).toLocaleString()}` : 'Free'}<span className="text-xs font-semibold text-[#667085]"> / {tier.billing_period}</span></p>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-[#667085]">{tier.description || tier.audience}</p>
                        <p className="mt-4 text-sm font-bold text-[#14234a]">{tier.benefits.length} benefits · {tier.applications_count} applications</p>
                        <div className="mt-5 flex gap-4">
                            <Link href={route('admin.membership-tiers.edit', tier.uuid)} className="text-sm font-bold text-[#14234a]">Edit tier</Link>
                            <button type="button" onClick={() => confirmAndDelete(route('admin.membership-tiers.destroy', tier.uuid), 'this membership tier')} className="text-sm font-bold text-[#cf2f3b]">Delete</button>
                        </div>
                    </article>
                ))}
            </div>
        </AdminLayout>
    );
}
