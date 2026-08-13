<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory, HasUuidRouting;

    protected $fillable = [
        'title',
        'description',
        'category',
        'cover_image_path',
        'file_path',
    ];

    protected $casts = [
        'audience_notified_at' => 'datetime',
    ];
}
