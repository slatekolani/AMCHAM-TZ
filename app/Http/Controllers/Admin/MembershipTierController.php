<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MembershipTier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MembershipTierController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/MembershipTiers/Index', [
            'tiers' => MembershipTier::withCount('applications')->orderBy('sort_order')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/MembershipTiers/Edit', ['tier' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['name']);
        MembershipTier::create($data);

        return redirect()->route('admin.membership-tiers.index')->with('success', 'Membership tier created.');
    }

    public function edit(MembershipTier $membershipTier): Response
    {
        return Inertia::render('Admin/MembershipTiers/Edit', ['tier' => $membershipTier]);
    }

    public function update(Request $request, MembershipTier $membershipTier): RedirectResponse
    {
        $membershipTier->update($this->validated($request));

        return redirect()->route('admin.membership-tiers.index')->with('success', 'Membership tier updated.');
    }

    public function destroy(MembershipTier $membershipTier): RedirectResponse
    {
        if ($membershipTier->applications()->exists() || $membershipTier->companies()->exists()) {
            return back()->with('error', 'This tier is in use. Deactivate it instead of deleting it.');
        }

        $membershipTier->delete();

        return back()->with('success', 'Membership tier deleted.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'size:3'],
            'billing_period' => ['required', 'string', 'max:50'],
            'audience' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'benefits' => ['required', 'array', 'min:1'],
            'benefits.*' => ['required', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);
        $data['currency'] = strtoupper($data['currency']);

        return $data;
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $counter = 2;
        while (MembershipTier::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }
        return $slug;
    }
}
