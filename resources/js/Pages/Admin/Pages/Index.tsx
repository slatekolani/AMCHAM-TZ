import StatusBadge from '@/Components/Admin/StatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Page, PageProps } from '@/types';

type PagesIndexProps = PageProps<{ pages: Page[] }>;

export default function PagesIndex({ pages }: PagesIndexProps) {
    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">CMS</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Website pages</h1>
                </div>
            }
        >
            <Head title="Admin — Pages" />

            <div className="overflow-hidden border border-[#d7c8a9] bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#fbf8f0] text-xs font-black uppercase tracking-[0.1em] text-[#667085]">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4">Status</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eadfc8]">
                        {pages.map((page) => (
                            <tr key={page.id}>
                                <td className="p-4 font-bold text-[#14234a]">{page.title}</td>
                                <td className="p-4 text-[#667085]">/{page.slug}</td>
                                <td className="p-4"><StatusBadge status={page.status} /></td>
                                <td className="p-4 text-right">
                                    <Link href={route('admin.pages.edit', page.uuid)} className="text-sm font-bold text-[#14234a] hover:text-[#cf2f3b]">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
