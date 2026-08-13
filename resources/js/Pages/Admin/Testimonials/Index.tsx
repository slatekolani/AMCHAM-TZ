import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps, Testimonial } from '@/types';
import { confirmAndDelete } from '@/utils/alerts';
import { Head } from '@inertiajs/react';

export default function TestimonialsIndex({ testimonials }: PageProps<{ testimonials: Testimonial[] }>) {
    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Content</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Testimonials</h1>
                    <p className="mt-2 max-w-2xl text-sm text-[#667085]">
                        Self-published by board member companies from their Member Portal. Remove anything that shouldn't be public.
                    </p>
                </div>
            }
        >
            <Head title="Admin — Testimonials" />

            <div className="grid gap-4">
                {testimonials.map((testimonial) => (
                    <article key={testimonial.id} className="flex items-start justify-between gap-6 border border-[#d7c8a9] bg-white p-6">
                        <div className="flex items-start gap-4">
                            {testimonial.company?.logo_path ? (
                                <img src={testimonial.company.logo_path} alt={testimonial.company.name} className="h-14 w-14 shrink-0 rounded-md border border-[#eadfc8] object-contain bg-[#fbf8f0] p-1" />
                            ) : (
                                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-md border border-dashed border-[#d7c8a9] bg-[#fbf8f0] text-lg font-display font-semibold text-[#14234a]">
                                    {testimonial.company?.name?.charAt(0) ?? '?'}
                                </div>
                            )}
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.1em] text-[#cf2f3b]">
                                    {testimonial.is_active ? 'Live on homepage' : 'Deactivated by company'}
                                </p>
                                <h2 className="mt-1 font-bold text-[#14234a]">{testimonial.company?.name ?? 'Unknown company'}</h2>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">&ldquo;{testimonial.quote}&rdquo;</p>
                                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#a89a72]">Shown anonymously on the homepage</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => confirmAndDelete(route('admin.testimonials.destroy', testimonial.uuid), `the testimonial from ${testimonial.company?.name ?? 'this company'}`)}
                            className="shrink-0 text-sm font-bold text-[#cf2f3b]"
                        >
                            Delete
                        </button>
                    </article>
                ))}
                {testimonials.length === 0 && <p className="text-[#667085]">No testimonials submitted yet.</p>}
            </div>
        </AdminLayout>
    );
}
