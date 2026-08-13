<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Event extends Model
{
    use HasFactory, HasUuidRouting, LogsActivity;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'location',
        'starts_at',
        'ends_at',
        'cover_image_path',
        'category',
        'registration_url',
        'company_id',
        'status',
        'hide_from_list',
        'audience',
        'published_at',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'published_at' => 'datetime',
        'audience_notified_at' => 'datetime',
        'hide_from_list' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnlyDirty()->logFillable();
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('starts_at', '>=', now());
    }

    public function scopePendingReview($query)
    {
        return $query->where('status', 'pending_review');
    }

    public function scopePublicAudience($query)
    {
        return $query->where('audience', 'public');
    }

    /** Public events are visible to anyone; members-only events require an active (approved/paid) member company, or staff. */
    public function scopeVisibleTo($query, ?User $user)
    {
        return $query->where(function ($inner) use ($user) {
            $inner->where('audience', 'public');

            if ($user && ($user->hasRole(['admin', 'super-admin']) || $user->company?->status === 'approved')) {
                $inner->orWhere('audience', 'members');
            }
        });
    }

    public function isVisibleTo(?User $user): bool
    {
        if ($this->audience === 'public') {
            return true;
        }

        if (! $user) {
            return false;
        }

        return $user->hasRole(['admin', 'super-admin']) || $user->company?->status === 'approved';
    }
}
