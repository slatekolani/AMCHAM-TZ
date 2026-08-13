import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    const page = usePage<PageProps>();
    const { nav, cms } = page.props;
    const path = page.url.split('?')[0];
    const t = (key: string, fallback: string) => cms?.[key]?.trim() || fallback;
    const managedAuthImage = path.startsWith('/register')
        ? cms?.register_hero_image
        : cms?.login_hero_image;
    const eventImages = Array.from(new Set(
        (nav?.events ?? []).map((event) => event.cover_image_path).filter((image): image is string => Boolean(image)),
    ));
    const authImages = managedAuthImage ? [managedAuthImage] : (eventImages.length > 0 ? eventImages : ['/images/amcham-live/hero-minara.jpg']);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        setImageIndex(0);
        if (authImages.length < 2) return;

        const interval = window.setInterval(() => {
            setImageIndex((current) => (current + 1) % authImages.length);
        }, 5500);

        return () => window.clearInterval(interval);
    }, [authImages.length]);

    return (
        <div className="min-h-screen bg-white text-[#1e293b]">
            <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
                <section className="relative hidden overflow-hidden bg-[#0f2148] text-white lg:block">
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#0f2148_0%,#c8102e_30%,#d4a537_55%,#1b7a3d_75%,#1e6fb8_100%)]" />
                    {authImages.map((image, index) => (
                        <img
                            key={image}
                            src={image}
                            alt=""
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${index === imageIndex ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ))}
                    <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(6,13,29,0.84)_0%,rgba(11,23,48,0.64)_50%,rgba(15,33,72,0.28)_100%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,13,29,0.48)_0%,rgba(6,13,29,0)_48%)]" />
                    <div className="relative flex min-h-screen flex-col p-10 xl:p-14">
                        <Link href="/" className="inline-flex items-center gap-3.5">
                            <img src={cms?.site_logo_image || '/images/brand/amcham-logo.png'} alt="AMCHAM Tanzania" className="h-16 w-auto" />
                            <span className="flex flex-col leading-tight text-white">
                                <span className="text-lg font-bold tracking-tight">{t('auth_brand_name', 'AmCham Tanzania')}</span>
                                <span className="text-xs font-medium text-white/55">{t('auth_brand_descriptor', 'American Chamber of Commerce')}</span>
                            </span>
                        </Link>

                        <div className="my-auto py-12">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                                {t('auth_panel_eyebrow', 'AMCHAM Tanzania platform')}
                            </p>
                            <h1 className="mt-6 max-w-2xl text-4xl font-display font-semibold leading-tight">
                                {t('auth_panel_heading', 'Secure access for members, administrators and chamber staff.')}
                            </h1>
                            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
                                {t('auth_panel_description', 'Manage membership, events, publications, campaigns, approvals and company profiles from one professional platform.')}
                            </p>
                        </div>

                    </div>
                </section>

                <section className="flex min-h-screen flex-col">
                    <header className="flex h-20 items-center justify-between border-b border-[#e2e8f0] px-5 sm:px-8 lg:hidden">
                        <Link href="/">
                            <img src={cms?.site_logo_image || '/images/brand/amcham-logo.png'} alt="AMCHAM Tanzania" className="h-11 w-auto" />
                        </Link>
                        <Link href="/" className="text-sm font-bold text-[#0f2148]">
                            {t('auth_public_site_link', 'Public site')}
                        </Link>
                    </header>

                    <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
                        <div className="w-full max-w-xl">
                            <div className="mb-8 hidden lg:block">
                                <Link href="/" className="text-sm font-bold uppercase tracking-[0.12em] text-[#c8102e]">
                                    {t('auth_return_link', 'Return to public website')}
                                </Link>
                            </div>
                            <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-md sm:p-8">
                                {children}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
