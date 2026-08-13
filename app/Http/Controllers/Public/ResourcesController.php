<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ResourcesController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('q')->toString() ?: null;
        $category = $request->string('category')->toString() ?: null;
        $query = Resource::query()
            ->when($category, fn ($builder) => $builder->where('category', $category))
            ->when($search, fn ($builder) => $builder->where(function ($inner) use ($search) {
                $inner->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            }));

        return Inertia::render('Public/Resources', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'resources' => $query->orderBy('category')->orderBy('title')->paginate(12)->withQueryString(),
            'categories' => Resource::whereNotNull('category')->distinct()->orderBy('category')->pluck('category'),
            'filters' => ['category' => $category, 'q' => $search],
            'pageMode' => 'resources',
        ]);
    }

    public function newsletters(Request $request): Response
    {
        $search = $request->string('q')->toString() ?: null;
        return Inertia::render('Public/Resources', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'resources' => Resource::whereRaw('LOWER(category) = ?', ['newsletter'])
                ->when($search, fn ($builder) => $builder->where(function ($inner) use ($search) {
                    $inner->where('title', 'like', "%{$search}%")->orWhere('description', 'like', "%{$search}%");
                }))
                ->latest()
                ->paginate(12)->withQueryString(),
            'categories' => [],
            'filters' => ['category' => null, 'q' => $search],
            'pageMode' => 'newsletters',
        ]);
    }

    public function download(Resource $resource): BinaryFileResponse|StreamedResponse
    {
        $extension = pathinfo($resource->file_path, PATHINFO_EXTENSION) ?: 'pdf';
        $downloadName = $resource->title . '.' . $extension;

        if (str_starts_with($resource->file_path, 'uploads/')) {
            $path = public_path($resource->file_path);

            abort_unless(File::isFile($path), 404);

            return response()->download($path, $downloadName);
        }

        // Preserve support for resources uploaded before public-folder storage.
        abort_unless(Storage::disk('public')->exists($resource->file_path), 404);

        return Storage::disk('public')->download($resource->file_path, $downloadName);
    }
}
