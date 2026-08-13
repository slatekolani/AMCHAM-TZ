<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BoardMember extends Model
{
    use HasUuidRouting;
    protected $fillable = ['company_id', 'name', 'role_title', 'bio', 'photo_path', 'linkedin_url', 'sort_order', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
