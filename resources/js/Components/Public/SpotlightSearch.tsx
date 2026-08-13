import Icon, { IconName } from '@/Components/Public/Icon';
import { router } from '@inertiajs/react';
import { KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';

type SearchResult = {
    type: string;
    title: string;
    description: string;
    url: string;
    icon: string;
    image?: string | null;
};

const quickLinks: SearchResult[] = [
    { type: 'Quick link', title: 'Member Directory', description: 'Explore companies in the chamber network', url: '/members', icon: 'landmark' },
    { type: 'Quick link', title: 'Upcoming Events', description: 'Forums, briefings and networking opportunities', url: '/events', icon: 'calendar' },
    { type: 'Quick link', title: 'News & Insights', description: 'Business news, policy and member stories', url: '/news', icon: 'document' },
    { type: 'Quick link', title: 'Join the Chamber', description: 'Membership options and benefits', url: '/membership', icon: 'users' },
];

const iconFor = (name: string): IconName => {
    const supported: IconName[] = ['calendar', 'document', 'download', 'landmark', 'users'];
    if (name === 'user') return 'users';
    return supported.includes(name as IconName) ? name as IconName : 'search';
};

export default function SpotlightSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const shownResults = useMemo(() => query.trim().length >= 2 ? results : quickLinks, [query, results]);

    useEffect(() => {
        if (!open) return;
        setQuery('');
        setResults([]);
        setActiveIndex(0);
        document.body.style.overflow = 'hidden';
        const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 60);
        return () => {
            window.clearTimeout(focusTimer);
            document.body.style.overflow = '';
        };
    }, [open]);

    useEffect(() => {
        if (!open || query.trim().length < 2) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        setLoading(true);
        const timer = window.setTimeout(async () => {
            try {
                const response = await fetch(`/site-search?q=${encodeURIComponent(query.trim())}`, {
                    signal: controller.signal,
                    headers: { Accept: 'application/json' },
                });
                const payload = await response.json();
                setResults(payload.results ?? []);
                setActiveIndex(0);
            } catch (error) {
                if (!(error instanceof DOMException && error.name === 'AbortError')) setResults([]);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }, 220);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [open, query]);

    const openResult = (result: SearchResult) => {
        onClose();
        if (result.type === 'Resource') window.location.assign(result.url);
        else router.visit(result.url);
    };

    const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((current) => Math.min(current + 1, shownResults.length - 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((current) => Math.max(current - 1, 0));
        } else if (event.key === 'Enter' && shownResults[activeIndex]) {
            event.preventDefault();
            openResult(shownResults[activeIndex]);
        } else if (event.key === 'Escape') {
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[8vh] sm:pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search AMCHAM Tanzania">
            <button type="button" className="absolute inset-0 cursor-default bg-navy-950/75 backdrop-blur-md animate-fade-in" onClick={onClose} aria-label="Close search" />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-[0_30px_100px_rgba(2,8,23,0.45)] animate-fade-up">
                <div className="flex items-center gap-4 border-b border-line px-5 sm:px-6">
                    <Icon name="search" className="h-6 w-6 shrink-0 text-navy-700" />
                    <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Search members, events, news, resources…"
                        className="h-16 min-w-0 flex-1 border-0 bg-transparent p-0 text-base font-medium text-navy-950 outline-none placeholder:text-ink-faint focus:ring-0 sm:h-[4.5rem] sm:text-lg"
                        aria-label="Search the website"
                        autoComplete="off"
                    />
                    {loading ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy-200 border-t-crimson" aria-label="Searching" />
                    ) : (
                        <button type="button" onClick={onClose} className="rounded-md border border-line bg-mist px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Esc</button>
                    )}
                </div>

                <div className="max-h-[min(62vh,31rem)] overflow-y-auto p-2 sm:p-3">
                    <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-caps text-ink-faint">
                        {query.trim().length >= 2 ? `${results.length} search ${results.length === 1 ? 'result' : 'results'}` : 'Suggested destinations'}
                    </p>

                    {!loading && query.trim().length >= 2 && results.length === 0 && (
                        <div className="px-5 py-12 text-center">
                            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-navy-50 text-navy-700"><Icon name="search" className="h-5 w-5" /></span>
                            <p className="mt-4 font-display text-xl font-semibold text-navy-900">Nothing found yet</p>
                            <p className="mt-2 text-sm text-ink-muted">Try a company, topic, event, sector or resource name.</p>
                        </div>
                    )}

                    <div className="grid gap-1">
                        {shownResults.map((result, index) => (
                            <button
                                key={`${result.type}-${result.url}-${result.title}`}
                                type="button"
                                onClick={() => openResult(result)}
                                onMouseEnter={() => setActiveIndex(index)}
                                className={'group flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition sm:px-4 ' + (index === activeIndex ? 'bg-navy-950 text-white shadow-md' : 'text-navy-900 hover:bg-navy-50')}
                            >
                                <span className={'grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl ' + (index === activeIndex ? 'bg-white/10 text-gold' : 'bg-navy-50 text-navy-700')}>
                                    {result.image ? <img src={result.image} alt="" className="h-full w-full object-cover" /> : <Icon name={iconFor(result.icon)} className="h-5 w-5" />}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className={'block text-[10px] font-semibold uppercase tracking-caps ' + (index === activeIndex ? 'text-gold' : 'text-crimson')}>{result.type}</span>
                                    <span className="mt-0.5 block truncate text-sm font-bold sm:text-base">{result.title}</span>
                                    <span className={'mt-0.5 block truncate text-xs ' + (index === activeIndex ? 'text-white/55' : 'text-ink-faint')}>{result.description}</span>
                                </span>
                                <Icon name="arrow" className={'h-4 w-4 shrink-0 transition ' + (index === activeIndex ? 'translate-x-0 text-white' : '-translate-x-1 text-ink-faint opacity-0 group-hover:translate-x-0 group-hover:opacity-100')} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hidden items-center justify-between border-t border-line bg-mist px-6 py-3 text-[10px] font-medium text-ink-faint sm:flex">
                    <span>AMCHAM Tanzania universal search</span>
                    <span className="flex items-center gap-4"><span>↑↓ Navigate</span><span>↵ Open</span><span>Esc Close</span></span>
                </div>
            </div>
        </div>
    );
}
