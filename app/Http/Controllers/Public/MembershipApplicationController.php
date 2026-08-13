<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\MembershipTier;
use App\Rules\SafeEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MembershipApplicationController extends Controller
{
    public function create(Request $request, MembershipTier $tier): Response|RedirectResponse
    {
        abort_unless($tier->is_active, 404);

        if (! $request->user()) {
            $request->session()->put('url.intended', route('membership.join', $tier->slug));
            $request->session()->put('selected_membership_tier', $tier->id);

            return redirect()->route('register')->with('status', "Create your account to continue with the {$tier->name} membership application.");
        }

        if ($application = $request->user()->membershipApplications()->latest()->first()) {
            return redirect()->route('membership')->with(
                'success',
                "You already submitted a {$application->tier_name} membership application. Its current status is {$application->status}.",
            );
        }

        return Inertia::render('Public/MembershipJoin', [
            'canLogin' => true,
            'canRegister' => true,
            'tier' => $tier,
        ]);
    }

    public function store(Request $request, MembershipTier $tier): RedirectResponse
    {
        abort_unless($tier->is_active, 404);

        if ($application = $request->user()->membershipApplications()->latest()->first()) {
            return redirect()->route('membership')->with(
                'success',
                "You already submitted a {$application->tier_name} membership application. Its current status is {$application->status}.",
            );
        }

        $data = $request->validate([
            'applicant_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', new SafeEmail()],
            'phone' => ['required', 'string', 'max:50'],
            'company_name' => ['required', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'sector' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'company_profile' => ['nullable', 'string', 'max:5000'],
            'certificate_of_incorporation' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'business_license' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'tin_certificate' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'terms_accepted' => ['accepted'],
        ]);

        unset($data['terms_accepted']);
        if ($request->hasFile('logo')) {
            $data['logo_path'] = '/storage/' . $request->file('logo')->store('membership-application-logos', 'public');
        }
        unset($data['logo']);

        foreach ([
            'certificate_of_incorporation' => 'certificate_of_incorporation_path',
            'business_license' => 'business_license_path',
            'tin_certificate' => 'tin_certificate_path',
        ] as $field => $pathKey) {
            if ($request->hasFile($field)) {
                $data[$pathKey] = '/storage/' . $request->file($field)->store('membership-application-documents', 'public');
            }
            unset($data[$field]);
        }

        $request->user()->membershipApplications()->create([
            ...$data,
            'membership_tier_id' => $tier->id,
            'tier_name' => $tier->name,
            'tier_price' => $tier->price,
            'tier_currency' => $tier->currency,
            'tier_billing_period' => $tier->billing_period,
            'tier_benefits' => $tier->benefits,
        ]);
        $request->session()->forget('selected_membership_tier');

        return redirect()->route('membership')->with('success', 'Your membership application has been submitted for review.');
    }
}
