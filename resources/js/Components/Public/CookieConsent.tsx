import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type CookieChoice = 'essential' | 'all';

const storageKey = 'amcham-cookie-consent';

export default function CookieConsent() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(!window.localStorage.getItem(storageKey));
        const showSettings = () => setOpen(true);
        window.addEventListener('amcham:cookie-settings', showSettings);
        return () => window.removeEventListener('amcham:cookie-settings', showSettings);
    }, []);

    const choose = (choice: CookieChoice) => {
        window.localStorage.setItem(storageKey, JSON.stringify({ choice, savedAt: new Date().toISOString() }));
        setOpen(false);
    };

    if (!open) return null;

    return (
        <section className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-4xl border border-white/15 bg-navy-950 p-6 text-white shadow-2xl sm:bottom-6 sm:p-7" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-caps text-gold">Your privacy choices</p>
                    <h2 id="cookie-title" className="mt-2 font-display text-2xl font-semibold">We use cookies thoughtfully.</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                        Essential cookies keep the website secure and working. With your permission, optional analytics cookies may help us understand how the site is used. Read our <Link href="/cookie-policy" className="font-semibold text-white underline underline-offset-4">Cookie Policy</Link>.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={() => choose('essential')} className="border border-white/30 px-5 py-3 text-sm font-semibold transition hover:bg-white/10">Essential only</button>
                    <button type="button" onClick={() => choose('all')} className="bg-crimson px-5 py-3 text-sm font-semibold transition hover:bg-crimson-600">Accept all</button>
                </div>
            </div>
        </section>
    );
}
