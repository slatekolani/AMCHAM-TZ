import StatusBadge from '@/Components/Admin/StatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Company, PageProps } from '@/types';
import { confirmAndDelete } from '@/utils/alerts';

type CompaniesIndexProps = PageProps<{
    companies: Company[];
    filters: { status: string };
}>;

const statusFilters = ['', 'pending', 'approved', 'suspended'];

export default function CompaniesIndex({ companies, filters }: CompaniesIndexProps) {
    const setStatus = (status: string) => {
        router.get(route('admin.companies.index'), status ? { status } : {}, { preserveState: true });
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Members</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Companies</h1>
                </div>
            }
        >
            <Head title="Admin — Companies" />

            <div className="mb-5 flex flex-wrap gap-2">
                {statusFilters.map((status) => (
                    <button
                        key={status || 'all'}
                        type="button"
                        onClick={() => setStatus(status)}
                        className={
                            'border px-4 py-2 text-sm font-bold ' +
                            (filters.status === status ? 'border-[#14234a] bg-[#14234a] text-white' : 'border-[#d7c8a9] bg-white text-[#14234a]')
                        }
                    >
                        {status ? status[0].toUpperCase() + status.slice(1) : 'All'}
                    </button>
                ))}
            </div>

            <div className="overflow-hidden border border-[#d7c8a9] bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#fbf8f0] text-xs font-black uppercase tracking-[0.1em] text-[#667085]">
                        <tr>
                            <th className="p-4">Company</th>
                            <th className="p-4">Sector</th>
                            <th className="p-4">Tier</th>
                            <th className="p-4">Status</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eadfc8]">
                        {companies.map((company) => (
                            <tr key={company.id}>
                                <td className="p-4 font-bold text-[#14234a]">{company.name}</td>
                                <td className="p-4 text-[#667085]">{company.sector}</td>
                                <td className="p-4 text-[#667085]">{company.membership_tier?.name ?? '—'}</td>
                                <td className="p-4"><StatusBadge status={company.status} /></td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-3">
                                        <Link href={route('admin.companies.edit', company.uuid)} className="text-sm font-bold text-[#14234a] hover:text-[#cf2f3b]">
                                            Edit
                                        </Link>
                                        {company.status !== 'approved' && (
                                            <button
                                                type="button"
                                                onClick={() => router.post(route('admin.companies.approve', company.uuid), {}, { preserveScroll: true })}
                                                className="text-sm font-bold text-[#1e7c89]"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {company.status !== 'suspended' && (
                                            <button
                                                type="button"
                                                onClick={() => router.post(route('admin.companies.suspend', company.uuid), {}, { preserveScroll: true })}
                                                className="text-sm font-bold text-[#cf2f3b]"
                                            >
                                                Suspend
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => confirmAndDelete(route('admin.companies.destroy', company.uuid), company.name)}
                                            className="text-sm font-bold text-[#cf2f3b]"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
