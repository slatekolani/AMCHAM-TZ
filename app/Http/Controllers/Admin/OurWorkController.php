<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OurWorkItem;
use App\Support\HtmlSanitizer;
use App\Support\PublicImageUpload;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OurWorkController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/OurWork/Index', [
            'items' => OurWorkItem::orderBy('sort_order')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/OurWork/Edit', ['item' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data = $this->storeCoverImage($request, $data);
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);

        OurWorkItem::create($data);

        return redirect()->route('admin.our-work.index')->with('success', 'Work item created.');
    }

    public function edit(OurWorkItem $ourWork): Response
    {
        return Inertia::render('Admin/OurWork/Edit', ['item' => $ourWork]);
    }

    public function update(Request $request, OurWorkItem $ourWork): RedirectResponse
    {
        $data = $this->validated($request);
        $data = $this->storeCoverImage($request, $data, $ourWork->cover_image_path);

        $ourWork->update($data);

        return redirect()->route('admin.our-work.index')->with('success', 'Work item updated.');
    }

    public function destroy(OurWorkItem $ourWork): RedirectResponse
    {
        if ($ourWork->cover_image_path && str_starts_with($ourWork->cover_image_path, '/uploads/our-work/')) {
            File::delete(public_path(ltrim($ourWork->cover_image_path, '/')));
        }
        $ourWork->delete();

        return back()->with('success', 'Work item removed.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);

        $data['body'] = HtmlSanitizer::clean($data['body'] ?? null);

        return $data;
    }

    private function storeCoverImage(Request $request, array $data, ?string $oldPath = null): array
    {
        unset($data['cover_image']);
        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = PublicImageUpload::replace($request->file('cover_image'), 'our-work', $oldPath);
        }

        return $data;
    }
}
