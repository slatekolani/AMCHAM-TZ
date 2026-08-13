<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class NewsArticle extends Model
{
    use HasFactory, HasUuidRouting, LogsActivity;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'body',
        'cover_image_path',
        'category',
        'author_id',
        'company_id',
        'status',
        'published_at',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'audience_notified_at' => 'datetime',
    ];

    protected $appends = ['reading_time'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnlyDirty()->logFillable();
    }

    /** Estimated reading time in whole minutes, at ~200 words per minute. */
    public function getReadingTimeAttribute(): int
    {
        $words = str_word_count(strip_tags($this->body ?? ''));

        return max(1, (int) ceil($words / 200));
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')->whereNotNull('published_at');
    }

    public function scopePendingReview($query)
    {
        return $query->where('status', 'pending_review');
    }
}
