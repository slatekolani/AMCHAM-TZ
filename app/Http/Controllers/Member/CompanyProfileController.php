<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Rules\SafeEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Support\PublicImageUpload;
use Inertia\Inertia;
use Inertia\Response;

class CompanyProfileController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Member/Profile/Edit', [
            'company' => Auth::user()->company,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $company = Auth::user()->company;
        abort_unless($company, 404);

        $data = $request->validate([
            'sector' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'website' => ['nullable', 'url:http,https', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255', new SafeEmail()],
            'address' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
        ]);

        if ($request->hasFile('logo')) {
            if ($company->logo_path && str_starts_with($company->logo_path, '/storage/company-logos/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $company->logo_path));
            }
            $data['logo_path'] = '/storage/' . $request->file('logo')->store('company-logos', 'public');
        }
        unset($data['logo']);
        unset($data['cover_image']);

        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = PublicImageUpload::replace($request->file('cover_image'), 'company-covers', $company->cover_image_path);
        }

        $company->update($data);

        return back()->with('success', 'Company profile updated.');
    }
}
