import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { HeroCarouselSlide, PageProps } from '@/types';
import { FormEvent } from 'react';
import CoverImageUpload from '@/Components/CoverImageUpload';

type SettingsIndexProps = PageProps<{ settings: Record<string, string | HeroCarouselSlide[]> }>;

const fields: [string, string][] = [
    ['site_name', 'Site name'],
    ['site_tagline', 'Tagline'],
    ['contact_email', 'Contact email'],
    ['contact_phone', 'Contact phone'],
    ['contact_address', 'Contact address'],
    ['social_linkedin', 'LinkedIn URL'],
    ['social_twitter', 'Twitter / X URL'],
    ['social_facebook', 'Facebook URL'],
    ['social_instagram', 'Instagram URL'],
    ['seo_default_title', 'Default SEO title'],
    ['seo_default_description', 'Default SEO description'],
];

export default function SettingsIndex({ settings }: SettingsIndexProps) {
    const slides = Array.isArray(settings.hero_carousel_slides) ? settings.hero_carousel_slides : [];
    const { data, setData, post, processing, errors } = useForm<any>({
        _method: 'put',
        ...Object.fromEntries(fields.map(([key]) => [key, typeof settings[key] === 'string' ? settings[key] : ''])),
        hero_tagline_line_one: settings.hero_tagline_line_one ?? 'Two markets.',
        hero_tagline_line_two: settings.hero_tagline_line_two ?? 'One chamber.',
        hero_origin_label: settings.hero_origin_label ?? 'United States',
        hero_destination_label: settings.hero_destination_label ?? 'Tanzania',
        hero_auto_advance_ms: Number(settings.hero_auto_advance_ms ?? 6500),
        hero_corridor_duration_ms: Number(settings.hero_corridor_duration_ms ?? 3400),
        hero_carousel_slides: slides,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.settings.update'), { forceFormData: true });
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">System</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Site settings</h1>
                </div>
            }
        >
            <Head title="Admin — Settings" />

            <form onSubmit={submit} className="grid max-w-5xl gap-8">
                <section className="rounded-xl border border-[#d7c8a9] bg-[#fbf8f0] p-5 sm:p-7">
                    <div className="flex flex-col justify-between gap-4 border-b border-[#d7c8a9] pb-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#cf2f3b]">Homepage</p>
                            <h2 className="mt-2 font-display text-2xl font-semibold text-[#14234a]">Hero carousel</h2>
                            <p className="mt-2 text-sm text-[#667085]">Every slide and shared bilateral animation label is managed here.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setData('hero_carousel_slides', [...data.hero_carousel_slides, emptySlide()])}
                            className="bg-[#cf2f3b] px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-white"
                        >
                            Add slide
                        </button>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <HeroSetting label="Tagline first line" value={data.hero_tagline_line_one} onChange={(value) => setData('hero_tagline_line_one', value)} />
                        <HeroSetting label="Tagline highlighted line" value={data.hero_tagline_line_two} onChange={(value) => setData('hero_tagline_line_two', value)} />
                        <HeroSetting label="Origin label" value={data.hero_origin_label} onChange={(value) => setData('hero_origin_label', value)} />
                        <HeroSetting label="Destination label" value={data.hero_destination_label} onChange={(value) => setData('hero_destination_label', value)} />
                        <HeroSetting label="Slide interval (milliseconds)" type="number" value={String(data.hero_auto_advance_ms)} onChange={(value) => setData('hero_auto_advance_ms', Number(value))} />
                        <HeroSetting label="Moving-dot duration (milliseconds)" type="number" value={String(data.hero_corridor_duration_ms)} onChange={(value) => setData('hero_corridor_duration_ms', Number(value))} />
                    </div>

                    <div className="mt-8 grid gap-6">
                        {data.hero_carousel_slides.map((slide: HeroCarouselSlide, index: number) => (
                            <article key={index} className="rounded-xl border border-[#d7c8a9] bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="font-display text-xl font-semibold text-[#14234a]">Slide {index + 1}</h3>
                                    {data.hero_carousel_slides.length > 1 && (
                                        <button type="button" onClick={() => setData('hero_carousel_slides', data.hero_carousel_slides.filter((_: HeroCarouselSlide, i: number) => i !== index))} className="text-xs font-bold uppercase text-[#cf2f3b]">Remove</button>
                                    )}
                                </div>
                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <CoverImageUpload
                                        label="Main carousel image"
                                        currentImage={slide.main_image}
                                        error={errors[`hero_carousel_slides.${index}.main_image_upload`] ?? errors[`hero_carousel_slides.${index}.main_image`]}
                                        onChange={(file) => updateSlide(data.hero_carousel_slides, index, 'main_image_upload', file, setData)}
                                    />
                                    <CoverImageUpload
                                        label="Secondary overlapping image"
                                        currentImage={slide.secondary_image}
                                        error={errors[`hero_carousel_slides.${index}.secondary_image_upload`]}
                                        onChange={(file) => updateSlide(data.hero_carousel_slides, index, 'secondary_image_upload', file, setData)}
                                    />
                                </div>
                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    {slideFields.map(([key, label, multiline]) => (
                                        <label key={key} className={(multiline ? 'sm:col-span-2 ' : '') + 'grid gap-2 text-sm font-bold text-[#14234a]'}>
                                            {label}
                                            {multiline ? (
                                                <textarea value={slide[key] ?? ''} onChange={(event) => updateSlide(data.hero_carousel_slides, index, key, event.target.value, setData)} className="min-h-24 border-[#d7c8a9]" />
                                            ) : (
                                                <input value={slide[key] ?? ''} onChange={(event) => updateSlide(data.hero_carousel_slides, index, key, event.target.value, setData)} className="border-[#d7c8a9]" />
                                            )}
                                            {errors[`hero_carousel_slides.${index}.${key}`] && <span className="text-xs text-[#cf2f3b]">{errors[`hero_carousel_slides.${index}.${key}`]}</span>}
                                        </label>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="grid max-w-2xl gap-5">
                {fields.map(([key, label]) => (
                    <label key={key} className="grid gap-2 text-sm font-bold text-[#14234a]">
                        {label}
                        {key.includes('description') ? (
                            <textarea value={data[key]} onChange={(event) => setData(key, event.target.value)} className="min-h-24 border-[#d7c8a9]" />
                        ) : (
                            <input value={data[key]} onChange={(event) => setData(key, event.target.value)} className="border-[#d7c8a9]" />
                        )}
                        {errors[key] && <span className="text-xs font-semibold text-[#cf2f3b]">{errors[key]}</span>}
                    </label>
                ))}
                </section>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-fit bg-[#14234a] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60"
                >
                    Save settings
                </button>
            </form>
        </AdminLayout>
    );
}

const slideFields: [keyof HeroCarouselSlide, string, boolean][] = [
    ['eyebrow', 'Eyebrow', false], ['heading', 'Title', false], ['accent', 'Highlighted title', false],
    ['body', 'Description', true],
    ['primary_cta_label', 'Primary button label', false], ['primary_cta_url', 'Primary button link', false],
    ['secondary_cta_label', 'Secondary button label', false], ['secondary_cta_url', 'Secondary button link', false],
];

function emptySlide(): HeroCarouselSlide {
    return {
        eyebrow: '', heading: '', accent: '', body: '', main_image: '', secondary_image: '',
        primary_cta_label: 'Join the Chamber', primary_cta_url: '/membership',
        secondary_cta_label: "See who's already in", secondary_cta_url: '/members',
    };
}

function updateSlide(slides: HeroCarouselSlide[], index: number, key: string, value: string | File | null, setData: (key: string, value: any) => void) {
    setData('hero_carousel_slides', slides.map((slide, i) => i === index ? { ...slide, [key]: value } : slide));
}

function HeroSetting({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
    return <label className="grid gap-2 text-sm font-bold text-[#14234a]">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="border-[#d7c8a9] bg-white" /></label>;
}
