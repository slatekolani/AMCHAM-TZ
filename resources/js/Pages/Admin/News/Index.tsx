import ApprovalActions from '@/Components/Admin/ApprovalActions';
import StatusBadge from '@/Components/Admin/StatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { NewsArticle, PageProps } from '@/types';
import { confirmAndDelete } from '@/utils/alerts';

type NewsIndexProps = PageProps<{
    articles: NewsArticle[];
    filters: { status: string };
}>;

const statusFilters = ['', 'draft', 'pending_review', 'published', 'rejected'];

export default function NewsIndex({ articles, filters }: NewsIndexProps) {
    const setStatus = (status: string) => {
        router.get(route('admin.news.index'), status ? { status } : {}, { preserveState: true });
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Content</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">News & publications</h1>
                </div>
            }
        >
            <Head title="Admin — News" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
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
                            {status ? status.replace('_', ' ') : 'All'}
                        </button>
                    ))}
                </div>
                <Link href={route('admin.news.create')} className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">
                    New article
                </Link>
            </div>

            <div className="grid gap-3">
                {articles.map((article) => (
                    <article key={article.id} className="grid gap-4 border border-[#d7c8a9] bg-white p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <StatusBadge status={article.status} />
                                {article.company && <span className="text-xs font-bold text-[#667085]">Submitted by {article.company.name}</span>}
                            </div>
                            <Link href={route('admin.news.edit', article.uuid)} className="mt-2 block text-lg font-bold text-[#14234a] hover:text-[#cf2f3b]">
                                {article.title}
                            </Link>
                            <p className="mt-1 text-sm text-[#667085]">{article.excerpt}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {article.status === 'pending_review' && (
                                <ApprovalActions
                                    approveUrl={route('admin.news.approve', article.uuid)}
                                    rejectUrl={route('admin.news.reject', article.uuid)}
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => confirmAndDelete(route('admin.news.destroy', article.uuid), 'this article')}
                                className="text-sm font-bold text-[#cf2f3b]"
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}
                {articles.length === 0 && <p className="text-[#667085]">No articles match this filter.</p>}
            </div>
        </AdminLayout>
    );
}
