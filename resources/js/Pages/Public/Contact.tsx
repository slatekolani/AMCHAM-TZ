import PageHero from '@/Components/Public/PageHero';
import Icon from '@/Components/Public/Icon';
import Reveal from '@/Components/Public/Reveal';
import { btn, cardStatic, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm } from '@inertiajs/react';
import { Page, PageProps } from '@/types';
import { getBlock } from '@/utils/blocks';
import { FormEvent } from 'react';
import { useCms } from '@/utils/cms';

type ContactProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    page: Page | null;
}>;

const inputClasses =
    'rounded-lg border-line bg-white px-4 py-3.5 text-ink shadow-sm placeholder:text-ink-faint focus:border-navy-800 focus:ring-navy-800';

export default function Contact({ canLogin, canRegister, page, flash }: ContactProps) {
    const t = useCms();
    const intro = getBlock(page, 'heading_text');
    const officeHours = getBlock(page, 'fact');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: 'Membership',
        message: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title="Contact AMCHAM Tanzania" />
            <PageHero
                eyebrow="Contact"
                title={intro?.heading ?? 'Talk to AmCham Tanzania.'}
                description={intro?.body ?? 'Membership enquiries, event partnerships, publication submissions and investor support — reach the Secretariat directly.'}
                image={t('contact_hero_image', '/images/amcham-live/hero-minara.jpg')}
                breadcrumb={[{ label: 'Contact Us' }]}
                compact
            />

            <section className={`${sectionPad} bg-mist`}>
                <div className={`${shell} grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12`}>
                    <Reveal>
                        <aside className="grid content-start gap-5">
                            <article className={`${cardStatic} overflow-hidden`}>
                                <div className="bg-navy-950 px-7 py-6 text-white">
                                    <p className="text-xs font-semibold uppercase tracking-caps text-white/60">The Secretariat</p>
                                    <h2 className="mt-2 font-display text-2xl font-semibold">Dar es Salaam, Tanzania</h2>
                                </div>
                                <div className="grid gap-5 p-7">
                                    <p className="leading-7 text-ink-muted">
                                        Membership, trade, investment, partnership and media enquiries — the Secretariat
                                        responds to every message.
                                    </p>
                                    <div className="flex items-start gap-3.5">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-800">
                                            <Icon name="pin" className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Office</p>
                                            <p className="mt-1 font-semibold text-navy-800">Dar es Salaam, Tanzania</p>
                                        </div>
                                    </div>
                                    {officeHours && (
                                        <div className="flex items-start gap-3.5">
                                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-800">
                                                <Icon name="clock" className="h-5 w-5" />
                                            </span>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{officeHours.label}</p>
                                                <p className="mt-1 font-semibold text-navy-800">{officeHours.value}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </article>
                            <article className="rounded-2xl border border-dashed border-navy-200 bg-navy-50 p-7 text-sm leading-7 text-ink-muted">
                                Considering membership? Start with the{' '}
                                <a href="/membership" className="font-semibold text-crimson underline decoration-crimson/30 underline-offset-4">
                                    membership tiers
                                </a>{' '}
                                to find the right fit for your organisation.
                            </article>
                        </aside>
                    </Reveal>

                    <Reveal delay={120}>
                        <form onSubmit={submit} className={`${cardStatic} p-8 lg:p-10`}>
                            <h2 className="font-display text-2xl font-semibold text-navy-800">{t('contact_form_title', 'Send us a message')}</h2>
                            <p className="mt-2 text-sm leading-6 text-ink-muted">Fields marked with an asterisk are required.</p>
                            <div className="mt-8 grid gap-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <label className="grid gap-2 text-sm font-semibold text-navy-800">
                                        Name *
                                        <input
                                            value={data.name}
                                            onChange={(event) => setData('name', event.target.value)}
                                            className={inputClasses}
                                            required
                                        />
                                        {errors.name && <span className="text-xs font-semibold text-crimson">{errors.name}</span>}
                                    </label>
                                    <label className="grid gap-2 text-sm font-semibold text-navy-800">
                                        Email *
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                            className={inputClasses}
                                            required
                                        />
                                        {errors.email && <span className="text-xs font-semibold text-crimson">{errors.email}</span>}
                                    </label>
                                </div>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <label className="grid gap-2 text-sm font-semibold text-navy-800">
                                        Phone
                                        <input
                                            value={data.phone}
                                            onChange={(event) => setData('phone', event.target.value)}
                                            className={inputClasses}
                                        />
                                    </label>
                                    <label className="grid gap-2 text-sm font-semibold text-navy-800">
                                        Enquiry type
                                        <select
                                            value={data.subject}
                                            onChange={(event) => setData('subject', event.target.value)}
                                            className={inputClasses}
                                        >
                                            <option>Membership</option>
                                            <option>Events</option>
                                            <option>Publication</option>
                                            <option>Partnership</option>
                                            <option>Investor support</option>
                                        </select>
                                    </label>
                                </div>
                                <label className="grid gap-2 text-sm font-semibold text-navy-800">
                                    Message *
                                    <textarea
                                        value={data.message}
                                        onChange={(event) => setData('message', event.target.value)}
                                        className={`${inputClasses} min-h-40`}
                                        required
                                    />
                                    {errors.message && <span className="text-xs font-semibold text-crimson">{errors.message}</span>}
                                </label>
                                <div>
                                    <button type="submit" disabled={processing} className={`${btn.primary} disabled:opacity-60`}>
                                        {processing ? 'Sending…' : t('contact_form_button', 'Send message')}
                                        <Icon name="arrow" className="h-4 w-4" />
                                    </button>
                                </div>
                                {flash.success && (
                                    <p className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                                        <Icon name="check" className="h-5 w-5" />
                                        {flash.success}
                                    </p>
                                )}
                            </div>
                        </form>
                    </Reveal>
                </div>
            </section>
        </PublicLayout>
    );
}
