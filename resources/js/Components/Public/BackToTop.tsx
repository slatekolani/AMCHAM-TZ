import { useEffect, useState } from 'react';
import Icon from '@/Components/Public/Icon';

/** Distance scrolled before the control is worth offering. */
const REVEAL_AFTER_PX = 600;

/**
 * Fixed bottom-right control that returns the reader to the top.
 *
 * Sits at z-30 deliberately: the cookie notice (z-70), the flash toast and the mobile menu
 * all need to sit above it if they happen to overlap.
 */
export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > REVEAL_AFTER_PX);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const toTop = () => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    };

    return (
        <button
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            // Kept out of the tab order and off the a11y tree while hidden.
            tabIndex={visible ? 0 : -1}
            aria-hidden={!visible}
            className={
                'group fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-full bg-navy-800 text-white shadow-card-lg transition-all duration-300 hover:bg-crimson focus-visible:bg-crimson sm:bottom-8 sm:right-8 sm:h-14 sm:w-14 ' +
                (visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0')
            }
        >
            <Icon name="arrow" className="h-5 w-5 -rotate-90 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </button>
    );
}
