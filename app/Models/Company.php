<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Company extends Model
{
    use HasFactory, HasUuidRouting, LogsActivity;

    protected $fillable = [
        'membership_tier_id',
        'name',
        'slug',
        'sector',
        'logo_path',
        'cover_image_path',
        'description',
        'website',
        'phone',
        'email',
        'address',
        'status',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnlyDirty()->logFillable();
    }

    public function membershipTier(): BelongsTo
    {
        return $this->belongsTo(MembershipTier::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(CompanyDocument::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function latestInvoice(): HasOne
    {
        return $this->hasOne(Invoice::class)->latestOfMany();
    }

    public function newsArticles(): HasMany
    {
        return $this->hasMany(NewsArticle::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function boardMember(): HasOne
    {
        return $this->hasOne(BoardMember::class);
    }

    public function testimonial(): HasOne
    {
        return $this->hasOne(Testimonial::class);
    }

    /** News and event publishing is reserved for active (approved) Platinum-tier members. */
    public function hasPublishingAccess(): bool
    {
        return $this->status === 'approved' && strtolower((string) $this->membershipTier?->name) === 'platinum';
    }

    /** Testimonials are reserved for approved companies whose leadership sits on the AMCHAM board. */
    public function canSubmitTestimonial(): bool
    {
        return $this->status === 'approved' && $this->boardMember()->where('is_active', true)->exists();
    }
}
