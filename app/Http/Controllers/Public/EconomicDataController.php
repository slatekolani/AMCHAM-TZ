<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\EconomicStat;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class EconomicDataController extends Controller
{
    public function trade(): Response
    {
        return $this->render('trade');
    }

    public function investment(): Response
    {
        return $this->render('investment');
    }

    private function render(string $category): Response
    {
        $stats = EconomicStat::where('category', $category)->orderBy('sort_order')->get();

        // Stats with a chart_group render only as a trend chart, not as a duplicate list/card entry.
        $chartStats = $stats->whereNotNull('chart_group');
        $listStats = $stats->whereNull('chart_group');

        $charts = $chartStats->groupBy('chart_group')->map(function ($group) {
            $first = $group->first();

            return [
                'title' => $group->pluck('chart_title')->filter()->first() ?? $first->label,
                'prefix' => $first->trend_value_prefix,
                'suffix' => $first->trend_value_suffix,
                'series' => $group->map(fn (EconomicStat $stat) => [
                    'label' => $stat->label,
                    'data' => $stat->trend ?? [],
                ])->values(),
            ];
        })->values();

        return Inertia::render('Public/EconomicData', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'pageMode' => $category,
            'featured' => $listStats->where('is_featured', true)->values(),
            'more' => $listStats->where('is_featured', false)->values(),
            'charts' => $charts,
        ]);
    }
}
