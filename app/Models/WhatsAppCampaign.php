<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class WhatsAppCampaign extends Model
{
    use HasFactory, HasUuidRouting;

    protected $table = 'whatsapp_campaigns';

    protected $fillable = [
        'message',
        'template_name',
        'audience',
        'audience_filter',
        'status',
        'scheduled_at',
        'sent_at',
        'cost_estimate',
        'created_by',
    ];

    protected $casts = [
        'audience_filter' => 'array',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function logs(): MorphMany
    {
        return $this->morphMany(NotificationLog::class, 'campaign');
    }
}
