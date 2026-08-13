<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EconomicStat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EconomicStatController extends Controller
{
    public function index(Request $request): Response
    {
        $category = $request->string('category')->toString();

        return Inertia::render('Admin/EconomicStats/Index', [
            'stats' => EconomicStat::when($category, fn ($query) => $query->where('category', $category))
                ->orderBy('category')
                ->orderBy('sort_order')
                ->get(),
            'filters' => ['category' => $category],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/EconomicStats/Edit', ['stat' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        EconomicStat::create($this->validated($request));

        return redirect()->route('admin.economic-stats.index')->with('success', 'Stat added.');
    }

    public function edit(EconomicStat $economicStat): Response
    {
        return Inertia::render('Admin/EconomicStats/Edit', ['stat' => $economicStat]);
    }

    public function update(Request $request, EconomicStat $economicStat): RedirectResponse
    {
        $economicStat->update($this->validated($request));

        return redirect()->route('admin.economic-stats.index')->with('success', 'Stat updated.');
    }

    public function destroy(EconomicStat $economicStat): RedirectResponse
    {
        $economicStat->delete();

        return back()->with('success', 'Stat removed.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'category' => ['required', 'in:trade,investment'],
            'label' => ['required', 'string', 'max:255'],
            'value' => ['required', 'string', 'max:255'],
            'period' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:2000'],
            'source' => ['nullable', 'string', 'max:255'],
            'source_url' => ['nullable', 'url', 'max:255'],
            'is_featured' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'chart_group' => ['nullable', 'string', 'max:100'],
            'chart_title' => ['nullable', 'string', 'max:255'],
            'trend_value_prefix' => ['nullable', 'string', 'max:10'],
            'trend_value_suffix' => ['nullable', 'string', 'max:10'],
            'trend' => ['nullable', 'array'],
            'trend.*.period' => ['required_with:trend', 'string', 'max:50'],
            'trend.*.value' => ['required_with:trend', 'numeric'],
        ]);
    }
}
