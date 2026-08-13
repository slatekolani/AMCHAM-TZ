<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MembershipApplication;
use App\Services\MembershipApprovalService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MembershipApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        return Inertia::render('Admin/MembershipApplications/Index', [
            'applications' => MembershipApplication::with(['user:id,name,email', 'tier:id,name', 'invoice'])
                ->when($status, fn ($query) => $query->where('status', $status))
                ->latest()
                ->get(),
            'filters' => ['status' => $status],
        ]);
    }

    public function update(Request $request, MembershipApplication $membershipApplication, MembershipApprovalService $approvalService): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,approved,rejected'],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $membershipApplication->update([
            ...$data,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        $requiresPayment = false;
        if ($data['status'] === 'approved') {
            $requiresPayment = $membershipApplication->tier_price !== null && (float) $membershipApplication->tier_price > 0;
            $approvalService->provision($membershipApplication);
        }

        return back()->with('success', match (true) {
            $data['status'] === 'approved' && $requiresPayment => 'Membership approved. An invoice has been emailed to the applicant — the company goes live once payment is confirmed.',
            $data['status'] === 'approved' => 'Membership approved. The company is now active and visible in the member directory.',
            default => 'Membership application updated.',
        });
    }

    public function destroy(MembershipApplication $membershipApplication): RedirectResponse
    {
        $membershipApplication->delete();

        return back()->with('success', 'Membership application removed.');
    }
}
