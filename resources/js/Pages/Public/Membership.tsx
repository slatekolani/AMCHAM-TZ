import PageHero from '@/Components/Public/PageHero';
import Icon from '@/Components/Public/Icon';
import Reveal from '@/Components/Public/Reveal';
import { tierAccent } from '@/Components/Public/tierAccent';
import { btn, card, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { MembershipTier, Page, PageProps } from '@/types';
import { getBlock } from '@/utils/blocks';
import { useEffect } from 'react';
import { useCms } from '@/utils/cms';
import Swal from 'sweetalert2';

type MembershipProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    page: Page | null;
    membershipTiers: MembershipTier[];
}>;

function formatPrice(tier: MembershipTier): string {
    if (!tier.price) {
        return 'Free';
    }

    return new Intl.NumberFormat('en-US', { style: 'currency', currency: tier.currency, maximumFractionDigits: 0 }).format(Number(tier.price));
}

export default function Membership({ canLogin, canRegister, page, membershipTiers, flash }: MembershipProps) {
    const t = useCms();
    const intro = getBlock(page, 'heading_text');

    useEffect(() => {
        if (flash.success || flash.error) return;

        Swal.fire({
            icon: 'info',
            title: 'Select your tier to become a member',
            text: 'Review the benefits and price of each membership tier, then select the one that best fits you or your organisation.',
            confirmButtonText: 'View membership tiers',
            confirmButtonColor: '#14234a',
        }).then(() => document.getElementById('membership-tiers')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }, [flash.error, flash.success]);

    return (
        <PublicLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title={page?.meta_title ?? 'AMCHAM Tanzania Membership'} />
            <PageHero
                eyebrow="Membership"
                title={intro?.heading ?? 'Choose a membership path that fits your business ambition.'}
                description={intro?.body ?? 'Membership includes visibility, portal access, event registration, publication opportunities, campaign reach and direct AMCHAM communication.'}
                image={t('membership_hero_image', '/images/amcham-live/hero-minara.jpg')}
                breadcrumb={[{ label: 'Membership' }]}
            />

            <section id="membership-tiers" className={`${sectionPad} scroll-mt-24`}>
                <div className={shell}>
                    <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-semibold uppercase tracking-caps text-crimson">{t('membership_choose_eyebrow', 'Choose your membership')}</p><h2 className="mt-4 font-display text-3xl font-semibold text-navy-800 sm:text-4xl">{t('membership_choose_title', 'Clear benefits. The right level of access.')}</h2><p className="mt-5 text-lg leading-8 text-ink-muted">{t('membership_choose_body', 'Review every benefit and price before starting your application. Your selected tier remains with you while you create or access your account.')}</p></div>
                    <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {membershipTiers.map((tier, index) => { const accent = tierAccent(tier); return <Reveal key={tier.slug} delay={(index % 3) * 80}>
                            <article className={`${card} group relative flex h-full flex-col overflow-hidden p-7 transition hover:-translate-y-1`}>
                                <span className="absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity duration-300 group-hover:opacity-100" style={{ backgroundImage: accent.rule }} />
                                <p className="text-xs font-semibold uppercase tracking-caps" style={{ color: accent.label }}>{tier.name} membership</p>
                                <p className="mt-4 font-display text-4xl font-semibold text-navy-800">{formatPrice(tier)}<span className="ml-1 font-sans text-sm font-medium text-ink-faint">/ {tier.billing_period}</span></p>
                                {tier.audience && <p className="mt-3 text-sm font-semibold text-navy-700">{t('membership_best_for', 'Best for:')} {tier.audience}</p>}
                                <p className="mt-4 text-sm leading-7 text-ink-muted">{tier.description || 'A structured AMCHAM Tanzania membership with access designed for this member category.'}</p>
                                <div className="my-6 h-px bg-line" />
                                <p className="text-xs font-semibold uppercase tracking-caps text-ink-faint">{t('membership_included', 'Everything included')}</p>
                                <ul className="mt-4 grid flex-1 gap-3">{tier.benefits.map((benefit) => <li key={benefit} className="flex items-start gap-3 text-sm leading-6 text-ink"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Icon name="check" className="h-3 w-3" /></span>{benefit}</li>)}</ul>
                                <Link href={route('membership.join', tier.slug)} className={`${btn.primary} mt-7 w-full`}>Join {tier.name}<Icon name="arrow" className="h-4 w-4" /></Link>
                            </article>
                        </Reveal>; })}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
