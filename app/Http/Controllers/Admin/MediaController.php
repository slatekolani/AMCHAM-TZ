<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Media/Index', [
            'media' => Media::latest()->paginate(24)->through(fn (Media $item) => [
                'id' => $item->id,
                'uuid' => $item->uuid,
                'filename' => $item->filename,
                'description' => $item->description,
                'mime_type' => $item->mime_type,
                'size' => $item->size,
                'url' => $item->url,
                'created_at' => $item->created_at,
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'image', 'max:10240'],
            'description' => ['required', 'string', 'max:1000'],
        ]);

        $file = $request->file('file');
        // UploadedFile metadata must be read before move(). After the move, Symfony's
        // SplFileInfo still points at PHP's deleted temporary path and getSize() can throw.
        $originalName = $file->getClientOriginalName();
        $mimeType = $file->getClientMimeType();
        $size = $file->getSize();
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('uploads/media'), $filename);
        $path = 'uploads/media/' . $filename;

        Media::create([
            'uploaded_by' => $request->user()->id,
            'disk' => 'public_uploads',
            'path' => $path,
            'filename' => $originalName,
            'description' => $request->string('description')->toString(),
            'mime_type' => $mimeType,
            'size' => $size,
        ]);

        return back()->with('success', 'Image uploaded to media library.');
    }

    public function update(Request $request, Media $media): RedirectResponse
    {
        $data = $request->validate(['description' => ['required', 'string', 'max:1000']]);
        $media->update($data);

        return back()->with('success', 'Image description updated.');
    }

    public function destroy(Media $media): RedirectResponse
    {
        if ($media->disk === 'public_uploads' || str_starts_with($media->path, 'uploads/')) {
            File::delete(public_path($media->path));
        } else {
            // Preserve support for media uploaded before public-folder storage.
            Storage::disk($media->disk)->delete($media->path);
        }
        $media->delete();

        return back()->with('success', 'Media removed.');
    }
}
