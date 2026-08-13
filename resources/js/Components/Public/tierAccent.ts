/**
 * Membership tiers are named after metals, so each one carries its own metal tone instead of
 * the shared five-colour brand rule. The rule stays a section-level device; repeating it on
 * every card turned it into noise and flattened the hierarchy between tiers.
 *
 * Values are inline styles rather than Tailwind classes because the tone is data-driven and
 * arbitrary class names would not survive the JIT purge.
 */
export type TierAccent = {
    /** Two-stop metallic sweep for the card's top rule. */
    rule: string;
    /** Solid tone for the medallion and small marks. */
    mark: string;
    /** Readable label colour on a white card. */
    label: string;
};

const ACCENTS: Record<string, TierAccent> = {
    platinum: {
        rule: 'linear-gradient(90deg, #6B7A8F 0%, #C3CBD6 45%, #8A97A8 100%)',
        mark: '#8A97A8',
        label: '#4A5768',
    },
    gold: {
        rule: 'linear-gradient(90deg, #A9791C 0%, #E3C05C 48%, #C9A227 100%)',
        mark: '#C9A227',
        label: '#8A6A12',
    },
    silver: {
        rule: 'linear-gradient(90deg, #8C949F 0%, #D2D8E0 48%, #A3ABB6 100%)',
        mark: '#A3ABB6',
        label: '#5C6672',
    },
    bronze: {
        rule: 'linear-gradient(90deg, #8A5524 0%, #C98F5B 48%, #A9682F 100%)',
        mark: '#A9682F',
        label: '#7A4C20',
    },
};

/** Anything without a metal name (Associate, Individual, …) falls back to the house navy. */
const DEFAULT_ACCENT: TierAccent = {
    rule: 'linear-gradient(90deg, #0F2148 0%, #3B5E97 50%, #173463 100%)',
    mark: '#24457C',
    label: '#173463',
};

export function tierAccent(tier: { slug?: string | null; name?: string | null } = {}): TierAccent {
    const key = `${tier.slug ?? ''} ${tier.name ?? ''}`.toLowerCase();

    for (const [metal, accent] of Object.entries(ACCENTS)) {
        if (key.includes(metal)) return accent;
    }

    return DEFAULT_ACCENT;
}
