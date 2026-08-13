<?php

namespace App\Providers;

use App\Services\Notifications\LogWhatsAppProvider;
use App\Services\Notifications\WhatsAppCloudApiProvider;
use App\Services\Notifications\WhatsAppProviderContract;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(WhatsAppProviderContract::class, function () {
            $config = config('services.whatsapp');

            if ($config['provider'] === 'cloud_api' && $config['phone_number_id'] && $config['access_token']) {
                return new WhatsAppCloudApiProvider($config['phone_number_id'], $config['access_token']);
            }

            return new LogWhatsAppProvider();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        if (! in_array(request()->getHost(), ['localhost', '127.0.0.1'], true)) {
            URL::forceScheme('https');
        }
    }
}
