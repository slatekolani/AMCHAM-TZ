import { BlockEditorCard, blockLabel, blockTypeOptions, defaultBlockData } from '@/Components/Admin/PageBlockEditor';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Page, PageBlock, PageProps } from '@/types';
import { FormEvent, useState } from 'react';
import { confirmAction } from '@/utils/alerts';

type PagesEditProps = PageProps<{ page: Page }>;

const homeCopyFields: { group: string; fields: [string, string, 'input' | 'textarea'][] }[] = [
    { group: 'Hero statistics', fields: [
        ['hero_corridor_label', 'Corridor label', 'input'],
        ['hero_members_label', 'Member count label', 'input'],
        ['hero_sectors_label', 'Sector count label', 'input'],
    ] },
    { group: 'Member company strip', fields: [
        ['companies_eyebrow', 'Section label', 'input'],
        ['companies_helper', 'Helper text', 'input'],
        ['company_fallback_description', 'Fallback company description', 'textarea'],
        ['company_profile_button', 'Profile button label', 'input'],
        ['company_website_button', 'Website button label', 'input'],
    ] },
    { group: 'Chamber pillars', fields: [
        ['pillars_eyebrow', 'Section label', 'input'],
        ['pillars_link_label', 'About link label', 'input'],
        ['pillars_item_link_label', 'Pillar link label', 'input'],
    ] },
    { group: 'Events', fields: [
        ['events_eyebrow', 'Section label', 'input'],
        ['events_heading', 'Heading', 'input'],
        ['events_button', 'View-all button', 'input'],
        ['events_note', 'Supporting note', 'textarea'],
        ['events_empty', 'Empty-state message', 'input'],
    ] },
    { group: 'Newsroom', fields: [
        ['news_eyebrow', 'Section label', 'input'],
        ['news_heading', 'Heading', 'input'],
        ['news_button', 'View-all button', 'input'],
        ['news_empty', 'Empty-state message', 'input'],
    ] },
    { group: 'Leadership', fields: [
        ['leadership_eyebrow', 'Section label', 'input'],
        ['leadership_heading', 'Heading', 'input'],
        ['leadership_body', 'Description', 'textarea'],
        ['leadership_profile_label', 'Profile link label', 'input'],
        ['leadership_remaining_label', 'Remaining-directors text', 'input'],
        ['leadership_button', 'Full-board button', 'input'],
    ] },
    { group: 'Membership tiers', fields: [
        ['membership_eyebrow', 'Section label', 'input'],
        ['membership_heading', 'Heading', 'input'],
        ['membership_body', 'Description', 'textarea'],
        ['membership_fallback_description', 'Fallback tier description', 'textarea'],
        ['membership_join_prefix', 'Join button prefix', 'input'],
    ] },
    { group: 'How to join', fields: [
        ['join_eyebrow', 'Section label', 'input'],
        ['join_heading', 'Heading', 'input'],
        ['join_body', 'Description', 'textarea'],
        ['join_step_1_title', 'Step 1 title', 'input'],
        ['join_step_1_body', 'Step 1 description (use {tier_count}, {lowest_price})', 'textarea'],
        ['join_step_1_link', 'Step 1 link label', 'input'],
        ['join_step_2_title', 'Step 2 title', 'input'],
        ['join_step_2_body', 'Step 2 description', 'textarea'],
        ['join_step_2_link', 'Step 2 link label', 'input'],
        ['join_step_3_title', 'Step 3 title', 'input'],
        ['join_step_3_body', 'Step 3 description', 'textarea'],
        ['join_step_3_link', 'Step 3 link label', 'input'],
        ['join_help', 'Help text', 'textarea'],
        ['join_primary_button', 'Primary button', 'input'],
        ['join_secondary_button', 'Secondary button', 'input'],
    ] },
];

function newBlockId(): string {
    return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `block-${Date.now()}-${Math.random()}`;
}

export default function PagesEdit({ page }: PagesEditProps) {
    const [blocks, setBlocks] = useState<PageBlock[]>(page.content?.blocks ?? []);
    const [copy, setCopy] = useState<Record<string, string>>(page.content?.copy ?? {});
    const [addingType, setAddingType] = useState<PageBlock['type']>('heading_text');

    const { data, setData, transform, post, processing, errors } = useForm({
        _method: 'put',
        title: page.title,
        meta_title: page.meta_title ?? '',
        meta_description: page.meta_description ?? '',
        status: page.status,
    });

    const updateBlock = (index: number, updated: PageBlock) => {
        setBlocks((current) => current.map((block, i) => (i === index ? updated : block)));
    };

    const removeBlock = async (index: number) => {
        if (!(await confirmAction('Remove this block?', 'The block will be removed when you save the page.', 'Yes, remove it', true))) return;
        setBlocks((current) => current.filter((_, i) => i !== index));
    };

    const moveBlock = (index: number, direction: -1 | 1) => {
        setBlocks((current) => {
            const next = [...current];
            const target = index + direction;
            if (target < 0 || target >= next.length) return current;
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    };

    const addBlock = () => {
        setBlocks((current) => [...current, { id: newBlockId(), type: addingType, data: defaultBlockData(addingType) } as PageBlock]);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        transform((formData) => ({ ...formData, content: { blocks, copy } }));
        post(route('admin.pages.update', page.uuid), { forceFormData: true });
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">CMS</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Edit — {page.title}</h1>
                </div>
            }
        >
            <Head title={`Admin — Edit ${page.title}`} />

            <form onSubmit={submit} className="grid max-w-3xl gap-8">
                <div className="grid gap-5 border border-[#d7c8a9] bg-white p-6">
                    <h2 className="text-lg font-bold text-[#14234a]">Page details</h2>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Title
                        <input value={data.title} onChange={(event) => setData('title', event.target.value)} className="border-[#d7c8a9]" />
                        {errors.title && <span className="text-xs font-semibold text-[#cf2f3b]">{errors.title}</span>}
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Meta title (SEO)
                        <input value={data.meta_title} onChange={(event) => setData('meta_title', event.target.value)} className="border-[#d7c8a9]" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Meta description (SEO)
                        <textarea value={data.meta_description} onChange={(event) => setData('meta_description', event.target.value)} className="min-h-20 border-[#d7c8a9]" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#14234a]">
                        Status
                        <select value={data.status} onChange={(event) => setData('status', event.target.value as 'draft' | 'published')} className="w-fit border-[#d7c8a9]">
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </label>
                </div>

                {page.slug === 'home' && (
                    <div className="grid gap-5 border border-[#d7c8a9] bg-white p-6">
                        <div>
                            <h2 className="text-lg font-bold text-[#14234a]">Homepage section copy</h2>
                            <p className="mt-1 text-sm text-[#667085]">Edit every heading, description, helper, empty state, and button label used around dynamic homepage content.</p>
                        </div>
                        {homeCopyFields.map((section) => (
                            <fieldset key={section.group} className="grid gap-4 border-t border-[#eadfc8] pt-5">
                                <legend className="pr-3 text-sm font-black uppercase tracking-[0.1em] text-[#cf2f3b]">{section.group}</legend>
                                {section.fields.map(([key, label, kind]) => (
                                    <label key={key} className="grid gap-2 text-sm font-bold text-[#14234a]">
                                        {label}
                                        {kind === 'textarea' ? (
                                            <textarea value={copy[key] ?? ''} onChange={(event) => setCopy((current) => ({ ...current, [key]: event.target.value }))} className="min-h-24 border-[#d7c8a9]" />
                                        ) : (
                                            <input value={copy[key] ?? ''} onChange={(event) => setCopy((current) => ({ ...current, [key]: event.target.value }))} className="border-[#d7c8a9]" />
                                        )}
                                    </label>
                                ))}
                            </fieldset>
                        ))}
                    </div>
                )}

                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#14234a]">Page sections</h2>
                    </div>

                    {blocks.map((block, index) => (
                        <div key={block.id} className="border border-[#d7c8a9] bg-[#fbf8f0]">
                            <div className="flex items-center justify-between border-b border-[#d7c8a9] bg-white px-4 py-3">
                                <p className="text-sm font-black uppercase tracking-[0.1em] text-[#14234a]">{blockLabel(block.type)}</p>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} className="text-xs font-bold text-[#667085] disabled:opacity-30">
                                        ↑ Move up
                                    </button>
                                    <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} className="text-xs font-bold text-[#667085] disabled:opacity-30">
                                        ↓ Move down
                                    </button>
                                    <button type="button" onClick={() => removeBlock(index)} className="text-xs font-bold text-[#cf2f3b]">
                                        Remove
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <BlockEditorCard block={block} onChange={(updated) => updateBlock(index, updated)} />
                            </div>
                        </div>
                    ))}

                    {blocks.length === 0 && <p className="text-sm text-[#667085]">This page has no sections yet — add one below.</p>}

                    <div className="flex flex-wrap items-center gap-3 border border-dashed border-[#d7c8a9] bg-white p-4">
                        <select value={addingType} onChange={(event) => setAddingType(event.target.value as PageBlock['type'])} className="border-[#d7c8a9] text-sm">
                            {blockTypeOptions.map(([type, label]) => (
                                <option key={type} value={type}>{label}</option>
                            ))}
                        </select>
                        <button type="button" onClick={addBlock} className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">
                            + Add section
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-fit bg-[#14234a] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60"
                >
                    Save page
                </button>
            </form>
        </AdminLayout>
    );
}
