<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Media extends Model
{
    use HasFactory, HasUuidRouting;

    protected $table = 'media';

    protected $fillable = [
        'uploaded_by',
        'disk',
        'path',
        'filename',
        'description',
        'mime_type',
        'size',
    ];

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getUrlAttribute(): string
    {
        if ($this->disk === 'public_uploads' || str_starts_with($this->path, 'uploads/')) {
            return '/' . ltrim($this->path, '/');
        }

        // Use a host-relative URL so legacy images do not depend on APP_URL.
        if ($this->disk === 'public') {
            return '/storage/' . ltrim($this->path, '/');
        }

        return \Storage::disk($this->disk)->url($this->path);
    }
}
