import { useEffect, useRef, useState } from 'react';

/**
 * Counts a numeric value up when it scrolls into view, preserving any prefix/suffix
 * (e.g. "$5,000", "150+").
 *
 * Fails open: if IntersectionObserver is missing or never reports, the final value is
 * shown immediately rather than leaving a misleading "0" on screen.
 */
export default function CountUp({ value, duration = 1600, delay = 0 }: { value: string; duration?: number; delay?: number }) {
    const match = value.trim().match(/^([^\d-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/);
    const target = match ? Number(match[2].replace(/,/g, '')) : NaN;
    const decimals = match?.[2].includes('.') ? match[2].split('.')[1].length : 0;
    const [display, setDisplay] = useState(Number.isFinite(target) ? 0 : value);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!Number.isFinite(target) || !ref.current) return;

        if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setDisplay(target);
            return;
        }

        let frame = 0;
        let delayTimer = 0;
        let reported = false;

        const runCount = () => {
            setDisplay(0);
            const start = performance.now();
            const tick = (now: number) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setDisplay(target * eased);
                if (progress < 1) frame = requestAnimationFrame(tick);
                else setDisplay(target);
            };
            frame = requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver(([entry]) => {
            reported = true;
            if (!entry.isIntersecting) return;
            delayTimer = window.setTimeout(runCount, delay);
            observer.disconnect();
        }, { threshold: 0.4 });

        observer.observe(ref.current);

        const failOpen = window.setTimeout(() => {
            if (!reported) setDisplay(target);
        }, 1000);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
            window.clearTimeout(delayTimer);
            window.clearTimeout(failOpen);
        };
    }, [delay, duration, target]);

    if (!match || !Number.isFinite(target)) return <span>{value}</span>;
    const formatted = Number(display).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return <span ref={ref}>{match[1]}{formatted}{match[3]}</span>;
}
