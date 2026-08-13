import MemberLayout from '@/Layouts/MemberLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { PageProps, Testimonial } from '@/types';
import { confirmAction } from '@/utils/alerts';
import { FormEvent, useState } from 'react';

type TestimonialEditProps = PageProps<{ eligible: boolean; testimonial: Testimonial | null }>;

export default function TestimonialEdit({ eligible, testimonial }: TestimonialEditProps) {
    const [editing, setEditing] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        quote: testimonial?.quote ?? '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (testimonial) {
            put(route('member.testimonial.update'), { onSuccess: () => setEditing(false) });
        } else {
            post(route('member.testimonial.store'), { onSuccess: () => reset() });
        }
    };

    const toggle = async () => {
        if (await confirmAction(
            testimonial?.is_active ? 'Hide this testimonial?' : 'Show this testimonial?',
            testimonial?.is_active ? 'It will be removed from the homepage until you turn it back on.' : 'It will reappear on the homepage.',
            testimonial?.is_active ? 'Yes, hide it' : 'Yes, show it',
        )) {
            router.patch(route('member.testimonial.toggle'));
        }
    };

    const destroy = async () => {
        if (await confirmAction('Delete this testimonial?', 'This cannot be undone. You can write a new one afterwards.', 'Yes, delete it', true)) {
            router.delete(route('member.testimonial.destroy'));
        }
    };

    if (!eligible) {
        return (
            <MemberLayout header={<h1 className="text-3xl font-display font-semibold text-[#14234a]">Testimonial</h1>}>
                <Head title="Member — Testimonial" />
                <p className="max-w-xl text-[#667085]">
                    Homepage testimonials are reserved for companies represented on the AMCHAM Tanzania board. If you believe
                    this is a mistake, contact the Secretariat.
                </p>
            </MemberLayout>
        );
    }

    const showForm = !testimonial || editing;

    return (
        <MemberLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Member portal</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Testimonial</h1>
                </div>
            }
        >
            <Head title="Member — Testimonial" />

            <p className="mb-6 max-w-2xl text-sm text-[#667085]">
                One testimonial per board member company, featured anonymously on the AMCHAM Tanzania homepage — no company
                name, logo or role is shown, just the quote. Publish, edit, hide or delete it any time.
            </p>

            {testimonial && !editing && (
                <div className="max-w-2xl border border-[#d7c8a9] bg-white p-6">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#cf2f3b]">
                        {testimonial.is_active ? 'Live on the homepage' : 'Hidden from the homepage'}
                    </p>
                    <p className="mt-4 font-display text-xl leading-8 text-[#14234a]">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="mt-6 flex flex-wrap gap-5">
                        <button type="button" onClick={() => setEditing(true)} className="text-sm font-bold text-[#14234a] hover:text-[#1e7c89]">
                            Edit
                        </button>
                        <button type="button" onClick={toggle} className="text-sm font-bold text-[#14234a] hover:text-[#1e7c89]">
                            {testimonial.is_active ? 'Hide from homepage' : 'Show on homepage'}
                        </button>
                        <button type="button" onClick={destroy} className="text-sm font-bold text-[#cf2f3b]">
                            Delete
                        </button>
                    </div>
                </div>
            )}

            {showForm && (
                <form onSubmit={submit} className="grid max-w-2xl gap-5 border border-[#d7c8a9] bg-[#fbf8f0] p-6">
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Your testimonial
                        <textarea
                            value={data.quote}
                            onChange={(event) => setData('quote', event.target.value)}
                            maxLength={600}
                            className="min-h-32 border-[#d7c8a9] bg-white"
                            placeholder="What has AMCHAM Tanzania membership meant for your business?"
                            required
                        />
                        {errors.quote && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.quote}</span>}
                    </label>
                    <div className="flex gap-4">
                        <button type="submit" disabled={processing} className="w-fit bg-[#14234a] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60">
                            {testimonial ? 'Save changes' : 'Publish testimonial'}
                        </button>
                        {testimonial && (
                            <button type="button" onClick={() => setEditing(false)} className="px-6 py-3 text-sm font-bold text-[#667085]">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            )}
        </MemberLayout>
    );
}
