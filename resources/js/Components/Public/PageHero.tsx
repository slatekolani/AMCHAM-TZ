import { Link } from '@inertiajs/react';
import { eyebrowDot, eyebrowLight, shell } from '@/Components/Public/ui';

type PageHeroProps = {
    eyebrow: string;
    title: string;
    description?: string;
    image?: string;
    breadcrumb?: { label: string; href?: string }[];
    compact?: boolean;
};

export default function PageHero({
    eyebrow,
    title,
    description,
    image = '/images/amcham-live/boards.jpg',
    breadcrumb,
    compact = false,
}: PageHeroProps) {
    return (
        <section className="relative overflow-hidden bg-navy-950 text-white">
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover animate-slow-zoom" />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(6,13,29,0.94)_0%,rgba(11,23,48,0.80)_48%,rgba(15,33,72,0.30)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,13,29,0.48)_0%,rgba(6,13,29,0)_48%)]" />
            <div aria-hidden="true" className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-white/10 sm:h-[30rem] sm:w-[30rem]" />
            <div aria-hidden="true" className="absolute right-12 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full border border-gold/20 sm:h-72 sm:w-72" />
            <div className="absolute inset-x-0 bottom-0 h-1 brand-rule" />

            <div className={`${shell} relative px-5 sm:px-8 ${compact ? 'py-16 sm:py-20 lg:py-24' : 'py-20 sm:py-24 lg:py-32'}`}>
                {breadcrumb && breadcrumb.length > 0 && (
                    <nav aria-label="Breadcrumb" className="mb-8 animate-fade-up">
                        <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/50">
                            <li>
                                <Link href="/" className="transition hover:text-white">Home</Link>
                            </li>
                            {breadcrumb.map((item) => (
                                <li key={item.label} className="flex items-center gap-2">
                                    <span aria-hidden="true">/</span>
                                    {item.href ? (
                                        <Link href={item.href} className="transition hover:text-white">{item.label}</Link>
                                    ) : (
                                        <span className="text-white/80">{item.label}</span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                <p className={`${eyebrowLight} animate-fade-up rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm`}>
                    <span className={eyebrowDot} />
                    {eyebrow}
                </p>
                <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance animate-fade-up-delay-1 sm:text-5xl lg:text-[3.4rem]">
                    {title}
                </h1>
                {description && (
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70 animate-fade-up-delay-2">{description}</p>
                )}
                <div className="mt-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-caps text-white/40 animate-fade-up-delay-2">
                    <span className="h-px w-10 bg-gold" />
                    U.S.–Tanzania business network
                </div>
            </div>
        </section>
    );
}
