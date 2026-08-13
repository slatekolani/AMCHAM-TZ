import { router } from '@inertiajs/react';
import Icon from '@/Components/Public/Icon';

type PaginationProps = {
    currentPage: number;
    lastPage: number;
    /** Query params to preserve (category, q, ...) — page is added automatically. */
    params?: Record<string, string | null | undefined>;
    /** Base path to visit, defaults to the current path. */
    href?: string;
};

/** Builds the compact page-number sequence with `…` gaps, e.g. 1 … 4 5 6 … 12. */
function buildPageList(current: number, last: number): (number | 'gap')[] {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

    const pages = new Set<number>([1, last, current, current - 1, current + 1]);
    const sorted = Array.from(pages)
        .filter((page) => page >= 1 && page <= last)
        .sort((a, b) => a - b);

    const withGaps: (number | 'gap')[] = [];
    sorted.forEach((page, index) => {
        if (index > 0 && page - sorted[index - 1] > 1) withGaps.push('gap');
        withGaps.push(page);
    });
    return withGaps;
}

export default function Pagination({ currentPage, lastPage, params = {}, href }: PaginationProps) {
    if (lastPage <= 1) return null;

    const go = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) return;
        const query: Record<string, string> = {};
        Object.entries(params).forEach(([key, value]) => {
            if (value) query[key] = value;
        });
        if (page > 1) query.page = String(page);
        router.get(href ?? window.location.pathname, query, { preserveScroll: false, preserveState: true });
    };

    const pages = buildPageList(currentPage, lastPage);

    return (
        <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-1.5">
            <button
                type="button"
                onClick={() => go(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-navy-800 transition hover:border-navy-800 hover:bg-mist disabled:pointer-events-none disabled:opacity-30"
            >
                <Icon name="arrow" className="h-4 w-4 rotate-180" />
            </button>

            {pages.map((page, index) =>
                page === 'gap' ? (
                    <span key={`gap-${index}`} className="px-2 text-sm font-medium text-ink-faint">
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        onClick={() => go(page)}
                        aria-current={page === currentPage ? 'page' : undefined}
                        className={
                            'grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition ' +
                            (page === currentPage ? 'bg-navy-800 text-white' : 'text-navy-800 hover:bg-mist')
                        }
                    >
                        {page}
                    </button>
                ),
            )}

            <button
                type="button"
                onClick={() => go(currentPage + 1)}
                disabled={currentPage === lastPage}
                aria-label="Next page"
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-navy-800 transition hover:border-navy-800 hover:bg-mist disabled:pointer-events-none disabled:opacity-30"
            >
                <Icon name="arrow" className="h-4 w-4" />
            </button>
        </nav>
    );
}
