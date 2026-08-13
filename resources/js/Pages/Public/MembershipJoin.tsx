import Icon from '@/Components/Public/Icon';
import PageHero from '@/Components/Public/PageHero';
import { btn, cardStatic, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { MembershipTier, PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { useCms } from '@/utils/cms';

export default function MembershipJoin({ canLogin, canRegister, tier, auth }: PageProps<{ canLogin: boolean; canRegister: boolean; tier: MembershipTier }>) {
    const t = useCms();
    const { data, setData, post, processing, errors } = useForm({
        applicant_name: auth.user?.name ?? '', email: auth.user?.email ?? '', phone: '', company_name: '', job_title: '', sector: '', website: '', logo: null as File | null, notes: '',
        company_profile: '',
        certificate_of_incorporation: null as File | null,
        business_license: null as File | null,
        tin_certificate: null as File | null,
        terms_accepted: false,
    });
    const formatPrice = () => tier.price ? new Intl.NumberFormat('en-US', { style: 'currency', currency: tier.currency, maximumFractionDigits: 0 }).format(Number(tier.price)) : 'Free';
    const field = 'mt-2 w-full rounded-md border-line bg-white px-4 py-3 text-sm focus:border-navy-800 focus:ring-navy-800';
    const submit = (event: FormEvent) => { event.preventDefault(); post(route('membership.join.store', tier.slug)); };
    return <PublicLayout canLogin={canLogin} canRegister={canRegister}>
        <Head title={`Apply for ${tier.name} Membership`} />
        <PageHero eyebrow="Membership application" title={`Continue with ${tier.name}.`} description="Review the exact membership details below, then complete your organisation information." image={t('membership_application_hero_image', '/images/amcham-live/hero-minara.jpg')} breadcrumb={[{ label: 'Membership', href: '/membership' }, { label: `Join ${tier.name}` }]} compact />
        <section className="bg-sand-50 px-5 py-16 sm:px-8 lg:py-24"><div className={`${shell} grid gap-8 lg:grid-cols-[22rem_1fr] lg:gap-12`}>
            <aside className={`${cardStatic} h-fit overflow-hidden lg:sticky lg:top-28`}><div className="bg-navy-800 p-6 text-white"><p className="text-xs font-semibold uppercase tracking-caps text-gold">Your selected tier</p><h2 className="mt-3 text-2xl font-bold">{tier.name}</h2><p className="mt-2 font-display text-3xl font-semibold">{formatPrice()}<span className="text-sm text-white/60"> / {tier.billing_period}</span></p></div><div className="p-6"><p className="text-sm leading-6 text-ink-muted">{tier.description || tier.audience}</p><ul className="mt-5 grid gap-3">{tier.benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-sm text-ink"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{benefit}</li>)}</ul></div></aside>
            <form onSubmit={submit} className={`${cardStatic} grid gap-5 p-6 sm:grid-cols-2 sm:p-8`}><h2 className="font-display text-2xl font-semibold text-navy-800 sm:col-span-2">Applicant and organisation details</h2>
                {([['applicant_name','Full name','text',true],['email','Work email','email',true],['phone','Phone number','tel',true],['company_name','Company / organisation','text',true],['job_title','Job title','text',false],['sector','Business sector','text',false],['website','Company website','url',false]] as const).map(([key,label,type,required]) => <label key={key} className="text-sm font-semibold text-navy-800">{label}{required && <span className="text-crimson"> *</span>}<input type={type} required={required} value={data[key]} onChange={(e) => setData(key,e.target.value)} className={field} />{errors[key] && <span className="mt-1 block text-xs text-crimson">{errors[key]}</span>}</label>)}
                <label className="text-sm font-semibold text-navy-800 sm:col-span-2">Company logo <span className="font-normal text-ink-faint">(JPG, PNG or WebP, maximum 5 MB)</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setData('logo', e.target.files?.[0] ?? null)} className={`${field} file:mr-4 file:border-0 file:bg-navy-50 file:px-4 file:py-2 file:font-semibold file:text-navy-800`} />{errors.logo && <span className="mt-1 block text-xs text-crimson">{errors.logo}</span>}</label>
                <label className="text-sm font-semibold text-navy-800 sm:col-span-2">Company profile <span className="font-normal text-ink-faint">(brief overview of your company's business, products and services)</span><textarea value={data.company_profile} onChange={(e) => setData('company_profile',e.target.value)} className={`${field} min-h-28`} />{errors.company_profile && <span className="mt-1 block text-xs text-crimson">{errors.company_profile}</span>}</label>
                <h3 className="font-display text-lg font-semibold text-navy-800 sm:col-span-2">Company documents</h3>
                {([['certificate_of_incorporation','Certificate of Incorporation'],['business_license','Business Licence'],['tin_certificate','TIN Certificate']] as const).map(([key,label]) => <label key={key} className="text-sm font-semibold text-navy-800">{label}<span className="text-crimson"> *</span> <span className="font-normal text-ink-faint">(PDF, JPG or PNG, maximum 10 MB)</span><input type="file" required accept="application/pdf,image/jpeg,image/png" onChange={(e) => setData(key, e.target.files?.[0] ?? null)} className={`${field} file:mr-4 file:border-0 file:bg-navy-50 file:px-4 file:py-2 file:font-semibold file:text-navy-800`} />{errors[key] && <span className="mt-1 block text-xs text-crimson">{errors[key]}</span>}</label>)}
                <label className="text-sm font-semibold text-navy-800 sm:col-span-2">Additional information<textarea value={data.notes} onChange={(e) => setData('notes',e.target.value)} className={`${field} min-h-28`} />{errors.notes && <span className="mt-1 block text-xs text-crimson">{errors.notes}</span>}</label>
                <label className="flex items-start gap-3 text-sm leading-6 text-ink-muted sm:col-span-2"><input type="checkbox" checked={data.terms_accepted} onChange={(e) => setData('terms_accepted',e.target.checked)} className="mt-1" required /><span>I confirm that I am applying for the <strong>{tier.name}</strong> tier at <strong>{formatPrice()} per {tier.billing_period}</strong> and have reviewed all listed benefits.</span></label>{errors.terms_accepted && <span className="text-xs text-crimson sm:col-span-2">{errors.terms_accepted}</span>}
                <button disabled={processing} className={`${btn.primaryLg} sm:col-span-2 sm:w-fit disabled:opacity-60`}>{processing ? 'Submitting…' : 'Submit Membership Application'}<Icon name="arrow" className="h-4 w-4" /></button>
            </form>
        </div></section>
    </PublicLayout>;
}
