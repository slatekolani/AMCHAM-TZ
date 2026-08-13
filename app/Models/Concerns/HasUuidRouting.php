<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait HasUuidRouting
{
    public static function bootHasUuidRouting(): void
    {
        static::creating(function ($model): void {
            $model->uuid ??= (string) Str::uuid();
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
