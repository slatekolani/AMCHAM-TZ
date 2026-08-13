import AdminLayout from '@/Layouts/AdminLayout';
import { EconomicStat, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type EconomicStatEditProps = PageProps<{ stat: EconomicStat | null }>;

export default function EconomicStatEdit({ stat }: EconomicStatEditProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: stat ? 'put' : 'post',
        category: stat?.category ?? 'trade',
        label: stat?.label ?? '',
        value: stat?.value ?? '',
        period: stat?.period ?? '',
        description: stat?.description ?? '',
        source: stat?.source ?? '',
        source_url: stat?.source_url ?? '',
        is_featured: stat?.is_featured ?? false,
        sort_order: stat?.sort_order ?? 0,
        chart_group: stat?.chart_group ?? '',
        chart_title: stat?.chart_title ?? '',
        trend_value_prefix: stat?.trend_value_prefix ?? '',
        trend_value_suffix: stat?.trend_value_suffix ?? '',
        trend: (stat?.trend ?? []).map((point) => ({ period: point.period, value: String(point.value) })),
    });

    const addTrendPoint = () => setData('trend', [...data.trend, { period: '', value: '' }]);
    const removeTrendPoint = (index: number) => setData('trend', data.trend.filter((_, i) => i !== index));
    const updateTrendPoint = (index: number, key: 'period' | 'value', value: string) =>
        setData('trend', data.trend.map((point, i) => (i === index ? { ...point, [key]: value } : point)));

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(stat ? route('admin.economic-stats.update', stat.uuid) : route('admin.economic-stats.store'));
    };

    const input = 'mt-2 w-full border-[#d7c8a9] bg-white px-4 py-3';

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Content</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">{stat ? `Edit — ${stat.label}` : 'Add stat'}</h1>
                </div>
            }
        >
            <Head title={`Admin — ${stat ? 'Edit stat' : 'Add stat'}`} />

            <form onSubmit={submit} className="grid max-w-2xl gap-5">
                <label className="text-sm font-bold text-[#14234a]">
                    Category
                    <select value={data.category} onChange={(event) => setData('category', event.target.value as 'trade' | 'investment')} className={input}>
                        <option value="trade">Trade</option>
                        <option value="investment">Investment</option>
                    </select>
                </label>

                <label className="text-sm font-bold text-[#14234a]">
                    Label
                    <input value={data.label} onChange={(event) => setData('label', event.target.value)} className={input} placeholder="e.g. Total bilateral trade in goods" />
                    {errors.label && <span className="mt-1 block text-xs font-semibold text-[#cf2f3b]">{errors.label}</span>}
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-bold text-[#14234a]">
                        Value
                        <input value={data.value} onChange={(event) => setData('value', event.target.value)} className={input} placeholder="e.g. $1.2B, 38%, 12,400" />
                        {errors.value && <span className="mt-1 block text-xs font-semibold text-[#cf2f3b]">{errors.value}</span>}
                    </label>
                    <label className="text-sm font-bold text-[#14234a]">
                        Period <span className="font-normal text-[#667085]">(optional)</span>
                        <input value={data.period} onChange={(event) => setData('period', event.target.value)} className={input} placeholder="e.g. 2024, FY2023/24" />
                    </label>
                </div>

                <label className="text-sm font-bold text-[#14234a]">
                    Description <span className="font-normal text-[#667085]">(optional, short context shown under the stat)</span>
                    <textarea value={data.description} onChange={(event) => setData('description', event.target.value)} className={`${input} min-h-24`} />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-bold text-[#14234a]">
                        Source <span className="font-normal text-[#667085]">(optional citation)</span>
                        <input value={data.source} onChange={(event) => setData('source', event.target.value)} className={input} placeholder="e.g. U.S. Census Bureau, 2024" />
                    </label>
                    <label className="text-sm font-bold text-[#14234a]">
                        Source URL <span className="font-normal text-[#667085]">(optional)</span>
                        <input type="url" value={data.source_url} onChange={(event) => setData('source_url', event.target.value)} className={input} />
                        {errors.source_url && <span className="mt-1 block text-xs font-semibold text-[#cf2f3b]">{errors.source_url}</span>}
                    </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-bold text-[#14234a]">
                        Sort order
                        <input type="number" min="0" value={data.sort_order} onChange={(event) => setData('sort_order', Number(event.target.value))} className={input} />
                    </label>
                    <label className="flex items-center gap-3 self-end pb-3 text-sm font-bold text-[#14234a]">
                        <input type="checkbox" checked={data.is_featured} onChange={(event) => setData('is_featured', event.target.checked)} />
                        Featured (shown as a headline stat card at the top of the page)
                    </label>
                </div>

                <div className="border-t border-[#d7c8a9] pt-5">
                    <h2 className="text-lg font-bold text-[#14234a]">Trend chart (optional)</h2>
                    <p className="mt-1 text-sm text-[#667085]">
                        Give this stat a chart group to plot it as a line on a multi-year trend chart instead of a stat card. Give two stats
                        the same group name (e.g. <code className="bg-[#fbf8f0] px-1">us_tz_goods_trade</code>) to combine them as two lines on
                        one chart — for example "Exports" and "Imports".
                    </p>

                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                        <label className="text-sm font-bold text-[#14234a]">
                            Chart group <span className="font-normal text-[#667085]">(shared by lines on the same chart)</span>
                            <input value={data.chart_group} onChange={(event) => setData('chart_group', event.target.value)} className={input} placeholder="e.g. us_tz_goods_trade" />
                        </label>
                        <label className="text-sm font-bold text-[#14234a]">
                            Chart title
                            <input value={data.chart_title} onChange={(event) => setData('chart_title', event.target.value)} className={input} placeholder="e.g. U.S. goods trade with Tanzania" />
                        </label>
                        <label className="text-sm font-bold text-[#14234a]">
                            Value prefix <span className="font-normal text-[#667085]">(optional, e.g. $)</span>
                            <input value={data.trend_value_prefix} onChange={(event) => setData('trend_value_prefix', event.target.value)} className={input} />
                        </label>
                        <label className="text-sm font-bold text-[#14234a]">
                            Value suffix <span className="font-normal text-[#667085]">(optional, e.g. M)</span>
                            <input value={data.trend_value_suffix} onChange={(event) => setData('trend_value_suffix', event.target.value)} className={input} />
                        </label>
                    </div>

                    <div className="mt-5 grid gap-3">
                        {data.trend.map((point, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <input
                                    value={point.period}
                                    onChange={(event) => updateTrendPoint(index, 'period', event.target.value)}
                                    className="w-32 border-[#d7c8a9] bg-white px-3 py-2 text-sm"
                                    placeholder="Period (e.g. 2024)"
                                />
                                <input
                                    value={point.value}
                                    onChange={(event) => updateTrendPoint(index, 'value', event.target.value)}
                                    className="w-40 border-[#d7c8a9] bg-white px-3 py-2 text-sm"
                                    placeholder="Value (numeric)"
                                />
                                <button type="button" onClick={() => removeTrendPoint(index)} className="text-xs font-bold text-[#cf2f3b]">
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addTrendPoint}
                            className="w-fit border border-[#d7c8a9] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#14234a]"
                        >
                            + Add data point
                        </button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button type="submit" disabled={processing} className="bg-[#14234a] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white disabled:opacity-60">
                        Save stat
                    </button>
                    <Link href={route('admin.economic-stats.index')} className="px-6 py-3 text-sm font-bold text-[#667085]">
                        Cancel
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
