<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        @php
            $heroSlides = json_decode(\App\Models\Setting::get('hero_carousel_slides', '[]'), true) ?: [];
            $seoFallbackImage = collect($heroSlides)->pluck('main_image')->filter()->first()
                ?? '/images/amcham-live/hero-minara.jpg';
            $seoPages = [
                '/' => ['AMCHAM Tanzania | American Chamber of Commerce in Tanzania', 'AMCHAM Tanzania advances trade and investment between the United States and Tanzania through advocacy, events, business insight and a trusted member network.', $seoFallbackImage],
                '/about-us' => ['About AMCHAM Tanzania', 'Learn about the American Chamber of Commerce in Tanzania, our mission, leadership and work advancing bilateral commerce.', '/images/amcham-live/boards.jpg'],
                '/board-members' => ['AMCHAM Tanzania Board Members', 'Meet the business leaders guiding AMCHAM Tanzania and strengthening U.S.–Tanzania commercial relationships.', '/images/amcham-live/boards.jpg'],
                '/membership' => ['AMCHAM Tanzania Membership', 'Join AMCHAM Tanzania to access advocacy, executive networking, business intelligence and opportunities across Tanzania.', '/images/amcham-live/hero-minara.jpg'],
                '/events' => ['AMCHAM Tanzania Events', 'Discover AMCHAM Tanzania events, policy briefings, business forums and networking opportunities in Dar es Salaam and beyond.', '/images/amcham-live/thanksgiving.png'],
                '/news' => ['AMCHAM Tanzania News and Business Insights', 'Read AMCHAM Tanzania news, policy updates, member stories and insight on trade and investment in Tanzania.', '/images/amcham-live/tic-news.jpg'],
                '/members' => ['AMCHAM Tanzania Members', 'Explore the companies and organizations contributing to the AMCHAM Tanzania business community.', '/images/amcham-live/hero-minara.jpg'],
                '/resources' => ['AMCHAM Tanzania Business Resources', 'Access AMCHAM Tanzania investor guides, policy briefs and resources for doing business in Tanzania.', '/images/amcham-live/boards.jpg'],
                '/newsletters' => ['AMCHAM Tanzania Newsletters', 'Read and download AMCHAM Tanzania newsletters featuring chamber news, events, member updates and business insight.', '/images/amcham-live/tic-news.jpg'],
                '/gallery' => ['AMCHAM Tanzania Gallery', 'View highlights from AMCHAM Tanzania events, business forums and community activities.', '/images/amcham-live/thanksgiving.png'],
                '/contact-us' => ['Contact AMCHAM Tanzania', 'Contact the AMCHAM Tanzania Secretariat in Dar es Salaam for membership, partnership and business enquiries.', '/images/amcham-live/hero-minara.jpg'],
            ];
            $seoPath = '/' . ltrim(request()->path(), '/');
            $seoPath = $seoPath === '//' ? '/' : $seoPath;
            $seo = $seoPages[$seoPath] ?? $seoPages['/'];
            $seoType = 'website';

            if (($page['component'] ?? null) === 'Public/NewsShow' && ! empty($page['props']['article'])) {
                $item = $page['props']['article'];
                $seo = [
                    $item['title'],
                    $item['excerpt'] ?: 'News and business insight from AMCHAM Tanzania.',
                    $item['cover_image_path'] ?: '/images/amcham-live/tic-news.jpg',
                ];
                $seoType = 'article';
            } elseif (($page['component'] ?? null) === 'Public/EventShow' && ! empty($page['props']['event'])) {
                $item = $page['props']['event'];
                $eventDescription = trim(strip_tags($item['description'] ?? ''));
                $seo = [
                    $item['title'],
                    $eventDescription ? mb_substr($eventDescription, 0, 160) : 'Business event from AMCHAM Tanzania.',
                    $item['cover_image_path'] ?: '/images/amcham-live/boards.jpg',
                ];
            } elseif (str_starts_with($seoPath, '/membership/join/')) {
                $seo = $seoPages['/membership'];
            }

            [$seoTitle, $seoDescription, $seoImagePath] = $seo;
            $seoCanonical = url()->current();
            $seoImage = str_starts_with($seoImagePath, 'http') ? $seoImagePath : url($seoImagePath);
        @endphp
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#14234a">
        <meta name="description" content="{{ $seoDescription }}">
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
        <meta name="geo.region" content="TZ-02">
        <meta name="geo.placename" content="Dar es Salaam, Tanzania">
        <meta name="geo.position" content="-6.754;39.282">
        <meta name="ICBM" content="-6.754, 39.282">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">

        <link rel="canonical" href="{{ $seoCanonical }}">
        <meta property="og:type" content="{{ $seoType }}">
        <meta property="og:site_name" content="AMCHAM Tanzania">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:url" content="{{ $seoCanonical }}">
        <meta property="og:image" content="{{ $seoImage }}">
        <meta property="og:image:alt" content="{{ $seoTitle }}">
        <meta property="og:locale" content="en_TZ">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoImage }}">

        <title inertia>{{ $seoTitle }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800|source-serif-4:400,600,700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="bg-white font-sans antialiased">
        @inertia
    </body>
</html>
