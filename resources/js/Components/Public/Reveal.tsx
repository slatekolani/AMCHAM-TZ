import { PropsWithChildren, useEffect, useRef, useState } from 'react';

type RevealProps = PropsWithChildren<{
    className?: string;
    delay?: number;
    as?: 'div' | 'section' | 'article';
}>;

/**
 * Fades content up once it scrolls into view. Respects prefers-reduced-motion.
 *
 * Fails open: the reveal is purely decorative, so if IntersectionObserver is missing or
 * never reports (restricted renderers, embedded webviews), the content is shown rather
 * than left permanently at opacity 0.
 */
export default function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setVisible(true);
            return;
        }

        // A working observer always delivers an initial entry for an observed node, even when
        // it is off-screen. If nothing arrives, treat the observer as unusable and reveal.
        let reported = false;

        const observer = new IntersectionObserver(
            ([entry]) => {
                reported = true;
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
        );

        observer.observe(node);

        const failOpen = window.setTimeout(() => {
            if (!reported) setVisible(true);
        }, 1000);

        return () => {
            observer.disconnect();
            window.clearTimeout(failOpen);
        };
    }, []);

    return (
        <Tag
            ref={ref as never}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(28px)',
                transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
            }}
        >
            {children}
        </Tag>
    );
}
