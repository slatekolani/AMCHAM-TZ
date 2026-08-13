<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PolicyUpdate;
use App\Support\HtmlSanitizer;
use App\Support\PublicImageUpload;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PolicyUpdateController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/PolicyUpdates/Index', [
            'policyUpdates' => PolicyUpdate::latest('published_at')->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/PolicyUpdates/Edit', ['policyUpdate' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data = $this->storeCoverImage($request, $data);
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);

        if ($data['is_active']) {
            $data['published_at'] = now();
        }

        PolicyUpdate::create($data);

        return redirect()->route('admin.policy-updates.index')->with('success', 'Policy update created.');
    }

    public function edit(PolicyUpdate $policyUpdate): Response
    {
        return Inertia::render('Admin/PolicyUpdates/Edit', ['policyUpdate' => $policyUpdate]);
    }

    public function update(Request $request, PolicyUpdate $policyUpdate): RedirectResponse
    {
        $data = $this->validated($request);
        $data = $this->storeCoverImage($request, $data, $policyUpdate->cover_image_path);

        if ($data['is_active'] && ! $policyUpdate->published_at) {
            $data['published_at'] = now();
        }

        $policyUpdate->update($data);

        return redirect()->route('admin.policy-updates.index')->with('success', 'Policy update updated.');
    }

    public function destroy(PolicyUpdate $policyUpdate): RedirectResponse
    {
        if ($policyUpdate->cover_image_path && str_starts_with($policyUpdate->cover_image_path, '/uploads/policy-updates/')) {
            File::delete(public_path(ltrim($policyUpdate->cover_image_path, '/')));
        }
        $policyUpdate->delete();

        return back()->with('success', 'Policy update removed.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'is_active' => ['required', 'boolean'],
        ]);

        $data['body'] = HtmlSanitizer::clean($data['body'] ?? null);

        return $data;
    }

    private function storeCoverImage(Request $request, array $data, ?string $oldPath = null): array
    {
        unset($data['cover_image']);
        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = PublicImageUpload::replace($request->file('cover_image'), 'policy-updates', $oldPath);
        }

        return $data;
    }
}
