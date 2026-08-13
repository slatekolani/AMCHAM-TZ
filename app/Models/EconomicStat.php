<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Model;

class EconomicStat extends Model
{
    use HasUuidRouting;

    protected $fillable = [
        'category',
        'label',
        'value',
        'period',
        'description',
        'source',
        'source_url',
        'is_featured',
        'sort_order',
        'trend',
        'chart_group',
        'chart_title',
        'trend_value_prefix',
        'trend_value_suffix',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'trend' => 'array',
    ];
}
