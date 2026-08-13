<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\WebsiteCopy;
use App\Support\PublicImageUpload;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteCopyController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/WebsiteCopy/Edit', [
            'groups' => WebsiteCopy::groups(),
            'values' => WebsiteCopy::values(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $keys = array_keys(WebsiteCopy::defaults());
        $imageKeys = collect($keys)->filter(fn (string $key) => str_ends_with($key, '_image'));
        $data = $request->validate([
            'copy' => ['required', 'array'],
            'copy.*' => ['nullable', 'string', 'max:5000'],
            'image_uploads' => ['nullable', 'array'],
            'image_uploads.*' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);
        $copy = collect($data['copy'])->only($keys)->map(fn ($value) => (string) $value)->all();

        foreach ($imageKeys as $key) {
            if ($file = $request->file("image_uploads.{$key}")) {
                $copy[$key] = PublicImageUpload::replace($file, 'website-cms', $copy[$key] ?? null);
            }
        }
        Setting::set('website_copy', json_encode($copy, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

        return back()->with('success', 'Website copy updated.');
    }
}
