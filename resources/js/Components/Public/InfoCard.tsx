import { PropsWithChildren } from 'react';

type InfoCardProps = PropsWithChildren<{
    title?: string;
    eyebrow?: string;
    className?: string;
    hover?: boolean;
}>;

export default function InfoCard({ title, eyebrow, className = '', hover = true, children }: InfoCardProps) {
    return (
        <article
            className={
                'rounded-2xl border border-line bg-white p-7 shadow-card transition duration-300 ' +
                (hover ? 'hover:-translate-y-1 hover:shadow-card-lg ' : '') +
                className
            }
        >
            {eyebrow && <p className="text-xs font-semibold uppercase tracking-caps text-crimson">{eyebrow}</p>}
            {title && <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-navy-800">{title}</h3>}
            <div className={title || eyebrow ? 'mt-4 leading-7 text-ink-muted' : 'leading-7 text-ink-muted'}>{children}</div>
        </article>
    );
}
