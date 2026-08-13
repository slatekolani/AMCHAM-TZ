<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Model;

class WorkingGroup extends Model
{
    use HasUuidRouting;

    protected $fillable = ['title', 'slug', 'summary', 'body', 'cover_image_path', 'is_active', 'sort_order'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_active', true);
    }
}
