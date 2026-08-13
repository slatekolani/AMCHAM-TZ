<?php

namespace App\Support;

class UrlNormalizer
{
    /** Prepends https:// to a bare domain/path (e.g. "www.example.com") so admins don't have to remember the scheme. */
    public static function normalize(?string $value): ?string
    {
        $value = trim((string) $value);

        if ($value === '') {
            return null;
        }

        if (! preg_match('#^https?://#i', $value)) {
            $value = 'https://' . $value;
        }

        return $value;
    }
}
