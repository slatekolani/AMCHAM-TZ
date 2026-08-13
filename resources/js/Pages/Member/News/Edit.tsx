import RichTextEditor from '@/Components/Admin/RichTextEditor';
import CoverImageUpload from '@/Components/CoverImageUpload';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, useForm } from '@inertiajs/react';
import { NewsArticle, PageProps } from '@/types';
import { FormEvent } from 'react';

type NewsEditProps = PageProps<{ article: NewsArticle | null }>;

export default function MemberNewsEdit({ article }: NewsEditProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: article ? 'put' : undefined,
        title: article?.title ?? '',
        excerpt: article?.excerpt ?? '',
        body: article?.body ?? '',
        cover_image: null as File | null,
        category: article?.category ?? '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(article ? route('member.news.update', article.uuid) : route('member.news.store'), { forceFormData: true });
    };

    return (
        <MemberLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Member portal</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">{article ? 'Edit draft' : 'New article'}</h1>
                </div>
            }
        >
            <Head title="Member — Edit article" />

            <form onSubmit={submit} className="grid max-w-4xl gap-5">
                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Title
                    <input value={data.title} onChange={(event) => setData('title', event.target.value)} className="border-[#d7c8a9]" />
                    {errors.title && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.title}</span>}
                </label>

                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Excerpt
                    <textarea value={data.excerpt} onChange={(event) => setData('excerpt', event.target.value)} className="min-h-20 border-[#d7c8a9]" />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Category
                        <input value={data.category} onChange={(event) => setData('category', event.target.value)} className="border-[#d7c8a9]" />
                    </label>
                    <CoverImageUpload currentImage={article?.cover_image_path} error={errors.cover_image} onChange={(file) => setData('cover_image', file)} />
                </div>

                <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                    Body
                    <RichTextEditor value={data.body} onChange={(html) => setData('body', html)} />
                    {errors.body && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.body}</span>}
                </label>

                <p className="text-sm text-[#667085]">
                    Saving keeps this as a draft only you can see. Submit it for review from the News submissions list when ready.
                </p>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-fit bg-[#14234a] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60"
                >
                    Save draft
                </button>
            </form>
        </MemberLayout>
    );
}
