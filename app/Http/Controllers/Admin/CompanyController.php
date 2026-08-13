<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\MembershipTier;
use App\Rules\SafeEmail;
use App\Support\PublicImageUpload;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Companies/Index', [
            'companies' => Company::with('membershipTier')
                ->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status))
                ->orderBy('name')
                ->get(),
            'filters' => ['status' => $request->string('status')->toString()],
        ]);
    }

    public function edit(Company $company): Response
    {
        return Inertia::render('Admin/Companies/Edit', [
            'company' => [
                ...$company->toArray(),
                'documents' => $company->documents()->latest()->get(),
                'latest_invoice' => $company->latestInvoice,
            ],
            'membershipTiers' => MembershipTier::orderBy('sort_order')->get(),
        ]);
    }

    public function update(Request $request, Company $company): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'membership_tier_id' => ['nullable', 'exists:membership_tiers,id'],
            'sector' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'website' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255', new SafeEmail()],
            'address' => ['nullable', 'string', 'max:255'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        unset($data['cover_image']);
        unset($data['logo']);
        if ($request->hasFile('logo')) {
            $data['logo_path'] = PublicImageUpload::replace($request->file('logo'), 'company-logos', $company->logo_path);
        }
        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = PublicImageUpload::replace($request->file('cover_image'), 'company-covers', $company->cover_image_path);
        }

        $company->update($data);

        return back()->with('success', 'Company updated.');
    }

    public function approve(Company $company): RedirectResponse
    {
        $company->update(['status' => 'approved', 'approved_at' => now()]);

        return back()->with('success', "{$company->name} approved.");
    }

    public function suspend(Company $company): RedirectResponse
    {
        $company->update(['status' => 'suspended']);

        return back()->with('success', "{$company->name} suspended.");
    }

    public function destroy(Company $company): RedirectResponse
    {
        $company->delete();

        return back()->with('success', 'Company removed.');
    }
}
