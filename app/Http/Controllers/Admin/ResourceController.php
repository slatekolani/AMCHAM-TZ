<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Support\PublicationNotifier;
use App\Support\PublicImageUpload;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    public function __construct(private PublicationNotifier $publicationNotifier)
    {
    }

    public function index(): Response
    {
        return Inertia::render('Admin/Resources/Index', [
            'resources' => Resource::orderBy('title')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'category' => ['nullable', 'string', 'max:255'],
            'file' => ['required', 'file', 'mimes:pdf,doc,docx,xls,xlsx', 'max:20480'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $file = $request->file('file');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('uploads/resources'), $filename);
        $path = 'uploads/resources/' . $filename;

        $resource = Resource::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'category' => $data['category'] ?? null,
            'cover_image_path' => $request->hasFile('cover_image')
                ? PublicImageUpload::replace($request->file('cover_image'), 'resource-covers')
                : null,
            'file_path' => $path,
        ]);

        if (strtolower((string) $resource->category) === 'newsletter') {
            $this->publicationNotifier->newsletter($resource);
        }

        return back()->with('success', 'Resource uploaded.');
    }

    public function update(Request $request, Resource $resource): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'category' => ['nullable', 'string', 'max:255'],
            'file' => ['nullable', 'file', 'mimes:pdf,doc,docx,xls,xlsx', 'max:20480'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $attributes = [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'category' => $data['category'] ?? null,
        ];

        if ($request->hasFile('file')) {
            if (str_starts_with($resource->file_path, 'uploads/')) {
                File::delete(public_path($resource->file_path));
            } else {
                Storage::disk('public')->delete($resource->file_path);
            }

            $file = $request->file('file');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/resources'), $filename);
            $attributes['file_path'] = 'uploads/resources/' . $filename;
        }

        if ($request->hasFile('cover_image')) {
            $attributes['cover_image_path'] = PublicImageUpload::replace($request->file('cover_image'), 'resource-covers', $resource->cover_image_path);
        }

        $resource->update($attributes);

        return back()->with('success', 'Resource updated.');
    }

    public function destroy(Resource $resource): RedirectResponse
    {
        if (str_starts_with($resource->file_path, 'uploads/')) {
            File::delete(public_path($resource->file_path));
        } else {
            // Preserve support for resources uploaded before public-folder storage.
            Storage::disk('public')->delete($resource->file_path);
        }
        if ($resource->cover_image_path) {
            File::delete(public_path(ltrim($resource->cover_image_path, '/')));
        }
        $resource->delete();

        return back()->with('success', 'Resource removed.');
    }
}
