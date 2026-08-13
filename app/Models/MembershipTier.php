<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MembershipTier extends Model
{
    use HasFactory, HasUuidRouting;

    protected $fillable = [
        'name',
        'slug',
        'price',
        'currency',
        'billing_period',
        'audience',
        'description',
        'benefits',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'benefits' => 'array',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function companies(): HasMany
    {
        return $this->hasMany(Company::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(MembershipApplication::class);
    }
}
