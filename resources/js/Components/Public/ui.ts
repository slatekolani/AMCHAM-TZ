/** Shared class recipes for the public site, so every page speaks one visual language. */

export const btn = {
    primary:
        'inline-flex min-h-12 min-w-0 max-w-full items-center justify-center gap-2.5 whitespace-normal break-words rounded-md bg-crimson px-5 py-3.5 text-center text-sm font-semibold leading-snug text-white shadow-sm transition duration-200 hover:bg-crimson-600 hover:shadow-md active:translate-y-px sm:px-7 [&>svg]:shrink-0',
    primaryLg:
        'inline-flex min-h-14 min-w-0 max-w-full items-center justify-center gap-2.5 whitespace-normal break-words rounded-md bg-crimson px-5 py-4 text-center text-[15px] font-semibold leading-snug text-white shadow-sm transition duration-200 hover:bg-crimson-600 hover:shadow-md active:translate-y-px sm:px-8 [&>svg]:shrink-0',
    dark:
        'inline-flex min-h-12 min-w-0 max-w-full items-center justify-center gap-2.5 whitespace-normal break-words rounded-md bg-navy-800 px-5 py-3.5 text-center text-sm font-semibold leading-snug text-white transition duration-200 hover:bg-navy-700 active:translate-y-px sm:px-7',
    outline:
        'inline-flex min-h-12 min-w-0 max-w-full items-center justify-center gap-2.5 whitespace-normal break-words rounded-md border border-navy-200 px-5 py-3.5 text-center text-sm font-semibold leading-snug text-navy-800 transition duration-200 hover:border-navy-800 hover:bg-navy-50 active:translate-y-px sm:px-7',
    outlineLight:
        'inline-flex min-h-14 min-w-0 max-w-full items-center justify-center gap-2.5 whitespace-normal break-words rounded-md border border-white/30 px-5 py-4 text-center text-[15px] font-semibold leading-snug text-white transition duration-200 hover:border-white hover:bg-white/10 active:translate-y-px sm:px-8',
    ghost:
        'inline-flex min-w-0 max-w-full items-center gap-2 whitespace-normal break-words text-sm font-semibold leading-snug text-navy-800 transition hover:text-crimson',
};

export const eyebrow =
    'inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-caps text-crimson';

export const eyebrowLight =
    'inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-caps text-white/70';

export const eyebrowDot = 'h-px w-8 bg-current';

export const card =
    'rounded-2xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-navy-200 hover:shadow-card-lg';

export const cardStatic = 'rounded-2xl border border-line bg-white shadow-card ring-1 ring-navy-950/[0.015]';

export const sectionPad = 'px-5 py-14 sm:px-8 sm:py-20 lg:py-28';

export const shell = 'mx-auto w-full max-w-shell';
