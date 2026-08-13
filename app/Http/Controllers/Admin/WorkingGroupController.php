<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkingGroup;
use App\Support\HtmlSanitizer;
use App\Support\PublicImageUpload;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class WorkingGroupController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/WorkingGroups/Index', [
            'items' => WorkingGroup::orderBy('sort_order')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/WorkingGroups/Edit', ['item' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data = $this->storeCoverImage($request, $data);
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);

        WorkingGroup::create($data);

        return redirect()->route('admin.working-groups.index')->with('success', 'Working group created.');
    }

    public function edit(WorkingGroup $workingGroup): Response
    {
        return Inertia::render('Admin/WorkingGroups/Edit', ['item' => $workingGroup]);
    }

    public function update(Request $request, WorkingGroup $workingGroup): RedirectResponse
    {
        $data = $this->validated($request);
        $data = $this->storeCoverImage($request, $data, $workingGroup->cover_image_path);

        $workingGroup->update($data);

        return redirect()->route('admin.working-groups.index')->with('success', 'Working group updated.');
    }

    public function destroy(WorkingGroup $workingGroup): RedirectResponse
    {
        if ($workingGroup->cover_image_path && str_starts_with($workingGroup->cover_image_path, '/uploads/working-groups/')) {
            File::delete(public_path(ltrim($workingGroup->cover_image_path, '/')));
        }
        $workingGroup->delete();

        return back()->with('success', 'Working group removed.');
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
            $data['cover_image_path'] = PublicImageUpload::replace($request->file('cover_image'), 'working-groups', $oldPath);
        }

        return $data;
    }
}
