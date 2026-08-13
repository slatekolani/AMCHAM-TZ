<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyDocument extends Model
{
    use HasFactory, HasUuidRouting;

    protected $fillable = [
        'company_id',
        'uploaded_by',
        'title',
        'file_path',
        'visibility',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
