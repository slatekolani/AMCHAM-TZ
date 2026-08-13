<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Model;

class PolicyUpdate extends Model
{
    use HasUuidRouting;

    protected $fillable = ['title', 'slug', 'summary', 'body', 'cover_image_path', 'is_active', 'published_at'];

    protected $casts = [
        'is_active' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_active', true)->whereNotNull('published_at');
    }
}
