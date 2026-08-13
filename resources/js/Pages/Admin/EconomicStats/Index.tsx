import AdminLayout from '@/Layouts/AdminLayout';
import { EconomicStat, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { confirmAndDelete } from '@/utils/alerts';

type EconomicStatsIndexProps = PageProps<{
    stats: EconomicStat[];
    filters: { category: string };
}>;

const categoryFilters = ['', 'trade', 'investment'];

export default function EconomicStatsIndex({ stats, filters }: EconomicStatsIndexProps) {
    const setCategory = (category: string) => {
        router.get(route('admin.economic-stats.index'), category ? { category } : {}, { preserveState: true });
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Content</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Trade & Investment Data</h1>
                </div>
            }
        >
            <Head title="Admin — Trade & Investment Data" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    {categoryFilters.map((category) => (
                        <button
                            key={category || 'all'}
                            type="button"
                            onClick={() => setCategory(category)}
                            className={
                                'border px-4 py-2 text-sm font-bold capitalize ' +
                                (filters.category === category ? 'border-[#14234a] bg-[#14234a] text-white' : 'border-[#d7c8a9] bg-white text-[#14234a]')
                            }
                        >
                            {category || 'All'}
                        </button>
                    ))}
                </div>
                <Link href={route('admin.economic-stats.create')} className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">
                    New stat
                </Link>
            </div>

            <div className="overflow-hidden border border-[#d7c8a9] bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#fbf8f0] text-xs font-black uppercase tracking-[0.1em] text-[#667085]">
                        <tr>
                            <th className="p-4">Category</th>
                            <th className="p-4">Label</th>
                            <th className="p-4">Value</th>
                            <th className="p-4">Period</th>
                            <th className="p-4">Featured</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eadfc8]">
                        {stats.map((stat) => (
                            <tr key={stat.id}>
                                <td className="p-4 capitalize text-[#667085]">{stat.category}</td>
                                <td className="p-4 font-bold text-[#14234a]">{stat.label}</td>
                                <td className="p-4 text-[#667085]">{stat.value}</td>
                                <td className="p-4 text-[#667085]">{stat.period ?? '—'}</td>
                                <td className="p-4">
                                    {stat.is_featured && (
                                        <span className="bg-[#f0d99a] px-2.5 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#14234a]">Featured</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-3">
                                        <Link href={route('admin.economic-stats.edit', stat.uuid)} className="text-sm font-bold text-[#14234a] hover:text-[#cf2f3b]">
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => confirmAndDelete(route('admin.economic-stats.destroy', stat.uuid), stat.label)}
                                            className="text-sm font-bold text-[#cf2f3b]"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {stats.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-[#667085]">No stats found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
