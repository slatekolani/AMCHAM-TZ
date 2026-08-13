import { Link } from '@inertiajs/react';
import { MembershipTier } from '@/types';
import Icon from '@/Components/Public/Icon';
import Reveal from '@/Components/Public/Reveal';
import { btn, eyebrowDot, eyebrowLight, shell } from '@/Components/Public/ui';

function formatPrice(value: number, currency: string): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

/**
 * Closing section. Replaces the usual "Ready to grow?" slogan with the thing a prospective
 * member actually needs: what it costs, what happens after they apply, and what they get.
 */
export default function JoinPathway({ tiers = [], copy = {} }: { tiers?: MembershipTier[]; copy?: Record<string, string> }) {
    const priced = tiers.filter((tier) => Number(tier.price) > 0);
    const currency = priced[0]?.currency ?? 'USD';
    const prices = priced.map((tier) => Number(tier.price));
    const lowest = prices.length ? Math.min(...prices) : null;
    const tierCount = tiers.length;

    const pricedStepBody = copy.join_step_1_body
        ? copy.join_step_1_body.replaceAll('{tier_count}', String(tierCount)).replaceAll('{lowest_price}', lowest !== null ? formatPrice(lowest, currency) : '')
        : null;
    const steps = [
        {
            title: copy.join_step_1_title || 'Choose your tier',
            body:
                pricedStepBody || (lowest !== null && tierCount > 0
                    ? `${tierCount} membership tiers, starting at ${formatPrice(lowest, currency)} a year — matched to the size and ambition of your organisation.`
                    : 'Membership tiers are matched to the size and ambition of your organisation.'),
            href: '/membership',
            linkLabel: copy.join_step_1_link || 'Compare tiers',
        },
        {
            title: copy.join_step_2_title || 'Submit your application',
            body: copy.join_step_2_body || 'A short application on the tier of your choice. Every submission is reviewed by the AmCham Secretariat, and we come back to you directly.',
            href: '/membership',
            linkLabel: copy.join_step_2_link || 'Start an application',
        },
        {
            title: copy.join_step_3_title || 'Take your seat',
            body: copy.join_step_3_body || 'Your company joins the member directory, gains event access, embassy briefings, policy roundtables and a platform to publish your own news.',
            href: '/members',
            linkLabel: copy.join_step_3_link || 'See the directory',
        },
    ];

    return (
        <section className="relative overflow-hidden bg-navy-950 text-white">
            <div className="absolute inset-x-0 top-0 h-1 brand-rule" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                    backgroundImage:
                        'radial-gradient(52rem 30rem at 85% 10%, rgba(59,94,151,0.30) 0%, transparent 70%), radial-gradient(44rem 26rem at 8% 92%, rgba(200,16,46,0.14) 0%, transparent 72%)',
                }}
            />

            <div className={`${shell} relative px-5 py-14 sm:px-8 sm:py-20 lg:py-28`}>
                <Reveal className="max-w-3xl">
                    <p className={eyebrowLight}>
                        <span className={eyebrowDot} />
                        {copy.join_eyebrow || 'How to join'}
                    </p>
                    <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-[2.9rem]">
                        {copy.join_heading || 'Three steps to a seat at the table.'}
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-white/65">
                        {copy.join_body || 'Membership is open to companies of every size operating between the United States and Tanzania — and to the individuals who advise them.'}
                    </p>
                </Reveal>

                <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-3">
                    {steps.map((step, index) => (
                        <li key={step.title} className="bg-navy-950/85 backdrop-blur-sm">
                            <Reveal delay={index * 90} className="flex h-full flex-col p-8 lg:p-9">
                                <span className="font-display text-4xl font-semibold text-gold">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span aria-hidden="true" className="mt-5 block h-px w-10 bg-white/20" />
                                <h3 className="mt-5 font-display text-xl font-semibold text-white">{step.title}</h3>
                                <p className="mt-3 flex-1 text-sm leading-7 text-white/60">{step.body}</p>
                                <Link
                                    href={step.href}
                                    className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-gold"
                                >
                                    {step.linkLabel}
                                    <Icon name="arrow" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                            </Reveal>
                        </li>
                    ))}
                </ol>

                <Reveal delay={160} className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-9 sm:flex-row sm:items-center">
                    <p className="max-w-md text-sm leading-7 text-white/55">
                        {copy.join_help || 'Not sure which tier fits? The Secretariat will walk you through it — no commitment.'}
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Link href="/membership" className={btn.primaryLg}>
                            {copy.join_primary_button || 'Start your application'}
                            <Icon name="arrow" className="h-4 w-4" />
                        </Link>
                        <Link href="/contact-us" className={btn.outlineLight}>
                            {copy.join_secondary_button || 'Talk to the Secretariat'}
                        </Link>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
