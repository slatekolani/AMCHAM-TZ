<?php

namespace App\Models;

use App\Models\Concerns\HasUuidRouting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Subscriber extends Model
{
    use HasFactory, HasUuidRouting;

    protected $fillable = [
        'name',
        'email',
        'status',
        'source',
        'token',
    ];

    protected static function booted(): void
    {
        static::creating(function (Subscriber $subscriber) {
            $subscriber->token ??= Str::random(40);
        });
    }

    public function scopeSubscribed($query)
    {
        return $query->where('status', 'subscribed');
    }
}
