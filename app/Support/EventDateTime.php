<?php

namespace App\Support;

use Carbon\CarbonImmutable;

class EventDateTime
{
    public const TIMEZONE = 'Africa/Dar_es_Salaam';

    /** Convert a timezone-free datetime-local form value from EAT to UTC storage. */
    public static function fromLocalInput(?string $value): ?CarbonImmutable
    {
        if (! $value) {
            return null;
        }

        return CarbonImmutable::createFromFormat('Y-m-d\TH:i', substr($value, 0, 16), self::TIMEZONE)
            ->utc();
    }
}
