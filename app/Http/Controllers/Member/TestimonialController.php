<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function edit(): Response
    {
        $company = Auth::user()->company;

        return Inertia::render('Member/Testimonial/Edit', [
            'eligible' => $company?->canSubmitTestimonial() ?? false,
            'testimonial' => $company?->testimonial,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $company = Auth::user()->company;
        abort_unless($company?->canSubmitTestimonial(), 403);
        abort_if($company->testimonial, 422, 'A testimonial already exists for this company.');

        $company->testimonial()->create($this->validated($request));

        return back()->with('success', 'Testimonial published to the homepage.');
    }

    public function update(Request $request): RedirectResponse
    {
        $testimonial = Auth::user()->company?->testimonial;
        abort_unless($testimonial, 404);

        $testimonial->update($this->validated($request));

        return back()->with('success', 'Testimonial updated.');
    }

    public function toggle(): RedirectResponse
    {
        $testimonial = Auth::user()->company?->testimonial;
        abort_unless($testimonial, 404);

        $testimonial->update(['is_active' => ! $testimonial->is_active]);

        return back()->with('success', $testimonial->is_active ? 'Testimonial is live on the homepage.' : 'Testimonial hidden from the homepage.');
    }

    public function destroy(): RedirectResponse
    {
        $testimonial = Auth::user()->company?->testimonial;
        abort_unless($testimonial, 404);

        $testimonial->delete();

        return back()->with('success', 'Testimonial removed. You can write a new one any time.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'quote' => ['required', 'string', 'max:600'],
        ]);
    }
}
