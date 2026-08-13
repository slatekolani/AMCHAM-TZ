import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, PropsWithChildren, useEffect, useState } from 'react';
import { PageProps } from '@/types';
import Icon from '@/Components/Public/Icon';
import { DesktopNav, MobileNavGroups } from '@/Components/Public/MegaNav';
import SweetAlertFeedback from '@/Components/Alerts/SweetAlertFeedback';
import CookieConsent from '@/Components/Public/CookieConsent';
import BackToTop from '@/Components/Public/BackToTop';
import SpotlightSearch from '@/Components/Public/SpotlightSearch';

type PublicLayoutProps = PropsWithChildren<{
    canLogin?: boolean;
    canRegister?: boolean;
    seo?: {
        title?: string;
        description?: string;
        image?: string;
        type?: 'website' | 'article';
        structuredData?: Record<string, unknown>;
    };
}>;

const defaultDescription = 'AMCHAM Tanzania advances trade and investment between the United States and Tanzania through advocacy, events, business insight and a trusted member network.';

const pageSeo: Record<string, { title: string; description: string }> = {
    '/': { title: 'AMCHAM Tanzania', description: defaultDescription },
    '/about-us': { title: 'About AMCHAM Tanzania', description: 'Learn about the American Chamber of Commerce in Tanzania, our mission, leadership and work advancing bilateral commerce.' },
    '/board-members': { title: 'Board Members', description: 'Meet the business leaders guiding AMCHAM Tanzania and strengthening U.S.–Tanzania commercial relationships.' },
    '/membership': { title: 'AMCHAM Tanzania Membership', description: 'Join AMCHAM Tanzania to access advocacy, executive networking, business intelligence and opportunities across Tanzania.' },
    '/events': { title: 'Business Events in Tanzania', description: 'Discover AMCHAM Tanzania events, policy briefings, business forums and networking opportunities in Dar es Salaam and beyond.' },
    '/news': { title: 'News and Business Insights', description: 'Read AMCHAM Tanzania news, policy updates, member stories and insight on trade and investment in Tanzania.' },
    '/members': { title: 'AMCHAM Tanzania Members', description: 'Explore the companies and organizations contributing to the AMCHAM Tanzania business community.' },
    '/resources': { title: 'Business Resources', description: 'Access AMCHAM Tanzania investor guides, policy briefs and resources for doing business in Tanzania.' },
    '/newsletters': { title: 'AMCHAM Tanzania Newsletters', description: 'Read and download AMCHAM Tanzania newsletters featuring chamber news, events, member updates and business insight.' },
    '/gallery': { title: 'AMCHAM Tanzania Gallery', description: 'View highlights from AMCHAM Tanzania events, business forums and community activities.' },
    '/contact-us': { title: 'Contact AMCHAM Tanzania', description: 'Contact the AMCHAM Tanzania Secretariat in Dar es Salaam for membership, partnership and business enquiries.' },
    '/privacy-policy': { title: 'Privacy Policy', description: 'How AMCHAM Tanzania collects, uses and protects personal information.' },
    '/terms-and-conditions': { title: 'Terms & Conditions', description: 'Terms governing use of the AMCHAM Tanzania website and online services.' },
    '/cookie-policy': { title: 'Cookie Policy', description: 'How AMCHAM Tanzania uses cookies and how visitors can manage their choices.' },
};

export default function PublicLayout({ canLogin = true, canRegister = true, seo, children }: PublicLayoutProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { props, url } = usePage<PageProps>();
    const t = (key: string, fallback: string) => props.cms?.[key]?.trim() || fallback;
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({ email: '' });
    const path = url.split('?')[0];
    const defaults = pageSeo[path] ?? pageSeo['/'];
    const seoTitle = seo?.title ?? defaults.title;
    const seoDescription = seo?.description ?? defaults.description;
    const canonical = `${props.seo.baseUrl}${path === '/' ? '' : path}`;
    const seoImage = (seo?.image ?? props.seo.defaultImage).startsWith('http')
        ? (seo?.image ?? props.seo.defaultImage)
        : `${props.seo.baseUrl}${seo?.image ?? props.seo.defaultImage}`;
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': ['Organization', 'ChamberOfCommerce'],
                '@id': `${props.seo.baseUrl}/#organization`,
                name: 'American Chamber of Commerce in Tanzania',
                alternateName: 'AMCHAM Tanzania',
                url: props.seo.baseUrl,
                logo: `${props.seo.baseUrl}/images/brand/amcham-logo-white-bg.png`,
                email: 'info@amcham-tz.com',
                telephone: '+255756937378',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Oyster Pearl Galleria, 1st Floor, Plot 370 Chole Road, Off Toure Drive',
                    addressLocality: 'Dar es Salaam',
                    addressCountry: 'TZ',
                },
                geo: { '@type': 'GeoCoordinates', latitude: -6.754, longitude: 39.282 },
                sameAs: [props.site?.social_linkedin, props.site?.social_facebook, props.site?.social_instagram, props.site?.social_twitter].filter(Boolean),
            },
            {
                '@type': 'WebSite',
                '@id': `${props.seo.baseUrl}/#website`,
                name: props.seo.siteName,
                url: props.seo.baseUrl,
                publisher: { '@id': `${props.seo.baseUrl}/#organization` },
                inLanguage: 'en-TZ',
            },
            ...(seo?.structuredData ? [seo.structuredData] : []),
        ],
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    useEffect(() => {
        const openSearch = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
            if (!typing && ((event.metaKey || event.ctrlKey) && (event.key.toLowerCase() === 'k' || event.code === 'Space'))) {
                event.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', openSearch);
        return () => window.removeEventListener('keydown', openSearch);
    }, []);

    const subscribe = (event: FormEvent) => {
        event.preventDefault();
        post(route('subscribe.store'), { onSuccess: () => reset() });
    };

    return (
        <div className="min-h-screen bg-white text-ink">
            <Head>
                <meta head-key="description" name="description" content={seoDescription} />
                <meta head-key="robots" name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
                <link head-key="canonical" rel="canonical" href={canonical} />
                <meta head-key="og:type" property="og:type" content={seo?.type ?? 'website'} />
                <meta head-key="og:site_name" property="og:site_name" content={props.seo.siteName} />
                <meta head-key="og:title" property="og:title" content={seoTitle} />
                <meta head-key="og:description" property="og:description" content={seoDescription} />
                <meta head-key="og:url" property="og:url" content={canonical} />
                <meta head-key="og:image" property="og:image" content={seoImage} />
                <meta head-key="og:locale" property="og:locale" content="en_TZ" />
                <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
                <meta head-key="twitter:title" name="twitter:title" content={seoTitle} />
                <meta head-key="twitter:description" name="twitter:description" content={seoDescription} />
                <meta head-key="twitter:image" name="twitter:image" content={seoImage} />
                <script head-key="structured-data" type="application/ld+json">{JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>
            </Head>
            {/* Utility bar */}
            <div className="hidden bg-navy-950 text-white md:block">
                <div className="mx-auto flex h-9 max-w-[90rem] items-center justify-end px-5 text-[11px] font-medium tracking-wide text-white/60 sm:px-8 xl:px-10">
                    <div className="flex items-center gap-6">
                      
                        {props.auth.user ? (
                            <Link href={route('dashboard')} className="font-semibold text-white/85 transition hover:text-white">
                                My Dashboard
                            </Link>
                        ) : (
                            canLogin && (
                                <Link href={route('login')} className="font-semibold text-white/85 transition hover:text-white">
                                    {t('nav_login', 'Member Login')}
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Main header */}
            <header
                className={
                    'sticky top-0 z-40 border-b bg-white/95 backdrop-blur-md transition-all duration-300 ' +
                    (scrolled ? 'border-transparent shadow-header' : 'border-line')
                }
            >
                <div className={'mx-auto flex max-w-[90rem] items-center justify-between gap-5 px-5 transition-all duration-300 sm:px-8 xl:gap-7 xl:px-10 2xl:gap-10 ' + (scrolled ? 'h-[4.75rem] lg:h-[5.25rem]' : 'h-24 lg:h-[7.25rem]')}>
                    <Link href="/" className="flex min-w-0 items-center gap-3 sm:gap-3.5">
                        <img
                            src={t('site_logo_image', '/images/brand/amcham-logo.png')}
                            alt="AMCHAM Tanzania"
                            className={'w-auto shrink-0 transition-all duration-300 ' + (scrolled ? 'h-11 lg:h-14' : 'h-14 lg:h-[4.75rem]')}
                        />
                        <span className="flex min-w-0 flex-col leading-tight">
                            <span className={'font-bold tracking-tight text-navy-800 transition-all duration-300 ' + (scrolled ? 'text-[15px] sm:text-base' : 'text-base sm:text-lg')}>
                                {t('brand_name', 'AmCham Tanzania')}
                            </span>
                            <span className="text-[10.5px] font-medium tracking-wide text-ink-faint sm:text-xs">{t('brand_descriptor', 'American Chamber of Commerce')}</span>
                        </span>
                    </Link>

                    <DesktopNav className="hidden shrink-0 xl:flex" />

                    <div className="flex shrink-0 items-center gap-3 xl:gap-4">
                        {props.auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="hidden items-center gap-2 rounded-md border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-800 transition hover:border-navy-800 hover:bg-navy-50 lg:inline-flex"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            canRegister && (
                                <Link
                                    href={route('membership')}
                                    className="hidden whitespace-nowrap items-center gap-2 rounded-md bg-crimson px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-crimson-600 hover:shadow-md sm:inline-flex xl:px-6 xl:py-3"
                                >
                                    Become a Member
                                    <Icon name="arrow" className="h-4 w-4" />
                                </Link>
                            )
                        )}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="group grid h-11 w-11 shrink-0 place-items-center rounded-md border border-line bg-white text-navy-800 shadow-sm transition hover:border-navy-800 hover:bg-navy-950 hover:text-white"
                            type="button"
                            aria-label="Search the website"
                            title="Search (⌘K)"
                        >
                            <Icon name="search" className="h-5 w-5 transition group-hover:scale-110" />
                        </button>
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="grid h-11 w-11 place-items-center rounded-md border border-line text-navy-800 transition hover:border-navy-800 xl:hidden"
                            type="button"
                            aria-label="Open menu"
                        >
                            <Icon name="menu" className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <SpotlightSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* Mobile menu overlay */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm animate-fade-in" onClick={() => setMenuOpen(false)} />
                    <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-card-lg animate-fade-up">
                        <div className="flex h-20 items-center justify-between border-b border-line px-6">
                            <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
                                <img src={t('site_logo_image', '/images/brand/amcham-logo.png')} alt="AMCHAM Tanzania" className="h-12 w-auto" />
                                <span className="flex flex-col leading-tight">
                                    <span className="text-[15px] font-bold tracking-tight text-navy-800">AmCham Tanzania</span>
                                    <span className="text-[10.5px] font-medium tracking-wide text-ink-faint">American Chamber of Commerce</span>
                                </span>
                            </Link>
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-line text-navy-800"
                                type="button"
                                aria-label="Close menu"
                            >
                                <Icon name="close" className="h-5 w-5" />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto px-6 py-6" aria-label="Mobile">
                            <MobileNavGroups onNavigate={() => setMenuOpen(false)} />
                        </nav>
                        <div className="grid gap-3 border-t border-line px-6 py-6">
                            {props.auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center justify-center rounded-md bg-navy-800 px-5 py-3.5 text-sm font-semibold text-white"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link
                                            href={route('membership')}
                                            className="inline-flex items-center justify-center gap-2 rounded-md bg-crimson px-5 py-3.5 text-sm font-semibold text-white"
                                        >
                                            Become a Member
                                            <Icon name="arrow" className="h-4 w-4" />
                                        </Link>
                                    )}
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center justify-center rounded-md border border-navy-200 px-5 py-3.5 text-sm font-semibold text-navy-800"
                                        >
                                            Member Login
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <main>{children}</main>

            <SweetAlertFeedback success={props.flash?.success} error={props.flash?.error} />
            <CookieConsent />
            <BackToTop />

            {/* Footer */}
            <footer className="relative bg-navy-950 text-white">
                <div className="absolute inset-x-0 top-0 h-1 brand-rule" />
                <div className="mx-auto max-w-shell px-5 pb-10 pt-16 sm:px-8 lg:pt-20">
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
                        <div className="md:col-span-2 lg:col-span-4">
                            <div className="flex items-center gap-3.5">
                                <img src={t('site_logo_image', '/images/brand/amcham-logo.png')} alt="AMCHAM Tanzania" className="h-16 w-auto" />
                                <div className="leading-tight">
                                    <p className="text-base font-bold">{t('brand_name', 'AmCham Tanzania')}</p>
                                    <p className="text-xs font-medium text-white/50">{t('brand_descriptor', 'American Chamber of Commerce')}</p>
                                </div>
                            </div>
                            <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
                                Advancing trade and investment between the United States and Tanzania through advocacy,
                                events, publications and a trusted network of member companies.
                            </p>
                            <div className="mt-7 flex items-center gap-3">
                                {props.site?.social_linkedin && <a href={props.site.social_linkedin} target="_blank" rel="noreferrer" aria-label="AMCHAM Tanzania on LinkedIn" className="grid h-11 w-11 place-items-center rounded-full bg-[#0A66C2] text-white shadow-lg transition hover:-translate-y-1 hover:brightness-110"><SocialIcon network="linkedin" /></a>}
                                {props.site?.social_facebook && <a href={props.site.social_facebook} target="_blank" rel="noreferrer" aria-label="AMCHAM Tanzania on Facebook" className="grid h-11 w-11 place-items-center rounded-full bg-[#1877F2] text-white shadow-lg transition hover:-translate-y-1 hover:brightness-110"><SocialIcon network="facebook" /></a>}
                                {props.site?.social_instagram && <a href={props.site.social_instagram} target="_blank" rel="noreferrer" aria-label="AMCHAM Tanzania on Instagram" className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white shadow-lg transition hover:-translate-y-1 hover:brightness-110"><SocialIcon network="instagram" /></a>}
                                {props.site?.social_twitter && <a href={props.site.social_twitter} target="_blank" rel="noreferrer" aria-label="AMCHAM Tanzania on X" className="grid h-11 w-11 place-items-center rounded-full bg-black text-white shadow-lg ring-1 ring-white/20 transition hover:-translate-y-1 hover:bg-zinc-800"><SocialIcon network="x" /></a>}
                            </div>
                            <div className="mt-8">
                                <p className="text-xs font-semibold uppercase tracking-caps text-white/45">{t('footer_stay_informed', 'Stay informed')}</p>
                                <form onSubmit={subscribe} className="mt-4 flex max-w-md overflow-hidden rounded-md border border-white/15 bg-white/5 focus-within:border-white/40">
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        placeholder={t('footer_email_placeholder', 'Your email address')}
                                        className="w-full border-0 bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-white/35 focus:ring-0"
                                    />
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="shrink-0 bg-crimson px-6 text-sm font-semibold text-white transition hover:bg-crimson-600 disabled:opacity-60"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                                {errors.email && <p className="mt-2 text-xs font-semibold text-red-300">{errors.email}</p>}
                                {wasSuccessful && <p className="mt-2 text-xs font-semibold text-emerald-400">{t('footer_subscribe_success', 'Subscribed — thank you.')}</p>}
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-caps text-gold">{t('footer_quick_links', 'Quick Links')}</p>
                                <div className="mt-5 grid gap-3.5 text-sm font-medium text-white/65">
                                    <Link href="/about-us" className="transition hover:text-white">{t('nav_about', 'About')}</Link>
                                    <Link href="/contact-us" className="transition hover:text-white">{t('nav_contact', 'Contact')}</Link>
                                    <Link href="/membership" className="transition hover:text-white">{t('nav_membership', 'Membership')}</Link>
                                    <Link href="/events" className="transition hover:text-white">{t('nav_events', 'Events')}</Link>
                                    <Link href="/news" className="transition hover:text-white">{t('nav_news', 'Newsroom')}</Link>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-3">
                            <p className="text-xs font-semibold uppercase tracking-caps text-gold">{t('footer_useful_links', 'Useful Links')}</p>
                            <div className="mt-5 grid gap-3.5 text-sm font-medium leading-6 text-white/65">
                                <a href="https://www.uschamber.com/" target="_blank" rel="noreferrer" className="transition hover:text-white">U.S. Chamber of Commerce</a>
                                <a href="https://tz.usembassy.gov/" target="_blank" rel="noreferrer" className="transition hover:text-white">U.S. Embassy in Tanzania</a>
                                <a href="https://www.ustda.gov/" target="_blank" rel="noreferrer" className="transition hover:text-white">U.S. Trade and Development Agency (USTDA)</a>
                                <a href="https://www.viwanda.go.tz/" target="_blank" rel="noreferrer" className="transition hover:text-white">Ministry of Industry and Trade Tanzania</a>
                            </div>
                        </div>
                        <div className="lg:col-span-3">
                            <p className="text-xs font-semibold uppercase tracking-caps text-gold">{t('footer_contact', 'Get in touch')}</p>
                            <div className="mt-5 grid gap-4 text-sm font-medium leading-6 text-white/65">
                                {props.site?.contact_phone && <a href={`tel:${props.site.contact_phone.replace(/\s+/g, '')}`} className="flex items-start gap-3 transition hover:text-white"><Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />{props.site.contact_phone}</a>}
                                {props.site?.contact_email && <a href={`mailto:${props.site.contact_email}`} className="flex items-start gap-3 transition hover:text-white"><Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />{props.site.contact_email}</a>}
                                {props.site?.contact_address && <p className="flex items-start gap-3"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-crimson" /><span>{props.site.contact_address}</span></p>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-7 text-xs font-medium text-white/40 sm:flex-row sm:items-center">
                        <div>
                            <p>© {new Date().getFullYear()} {t('footer_copyright', 'American Chamber of Commerce in Tanzania. All rights reserved.')}</p>
                            <nav className="mt-3 flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal">
                                <Link href="/privacy-policy" className="transition hover:text-white">{t('footer_privacy', 'Privacy Policy')}</Link>
                                <Link href="/terms-and-conditions" className="transition hover:text-white">{t('footer_terms', 'Terms & Conditions')}</Link>
                                <Link href="/cookie-policy" className="transition hover:text-white">{t('footer_cookies', 'Cookie Policy')}</Link>
                                <button type="button" onClick={() => window.dispatchEvent(new Event('amcham:cookie-settings'))} className="transition hover:text-white">{t('footer_cookie_settings', 'Cookie settings')}</button>
                            </nav>
                        </div>
                        <div className="flex flex-col items-start gap-2 sm:items-end">
                            <p className="inline-flex items-center gap-2">
                                <Icon name="landmark" className="h-4 w-4" />
                                Connecting U.S. and Tanzanian business
                            </p>
                            <p>
                                Developed by{' '}
                                <a
                                    href="https://nextbyte.co.tz/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-white/65 transition hover:text-gold"
                                >
                                    NextByte iCT Solutions
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function SocialIcon({ network }: { network: 'linkedin' | 'facebook' | 'instagram' | 'x' }) {
    if (network === 'linkedin') return <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.371 4.267 5.455v6.286ZM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126ZM7.119 20.452H3.555V9h3.564v11.452Z" /></svg>;
    if (network === 'facebook') return <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.414c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.974H15.83c-1.491 0-1.956.932-1.956 1.889v2.257h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" /></svg>;
    if (network === 'instagram') return <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" /></svg>;
    return <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true"><path d="M18.9 3H22l-6.8 7.8L23.2 21H17l-4.9-6.4L6.5 21H3.3l7.3-8.4L2.9 3h6.4l4.4 5.8L18.9 3Zm-1.1 16h1.7L8.4 4.9H6.6L17.8 19Z" /></svg>;
}
