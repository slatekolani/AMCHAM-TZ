<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MembershipApplication extends Model
{
    use HasUuidRouting;
    protected $fillable = [
        'user_id', 'membership_tier_id', 'tier_name', 'tier_price', 'tier_currency',
        'tier_billing_period', 'tier_benefits', 'applicant_name', 'email', 'phone',
        'company_name', 'job_title', 'sector', 'website', 'logo_path', 'notes', 'company_profile',
        'certificate_of_incorporation_path', 'business_license_path', 'tin_certificate_path', 'status',
        'reviewed_by', 'reviewed_at', 'admin_notes',
    ];

    protected $casts = [
        'tier_price' => 'decimal:2',
        'tier_benefits' => 'array',
        'reviewed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tier(): BelongsTo
    {
        return $this->belongsTo(MembershipTier::class, 'membership_tier_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }
}
