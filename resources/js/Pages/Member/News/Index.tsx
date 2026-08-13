import StatusBadge from '@/Components/Admin/StatusBadge';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link, router } from '@inertiajs/react';
import { NewsArticle, PageProps } from '@/types';
import { confirmAndDelete } from '@/utils/alerts';

type NewsIndexProps = PageProps<{ articles: NewsArticle[] }>;

export default function MemberNewsIndex({ articles }: NewsIndexProps) {
    return (
        <MemberLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Member portal</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">News submissions</h1>
                </div>
            }
        >
            <Head title="Member — News" />

            <div className="mb-5">
                <Link href={route('member.news.create')} className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">
                    New article
                </Link>
            </div>

            <div className="grid gap-3">
                {articles.map((article) => (
                    <article key={article.id} className="grid gap-3 border border-[#d7c8a9] bg-white p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <StatusBadge status={article.status} />
                                <h3 className="text-lg font-bold text-[#14234a]">{article.title}</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                {['draft', 'rejected'].includes(article.status) && (
                                    <>
                                        <Link href={route('member.news.edit', article.uuid)} className="text-sm font-bold text-[#14234a]">
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => router.post(route('member.news.submit', article.uuid), {}, { preserveScroll: true })}
                                            className="text-sm font-bold text-[#1e7c89]"
                                        >
                                            Submit for review
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => confirmAndDelete(route('member.news.destroy', article.uuid), 'this draft')}
                                            className="text-sm font-bold text-[#cf2f3b]"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        {article.status === 'rejected' && article.rejection_reason && (
                            <p className="border border-[#cf2f3b] bg-[#fdeeee] p-3 text-sm text-[#cf2f3b]">
                                Rejected: {article.rejection_reason}
                            </p>
                        )}
                        <p className="text-sm text-[#667085]">{article.excerpt}</p>
                    </article>
                ))}
                {articles.length === 0 && <p className="text-[#667085]">You haven't submitted any articles yet.</p>}
            </div>
        </MemberLayout>
    );
}
