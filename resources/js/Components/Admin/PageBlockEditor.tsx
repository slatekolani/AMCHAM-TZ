import RichTextEditor from '@/Components/Admin/RichTextEditor';
import { PageBlock } from '@/types';

const blockLabels: Record<PageBlock['type'], string> = {
    hero: 'Hero banner',
    stats: 'Stats strip',
    heading_text: 'Heading & text',
    values_grid: 'Values grid',
    tag_list: 'Tag list',
    fact: 'Single fact',
    timeline: 'Timeline (dated milestones)',
};

export const blockTypeOptions = Object.entries(blockLabels) as [PageBlock['type'], string][];

export function defaultBlockData(type: PageBlock['type']): PageBlock['data'] {
    switch (type) {
        case 'hero':
            return { heading: '', eyebrow: '', body: '', primary_cta_label: '', primary_cta_url: '', secondary_cta_label: '', secondary_cta_url: '', image: '' };
        case 'stats':
            return { items: [] };
        case 'heading_text':
            return { heading: '', eyebrow: '', body: '' };
        case 'values_grid':
            return { items: [] };
        case 'tag_list':
            return { heading: '', items: [] };
        case 'fact':
            return { label: '', value: '' };
        case 'timeline':
            return { items: [] };
    }
}

const fieldClass = 'border-[#d7c8a9] bg-white';
const labelClass = 'grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#667085]';

type EditorProps<T> = { data: T; onChange: (data: T) => void };

function HeroEditor({ data, onChange }: EditorProps<Extract<PageBlock, { type: 'hero' }>['data']>) {
    return (
        <div className="grid gap-4">
            <label className={labelClass}>
                Eyebrow (small label above the heading)
                <input value={data.eyebrow ?? ''} onChange={(e) => onChange({ ...data, eyebrow: e.target.value })} className={fieldClass} />
            </label>
            <label className={labelClass}>
                Heading
                <input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} className={fieldClass} />
            </label>
            <label className={labelClass}>
                Body text
                <textarea value={data.body ?? ''} onChange={(e) => onChange({ ...data, body: e.target.value })} className={fieldClass + ' min-h-24'} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                    Primary button label
                    <input value={data.primary_cta_label ?? ''} onChange={(e) => onChange({ ...data, primary_cta_label: e.target.value })} className={fieldClass} />
                </label>
                <label className={labelClass}>
                    Primary button link
                    <input value={data.primary_cta_url ?? ''} onChange={(e) => onChange({ ...data, primary_cta_url: e.target.value })} className={fieldClass} />
                </label>
                <label className={labelClass}>
                    Secondary button label
                    <input value={data.secondary_cta_label ?? ''} onChange={(e) => onChange({ ...data, secondary_cta_label: e.target.value })} className={fieldClass} />
                </label>
                <label className={labelClass}>
                    Secondary button link
                    <input value={data.secondary_cta_url ?? ''} onChange={(e) => onChange({ ...data, secondary_cta_url: e.target.value })} className={fieldClass} />
                </label>
            </div>
            <label className={labelClass}>
                Background image path
                <input value={data.image ?? ''} onChange={(e) => onChange({ ...data, image: e.target.value })} placeholder="/images/amcham-live/example.jpg" className={fieldClass} />
            </label>
        </div>
    );
}

function StatsEditor({ data, onChange }: EditorProps<Extract<PageBlock, { type: 'stats' }>['data']>) {
    const items = data.items ?? [];
    const update = (index: number, field: 'label' | 'value', value: string) => {
        onChange({ items: items.map((item, i) => (i === index ? { ...item, [field]: value } : item)) });
    };
    const remove = (index: number) => onChange({ items: items.filter((_, i) => i !== index) });
    const add = () => onChange({ items: [...items, { label: '', value: '' }] });

    return (
        <div className="grid gap-3">
            {items.map((item, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-3">
                    <input value={item.value} onChange={(e) => update(index, 'value', e.target.value)} placeholder="150+" className={fieldClass} />
                    <input value={item.label} onChange={(e) => update(index, 'label', e.target.value)} placeholder="Member Companies" className={fieldClass} />
                    <button type="button" onClick={() => remove(index)} className="text-sm font-bold text-[#cf2f3b]">Remove</button>
                </div>
            ))}
            <button type="button" onClick={add} className="w-fit border border-[#14234a] px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#14234a]">
                + Add stat
            </button>
        </div>
    );
}

function HeadingTextEditor({ data, onChange }: EditorProps<Extract<PageBlock, { type: 'heading_text' }>['data']>) {
    return (
        <div className="grid gap-4">
            <label className={labelClass}>
                Eyebrow (optional small label)
                <input value={data.eyebrow ?? ''} onChange={(e) => onChange({ ...data, eyebrow: e.target.value })} className={fieldClass} />
            </label>
            <label className={labelClass}>
                Heading
                <input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} className={fieldClass} />
            </label>
            <label className={labelClass}>
                Body text
                <RichTextEditor value={data.body ?? ''} onChange={(html) => onChange({ ...data, body: html })} />
            </label>
        </div>
    );
}

function ValuesGridEditor({ data, onChange }: EditorProps<Extract<PageBlock, { type: 'values_grid' }>['data']>) {
    const items = data.items ?? [];
    const update = (index: number, field: 'title' | 'body' | 'image' | 'image_upload', value: string | File | null) => {
        onChange({ items: items.map((item, i) => (i === index ? { ...item, [field]: value } : item)) });
    };
    const remove = (index: number) => onChange({ items: items.filter((_, i) => i !== index) });
    const add = () => onChange({ items: [...items, { title: '', body: '' }] });

    return (
        <div className="grid gap-3">
            {items.map((item, index) => (
                <div key={index} className="grid gap-2 border border-[#eadfc8] bg-[#fbf8f0] p-3">
                    <div className="flex items-center gap-3">
                        <input value={item.title ?? ''} onChange={(e) => update(index, 'title', e.target.value)} placeholder="Title" className={fieldClass + ' flex-1'} />
                        <button type="button" onClick={() => remove(index)} className="text-sm font-bold text-[#cf2f3b]">Remove</button>
                    </div>
                    <textarea value={item.body ?? ''} onChange={(e) => update(index, 'body', e.target.value)} placeholder="Description" className={fieldClass + ' min-h-16'} />
                    <label className={labelClass}>
                        Card image
                        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => update(index, 'image_upload', e.target.files?.[0] ?? null)} className="block w-full text-sm normal-case tracking-normal text-[#667085] file:mr-4 file:border-0 file:bg-[#14234a] file:px-4 file:py-2 file:font-bold file:text-white" />
                    </label>
                    {(() => {
                        // Legacy rows can carry a non-File `image_upload` (e.g. an empty array from
                        // a since-fixed save bug) — createObjectURL throws on anything but a real File.
                        const preview = item.image_upload instanceof File ? URL.createObjectURL(item.image_upload) : item.image;
                        return preview ? <img src={preview} alt="Card preview" className="h-36 w-full rounded-lg object-cover" /> : null;
                    })()}
                </div>
            ))}
            <button type="button" onClick={add} className="w-fit border border-[#14234a] px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#14234a]">
                + Add item
            </button>
        </div>
    );
}

function TimelineEditor({ data, onChange }: EditorProps<Extract<PageBlock, { type: 'timeline' }>['data']>) {
    const items = data.items ?? [];
    const update = (index: number, field: 'year' | 'title' | 'body', value: string) => {
        onChange({ items: items.map((item, i) => (i === index ? { ...item, [field]: value } : item)) });
    };
    const remove = (index: number) => onChange({ items: items.filter((_, i) => i !== index) });
    const add = () => onChange({ items: [...items, { year: '', title: '', body: '' }] });

    return (
        <div className="grid gap-3">
            {items.map((item, index) => (
                <div key={index} className="grid gap-2 border border-[#eadfc8] bg-[#fbf8f0] p-3">
                    <div className="flex items-center gap-3">
                        <input value={item.year ?? ''} onChange={(e) => update(index, 'year', e.target.value)} placeholder="2010" className={fieldClass + ' w-28'} />
                        <input value={item.title ?? ''} onChange={(e) => update(index, 'title', e.target.value)} placeholder="Milestone title" className={fieldClass + ' flex-1'} />
                        <button type="button" onClick={() => remove(index)} className="text-sm font-bold text-[#cf2f3b]">Remove</button>
                    </div>
                    <textarea value={item.body ?? ''} onChange={(e) => update(index, 'body', e.target.value)} placeholder="What happened" className={fieldClass + ' min-h-16'} />
                </div>
            ))}
            <button type="button" onClick={add} className="w-fit border border-[#14234a] px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#14234a]">
                + Add milestone
            </button>
        </div>
    );
}

function TagListEditor({ data, onChange }: EditorProps<Extract<PageBlock, { type: 'tag_list' }>['data']>) {
    const items = data.items ?? [];
    const update = (index: number, value: string) => {
        onChange({ ...data, items: items.map((item, i) => (i === index ? value : item)) });
    };
    const remove = (index: number) => onChange({ ...data, items: items.filter((_, i) => i !== index) });
    const add = () => onChange({ ...data, items: [...items, ''] });

    return (
        <div className="grid gap-3">
            <label className={labelClass}>
                Section heading
                <input value={data.heading ?? ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} className={fieldClass} />
            </label>
            <div className="grid gap-2">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                        <input value={item} onChange={(e) => update(index, e.target.value)} className={fieldClass + ' flex-1'} />
                        <button type="button" onClick={() => remove(index)} className="text-sm font-bold text-[#cf2f3b]">Remove</button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={add} className="w-fit border border-[#14234a] px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#14234a]">
                + Add tag
            </button>
        </div>
    );
}

function FactEditor({ data, onChange }: EditorProps<Extract<PageBlock, { type: 'fact' }>['data']>) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
                Label
                <input value={data.label} onChange={(e) => onChange({ ...data, label: e.target.value })} placeholder="Office hours" className={fieldClass} />
            </label>
            <label className={labelClass}>
                Value
                <input value={data.value} onChange={(e) => onChange({ ...data, value: e.target.value })} placeholder="Monday – Friday, 08:30 – 17:00" className={fieldClass} />
            </label>
        </div>
    );
}

export function BlockEditorCard({ block, onChange }: { block: PageBlock; onChange: (block: PageBlock) => void }) {
    // Guards against blocks saved with missing/corrupted data (e.g. legacy rows) — without this,
    // a single malformed block crashes the whole edit page with no error boundary to catch it.
    switch (block.type) {
        case 'hero':
            return <HeroEditor data={block.data ?? defaultBlockData('hero')} onChange={(data) => onChange({ ...block, data })} />;
        case 'stats':
            return <StatsEditor data={block.data ?? defaultBlockData('stats')} onChange={(data) => onChange({ ...block, data })} />;
        case 'heading_text':
            return <HeadingTextEditor data={block.data ?? defaultBlockData('heading_text')} onChange={(data) => onChange({ ...block, data })} />;
        case 'values_grid':
            return <ValuesGridEditor data={block.data ?? defaultBlockData('values_grid')} onChange={(data) => onChange({ ...block, data })} />;
        case 'tag_list':
            return <TagListEditor data={block.data ?? defaultBlockData('tag_list')} onChange={(data) => onChange({ ...block, data })} />;
        case 'fact':
            return <FactEditor data={block.data ?? defaultBlockData('fact')} onChange={(data) => onChange({ ...block, data })} />;
        case 'timeline':
            return <TimelineEditor data={block.data ?? defaultBlockData('timeline')} onChange={(data) => onChange({ ...block, data })} />;
    }
}

export function blockLabel(type: PageBlock['type']): string {
    return blockLabels[type];
}
