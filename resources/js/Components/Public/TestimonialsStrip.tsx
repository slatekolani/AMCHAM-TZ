import { useRef, useState } from 'react';
import { Testimonial } from '@/types';
import Reveal from '@/Components/Public/Reveal';
import { card, eyebrow as eyebrowClass, eyebrowDot, sectionPad, shell } from '@/Components/Public/ui';

function QuoteMark() {
    return (
        <svg viewBox="0 0 32 24" aria-hidden="true" className="h-8 w-9 fill-gold/30">
            <path d="M0 24V14.2C0 6.1 4.9 1.1 12.6 0l1.1 3.6C8.9 4.9 6.4 8 6.4 12h6.2V24H0Zm18 0V14.2c0-8.1 4.9-13.1 12.6-14.2l1.1 3.6c-4.8 1.3-7.3 4.4-7.3 8.4h6.2V24H18Z" />
        </svg>
    );
}

export default function TestimonialsStrip({ testimonials, copy = {} }: { testimonials: Testimonial[]; copy?: Record<string, string> }) {
    const [activeCard, setActiveCard] = useState(0);
    const railRef = useRef<HTMLDivElement>(null);

    /** Below lg the cards are a snap rail; keep the indicator in step with the scroll. */
    const trackRail = () => {
        const rail = railRef.current;
        if (!rail) return;
        const railCentre = rail.getBoundingClientRect().left + rail.clientWidth / 2;
        let nearest = 0;
        let shortest = Number.POSITIVE_INFINITY;
        Array.from(rail.children).forEach((el, index) => {
            const box = el.getBoundingClientRect();
            const distance = Math.abs(box.left + box.width / 2 - railCentre);
            if (distance < shortest) {
                shortest = distance;
                nearest = index;
            }
        });
        setActiveCard(nearest);
    };

    const scrollToCard = (index: number) => {
        const rail = railRef.current;
        const el = rail?.children[index] as HTMLElement | undefined;
        if (!rail || !el) return;
        rail.scrollTo({ left: el.offsetLeft - (rail.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
    };

    if (testimonials.length === 0) return null;

    return (
        <section className={`${sectionPad} bg-mist`}>
            <div className={shell}>
                <Reveal className="mx-auto max-w-2xl text-center">
                    <p className={`${eyebrowClass} justify-center`}>
                        <span className={eyebrowDot} />
                        {copy.testimonials_eyebrow || 'In their words'}
                    </p>
                    <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-navy-800 text-balance sm:text-4xl">
                        {copy.testimonials_heading || 'What our board member companies say.'}
                    </h2>
                    <p className="mt-4 text-sm text-ink-faint">
                        {copy.testimonials_subheading || 'Shared in confidence, published anonymously.'}
                    </p>
                </Reveal>

                <div
                    ref={railRef}
                    onScroll={trackRail}
                    className="hide-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-2 sm:mt-14 lg:flex-wrap lg:justify-center lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 lg:snap-none"
                >
                    {testimonials.map((testimonial, index) => (
                        <Reveal
                            key={testimonial.id}
                            delay={(index % 3) * 90}
                            className="w-[85vw] shrink-0 snap-center sm:w-[60vw] lg:w-[calc(33.333%-1rem)] lg:shrink"
                        >
                            <figure className={`${card} flex h-full flex-col p-7 sm:p-8`}>
                                <QuoteMark />
                                <blockquote className="mt-4 flex-1 text-[15px] leading-7 text-ink-muted">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </blockquote>
                                <span aria-hidden="true" className="mt-6 block h-px w-10 bg-gold/50" />
                            </figure>
                        </Reveal>
                    ))}
                </div>

                {testimonials.length > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2.5 lg:hidden">
                        {testimonials.map((testimonial, index) => (
                            <button
                                key={testimonial.id}
                                type="button"
                                onClick={() => scrollToCard(index)}
                                aria-label={`Show testimonial ${index + 1}`}
                                aria-current={index === activeCard}
                                className={
                                    'h-2 rounded-full transition-all duration-300 ' +
                                    (index === activeCard ? 'w-7 bg-crimson' : 'w-2 bg-navy-200 hover:bg-navy-300')
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
