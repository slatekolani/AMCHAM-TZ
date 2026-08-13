import Icon from '@/Components/Public/Icon';
import PageHero from '@/Components/Public/PageHero';
import Reveal from '@/Components/Public/Reveal';
import CountUp from '@/Components/Public/CountUp';
import TrendChart, { TrendChartData } from '@/Components/Public/TrendChart';
import { cardStatic, sectionPad, shell } from '@/Components/Public/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { EconomicStat, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useCms } from '@/utils/cms';

type EconomicDataProps = PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    pageMode: 'trade' | 'investment';
    featured: EconomicStat[];
    more: EconomicStat[];
    charts: TrendChartData[];
}>;

function SourceLine({ stat }: { stat: EconomicStat }) {
    if (!stat.source && !stat.period) return null;
    return (
        <p className="mt-3 text-xs text-ink-faint">
            {stat.source && (
                <>
                    Source:{' '}
                    {stat.source_url ? (
                        <a href={stat.source_url} target="_blank" rel="noreferrer" className="underline hover:text-crimson">
                            {stat.source}
                        </a>
                    ) : (
                        stat.source
                    )}
                </>
            )}
            {stat.source && stat.period && ' · '}
            {stat.period}
        </p>
    );
}

export default function EconomicData({ canLogin, canRegister, pageMode, featured, more, charts }: EconomicDataProps) {
    const t = useCms();
    const isTrade = pageMode === 'trade';

    const copy = isTrade
        ? {
              eyebrow: t('trade_hero_eyebrow', 'Trade Data'),
              title: t('trade_hero_title', 'U.S.–Tanzania trade at a glance.'),
              description: t(
                  'trade_hero_description',
                  'Bilateral trade-in-goods and services figures between the United States and Tanzania, compiled from official government and multilateral sources.',
              ),
              image: t('trade_hero_image', '/images/amcham-live/tic-news.jpg'),
              empty: 'Trade figures for this page are being compiled and will be published shortly.',
          }
        : {
              eyebrow: t('investment_hero_eyebrow', 'Investment Data'),
              title: t('investment_hero_title', 'U.S.–Tanzania investment at a glance.'),
              description: t(
                  'investment_hero_description',
                  'Foreign direct investment flows and stock between the United States and Tanzania, compiled from official government and multilateral sources.',
              ),
              image: t('investment_hero_image', '/images/amcham-live/boards.jpg'),
              empty: 'Investment figures for this page are being compiled and will be published shortly.',
          };

    return (
        <PublicLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title={isTrade ? 'AMCHAM Tanzania Trade Data' : 'AMCHAM Tanzania Investment Data'} />
            <PageHero
                eyebrow={copy.eyebrow}
                title={copy.title}
                description={copy.description}
                image={copy.image}
                breadcrumb={[{ label: 'Data' }, { label: isTrade ? 'Trade' : 'Investment' }]}
                compact
            />

            <section className={`${sectionPad} bg-mist`}>
                <div className={shell}>
                    <div className="mb-10 flex flex-wrap items-center gap-3">
                        {(
                            [
                                ['/trade', 'Trade', isTrade],
                                ['/investment', 'Investment', !isTrade],
                            ] as const
                        ).map(([href, label, active]) => (
                            <Link
                                key={href}
                                href={href}
                                className={
                                    'rounded-full border px-5 py-2 text-sm font-semibold transition ' +
                                    (active ? 'border-navy-800 bg-navy-800 text-white' : 'border-line bg-white text-navy-800 hover:border-navy-800')
                                }
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {featured.length === 0 && more.length === 0 && charts.length === 0 && (
                        <p className="text-ink-muted">{copy.empty}</p>
                    )}

                    {featured.length > 0 && (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {featured.map((stat, index) => (
                                <Reveal key={stat.id} delay={(index % 3) * 100}>
                                    <div className={`${cardStatic} relative h-full overflow-hidden p-7`}>
                                        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-crimson via-gold to-navy-700" />
                                        <p className="font-display text-4xl font-semibold tabular-nums text-navy-900">
                                            <CountUp value={stat.value} duration={1700} delay={index * 150} />
                                        </p>
                                        <p className="mt-2 text-sm font-bold text-navy-800">{stat.label}</p>
                                        {stat.description && <p className="mt-3 text-sm leading-6 text-ink-muted">{stat.description}</p>}
                                        <SourceLine stat={stat} />
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    )}

                    {charts.length > 0 && (
                        <div className={`grid gap-8 lg:grid-cols-2 ${featured.length > 0 ? 'mt-14' : ''}`}>
                            {charts.map((chart) => (
                                <Reveal key={chart.title}>
                                    <TrendChart {...chart} />
                                </Reveal>
                            ))}
                        </div>
                    )}

                    {more.length > 0 && (
                        <Reveal className={featured.length > 0 || charts.length > 0 ? 'mt-14' : ''}>
                            <h2 className="font-display text-2xl font-semibold text-navy-900">More {isTrade ? 'trade' : 'investment'} data</h2>
                            <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
                                {more.map((stat) => (
                                    <div key={stat.id} className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-navy-800">{stat.label}</p>
                                            {stat.description && <p className="mt-1 text-sm leading-6 text-ink-muted">{stat.description}</p>}
                                            <SourceLine stat={stat} />
                                        </div>
                                        <p className="shrink-0 font-display text-2xl font-semibold tabular-nums text-navy-900 sm:text-right">
                                            {stat.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    )}
                </div>
            </section>

            <section className="bg-navy-950 px-5 py-14 text-white sm:px-8">
                <div className={`${shell} flex flex-col gap-7 md:flex-row md:items-center md:justify-between`}>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-caps text-gold">Have a question about this data?</p>
                        <h2 className="mt-3 font-display text-3xl font-semibold">Talk to the AMCHAM Secretariat.</h2>
                    </div>
                    <Link href="/contact-us" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-crimson px-6 py-3 text-sm font-semibold text-white">
                        Connect with the Secretariat <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
