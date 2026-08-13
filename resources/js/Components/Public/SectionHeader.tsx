import { eyebrow as eyebrowClass, eyebrowDot } from '@/Components/Public/ui';

type SectionHeaderProps = {
    eyebrow: string;
    title: string;
    description?: string;
    align?: 'left' | 'center';
};

export default function SectionHeader({ eyebrow, title, description, align = 'left' }: SectionHeaderProps) {
    if (align === 'center') {
        return (
            <div className="mx-auto max-w-2xl text-center">
                <p className={`${eyebrowClass} justify-center`}>
                    <span className={eyebrowDot} />
                    {eyebrow}
                    <span className={eyebrowDot} />
                </p>
                <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-navy-800 text-balance sm:text-4xl">
                    {title}
                </h2>
                {description && <p className="mt-5 text-lg leading-8 text-ink-muted">{description}</p>}
            </div>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-16">
            <div>
                <p className={eyebrowClass}>
                    <span className={eyebrowDot} />
                    {eyebrow}
                </p>
                <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-navy-800 text-balance sm:text-4xl">
                    {title}
                </h2>
            </div>
            {description && <p className="max-w-2xl text-lg leading-8 text-ink-muted">{description}</p>}
        </div>
    );
}
