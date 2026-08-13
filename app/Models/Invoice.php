<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasUuidRouting;

    protected $fillable = [
        'membership_application_id',
        'company_id',
        'invoice_number',
        'file_path',
        'tier_name',
        'amount',
        'currency',
        'billing_period',
        'status',
        'issued_at',
        'sent_at',
        'due_date',
        'paid_at',
        'marked_paid_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'issued_at' => 'datetime',
        'sent_at' => 'datetime',
        'due_date' => 'date',
        'paid_at' => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function membershipApplication(): BelongsTo
    {
        return $this->belongsTo(MembershipApplication::class);
    }

    public function markedPaidBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_paid_by');
    }
}
