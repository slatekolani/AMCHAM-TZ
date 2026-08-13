<?php

namespace App\Support;

/**
 * Defense-in-depth email validation, independent of Laravel's built-in
 * "email" rule (egulias/email-validator).
 *
 * Mitigates GHSA-5vg9-5847-vvmq / CVE-2026-48019 — a CRLF injection
 * advisory in Laravel's default email validation that, combined with how
 * Symfony Mailer/Mime handle certain sequences, can let a crafted address
 * inject extra mail headers. Laravel has no fix in the 10.x line (only
 * 12.60+/13.10+), so every address that reaches an outbound Mail::to() call
 * in this app — whether it just passed Laravel's "email" rule or was read
 * back from the database — is re-checked with this independent validator
 * before use.
 */
class EmailSafety
{
    public static function isSafe(?string $email): bool
    {
        if (! is_string($email) || $email === '') {
            return false;
        }

        // Reject raw or percent-encoded control characters (CR, LF, NUL, etc.)
        if (preg_match('/[\x00-\x1F\x7F]/', $email) === 1) {
            return false;
        }

        if (preg_match('/%0[0-9a-f]/i', $email) === 1) {
            return false;
        }

        // Reject header-injection markers and multi-address/comment forms —
        // a single plain mailbox address is all this app ever needs to send to.
        if (str_contains($email, ',') || str_contains($email, ';')
            || str_contains($email, '<') || str_contains($email, '>')
            || str_contains($email, '(') || str_contains($email, ')')
            || preg_match('/\s/', $email) === 1) {
            return false;
        }

        // Independent validator (PHP's own parser, not egulias/email-validator).
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
}
