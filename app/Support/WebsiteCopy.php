<?php

namespace App\Support;

use App\Models\Setting;

class WebsiteCopy
{
    public static function groups(): array
    {
        return config('website-copy.groups', []);
    }

    public static function defaults(): array
    {
        return collect(self::groups())->flatMap(fn (array $group) => $group['fields'])->all();
    }

    public static function values(): array
    {
        $saved = json_decode(Setting::get('website_copy', '{}'), true);

        return array_replace(self::defaults(), is_array($saved) ? $saved : []);
    }
}
