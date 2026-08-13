<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class PublicImageUpload
{
    public static function replace(UploadedFile $file, string $directory, ?string $oldPath = null): string
    {
        $filename = Str::uuid() . '.' . strtolower($file->getClientOriginalExtension());
        $relativePath = "uploads/{$directory}/{$filename}";

        $file->move(public_path("uploads/{$directory}"), $filename);

        $managedPrefix = "/uploads/{$directory}/";
        if ($oldPath && str_starts_with($oldPath, $managedPrefix)) {
            File::delete(public_path(ltrim($oldPath, '/')));
        }

        return '/' . $relativePath;
    }
}
