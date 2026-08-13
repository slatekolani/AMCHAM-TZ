<?php

namespace App\Rules;

use App\Support\EmailSafety;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Stack this alongside Laravel's built-in "email" rule wherever a
 * user-supplied address may later be used as an outbound mail recipient.
 * See App\Support\EmailSafety for why this exists.
 */
class SafeEmail implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! EmailSafety::isSafe(is_string($value) ? $value : null)) {
            $fail('The :attribute must be a valid, single email address.');
        }
    }
}
