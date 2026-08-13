<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendEmailCampaignJob;
use App\Models\EmailCampaign;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailCampaignController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Campaigns/Email/Index', [
            'campaigns' => EmailCampaign::withCount('logs')->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Campaigns/Email/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'audience' => ['required', 'in:subscribers,members,all'],
        ]);

        $data['created_by'] = $request->user()->id;
        $data['status'] = 'draft';

        EmailCampaign::create($data);

        return redirect()->route('admin.campaigns.email.index')->with('success', 'Campaign saved as draft.');
    }

    public function send(EmailCampaign $emailCampaign): RedirectResponse
    {
        abort_unless($emailCampaign->status === 'draft', 403, 'Only draft campaigns can be sent.');

        SendEmailCampaignJob::dispatch($emailCampaign);

        return back()->with('success', 'Campaign queued for sending.');
    }

    public function destroy(EmailCampaign $emailCampaign): RedirectResponse
    {
        abort_if($emailCampaign->status === 'sending', 403);
        $emailCampaign->delete();

        return back()->with('success', 'Campaign removed.');
    }
}
