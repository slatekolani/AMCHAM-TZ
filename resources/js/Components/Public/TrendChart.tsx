import { useMemo, useState } from 'react';

export type TrendPoint = { period: string; value: number };
export type TrendSeries = { label: string; data: TrendPoint[] };
export type TrendChartData = {
    title: string;
    prefix: string | null;
    suffix: string | null;
    series: TrendSeries[];
};

const COLORS = ['#C8102E', '#173463', '#C9A227', '#3B5E97'];

const MIN_WIDTH = 640;
const POINT_SPACING = 62;
const HEIGHT = 320;
const PAD_LEFT = 56;
const PAD_RIGHT = 20;
const PAD_TOP = 24;
const PAD_BOTTOM = 40;

function formatValue(value: number, prefix: string | null, suffix: string | null): string {
    const formatted = value.toLocaleString('en-US', { maximumFractionDigits: 1 });
    return `${prefix ?? ''}${formatted}${suffix ?? ''}`;
}

export default function TrendChart({ title, prefix, suffix, series }: TrendChartData) {
    const [hovered, setHovered] = useState<{ seriesIndex: number; pointIndex: number } | null>(null);

    const periods = useMemo(() => {
        const all = new Set<string>();
        series.forEach((line) => line.data.forEach((point) => all.add(point.period)));
        return Array.from(all).sort((a, b) => {
            const numA = Number(a);
            const numB = Number(b);
            if (Number.isFinite(numA) && Number.isFinite(numB)) return numA - numB;
            return a.localeCompare(b);
        });
    }, [series]);

    const values = series.flatMap((line) => line.data.map((point) => point.value));
    const rawMin = Math.min(...values, 0);
    const rawMax = Math.max(...values, 1);
    const padAmount = (rawMax - rawMin) * 0.12 || 1;
    const domainMin = rawMin < 0 ? rawMin - padAmount : 0;
    const domainMax = rawMax + padAmount;

    const svgWidth = Math.max(MIN_WIDTH, PAD_LEFT + PAD_RIGHT + Math.max(periods.length - 1, 1) * POINT_SPACING);
    const chartWidth = svgWidth - PAD_LEFT - PAD_RIGHT;
    const chartHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

    const xFor = (period: string) => {
        const index = periods.indexOf(period);
        return periods.length > 1 ? PAD_LEFT + (index / (periods.length - 1)) * chartWidth : PAD_LEFT + chartWidth / 2;
    };
    const yFor = (value: number) => {
        const ratio = (value - domainMin) / (domainMax - domainMin || 1);
        return PAD_TOP + chartHeight - ratio * chartHeight;
    };

    const gridLines = 4;
    const gridValues = Array.from({ length: gridLines + 1 }, (_, index) => domainMin + ((domainMax - domainMin) * index) / gridLines);

    if (periods.length === 0 || series.length === 0) return null;

    return (
        <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-navy-900">{title}</h3>
                <div className="flex flex-wrap items-center gap-4">
                    {series.map((line, index) => (
                        <span key={line.label} className="inline-flex items-center gap-2 text-xs font-semibold text-ink-muted">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            {line.label}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-4 overflow-x-auto">
                <svg
                    viewBox={`0 0 ${svgWidth} ${HEIGHT}`}
                    style={{ width: '100%', minWidth: `${svgWidth}px` }}
                    className="h-auto"
                    role="img"
                    aria-label={title}
                >
                    {gridValues.map((value, index) => (
                        <g key={index}>
                            <line
                                x1={PAD_LEFT}
                                x2={svgWidth - PAD_RIGHT}
                                y1={yFor(value)}
                                y2={yFor(value)}
                                stroke="#E4E7EC"
                                strokeWidth="1"
                            />
                            <text x={PAD_LEFT - 10} y={yFor(value)} textAnchor="end" dominantBaseline="middle" className="fill-ink-faint text-[10px]">
                                {formatValue(value, prefix ?? null, suffix ?? null)}
                            </text>
                        </g>
                    ))}

                    {periods.map((period) => (
                        <text
                            key={period}
                            x={xFor(period)}
                            y={HEIGHT - PAD_BOTTOM + 20}
                            textAnchor="middle"
                            className="fill-ink-faint text-[10px] font-semibold"
                        >
                            {period}
                        </text>
                    ))}

                    {series.map((line, seriesIndex) => {
                        const color = COLORS[seriesIndex % COLORS.length];
                        const points = line.data
                            .slice()
                            .sort((a, b) => periods.indexOf(a.period) - periods.indexOf(b.period));
                        const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xFor(point.period)},${yFor(point.value)}`).join(' ');

                        return (
                            <g key={line.label}>
                                <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                {points.map((point, pointIndex) => {
                                    const isHovered = hovered?.seriesIndex === seriesIndex && hovered.pointIndex === pointIndex;
                                    const x = xFor(point.period);
                                    const y = yFor(point.value);
                                    return (
                                        <g key={point.period}>
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r={isHovered ? 6 : 3.5}
                                                fill={color}
                                                stroke="#fff"
                                                strokeWidth="1.5"
                                                className="transition-all"
                                            />
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r={10}
                                                fill="transparent"
                                                onMouseEnter={() => setHovered({ seriesIndex, pointIndex })}
                                                onMouseLeave={() => setHovered(null)}
                                            />
                                            {isHovered && (
                                                <g>
                                                    <rect
                                                        x={Math.min(Math.max(x - 45, PAD_LEFT), svgWidth - PAD_RIGHT - 90)}
                                                        y={Math.max(y - 42, 2)}
                                                        width="90"
                                                        height="30"
                                                        rx="6"
                                                        fill="#14234a"
                                                    />
                                                    <text
                                                        x={Math.min(Math.max(x, PAD_LEFT + 45), svgWidth - PAD_RIGHT - 45)}
                                                        y={Math.max(y - 27, 17)}
                                                        textAnchor="middle"
                                                        className="fill-white text-[10px] font-bold"
                                                    >
                                                        {point.period}
                                                    </text>
                                                    <text
                                                        x={Math.min(Math.max(x, PAD_LEFT + 45), svgWidth - PAD_RIGHT - 45)}
                                                        y={Math.max(y - 15, 29)}
                                                        textAnchor="middle"
                                                        className="fill-white text-[11px] font-black"
                                                    >
                                                        {formatValue(point.value, prefix ?? null, suffix ?? null)}
                                                    </text>
                                                </g>
                                            )}
                                        </g>
                                    );
                                })}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
