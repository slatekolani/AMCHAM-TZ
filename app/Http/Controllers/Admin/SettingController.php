<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Support\PublicImageUpload;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    private const KEYS = [
        'site_name', 'site_tagline', 'contact_email', 'contact_phone', 'contact_address',
        'social_linkedin', 'social_twitter', 'social_facebook', 'social_instagram',
        'seo_default_title', 'seo_default_description',
        'hero_carousel_slides', 'hero_tagline_line_one', 'hero_tagline_line_two',
        'hero_origin_label', 'hero_destination_label', 'hero_auto_advance_ms',
        'hero_corridor_duration_ms',
    ];

    public function index(): Response
    {
        $settings = Setting::whereIn('key', self::KEYS)->pluck('value', 'key');
        $settings['hero_carousel_slides'] = json_decode($settings['hero_carousel_slides'] ?? '[]', true) ?: [];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'site_name' => ['nullable', 'string', 'max:255'],
            'site_tagline' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'contact_address' => ['nullable', 'string', 'max:255'],
            'social_linkedin' => ['nullable', 'string', 'max:255'],
            'social_twitter' => ['nullable', 'string', 'max:255'],
            'social_facebook' => ['nullable', 'string', 'max:255'],
            'social_instagram' => ['nullable', 'url', 'max:255'],
            'seo_default_title' => ['nullable', 'string', 'max:255'],
            'seo_default_description' => ['nullable', 'string', 'max:1000'],
            'hero_tagline_line_one' => ['required', 'string', 'max:100'],
            'hero_tagline_line_two' => ['required', 'string', 'max:100'],
            'hero_origin_label' => ['required', 'string', 'max:100'],
            'hero_destination_label' => ['required', 'string', 'max:100'],
            'hero_auto_advance_ms' => ['required', 'integer', 'min:3000', 'max:30000'],
            'hero_corridor_duration_ms' => ['required', 'integer', 'min:1000', 'max:15000'],
            'hero_carousel_slides' => ['required', 'array', 'min:1', 'max:8'],
            'hero_carousel_slides.*.eyebrow' => ['required', 'string', 'max:100'],
            'hero_carousel_slides.*.heading' => ['required', 'string', 'max:120'],
            'hero_carousel_slides.*.accent' => ['required', 'string', 'max:120'],
            'hero_carousel_slides.*.body' => ['required', 'string', 'max:700'],
            'hero_carousel_slides.*.main_image' => ['nullable', 'string', 'max:500'],
            'hero_carousel_slides.*.secondary_image' => ['nullable', 'string', 'max:500'],
            'hero_carousel_slides.*.main_image_upload' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'hero_carousel_slides.*.secondary_image_upload' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'hero_carousel_slides.*.primary_cta_label' => ['required', 'string', 'max:80'],
            'hero_carousel_slides.*.primary_cta_url' => ['required', 'string', 'max:500'],
            'hero_carousel_slides.*.secondary_cta_label' => ['required', 'string', 'max:80'],
            'hero_carousel_slides.*.secondary_cta_url' => ['required', 'string', 'max:500'],
        ]);

        foreach ($data['hero_carousel_slides'] as $index => &$slide) {
            $mainUpload = $request->file("hero_carousel_slides.{$index}.main_image_upload");
            $secondaryUpload = $request->file("hero_carousel_slides.{$index}.secondary_image_upload");

            if ($mainUpload) {
                $slide['main_image'] = PublicImageUpload::replace($mainUpload, 'hero-carousel', $slide['main_image'] ?? null);
            }
            if (empty($slide['main_image'])) {
                throw ValidationException::withMessages([
                    "hero_carousel_slides.{$index}.main_image" => 'Please upload a main carousel image.',
                ]);
            }
            if ($secondaryUpload) {
                $slide['secondary_image'] = PublicImageUpload::replace($secondaryUpload, 'hero-carousel', $slide['secondary_image'] ?? null);
            }

            unset($slide['main_image_upload'], $slide['secondary_image_upload']);
        }
        unset($slide);

        foreach ($data as $key => $value) {
            if ($key === 'hero_carousel_slides') {
                $value = json_encode(array_values($value), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            }
            Setting::set($key, $value);
        }

        return back()->with('success', 'Settings updated.');
    }
}
