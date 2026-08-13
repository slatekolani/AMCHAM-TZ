<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendWhatsAppCampaignJob;
use App\Models\WhatsAppCampaign;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WhatsAppCampaignController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Campaigns/WhatsApp/Index', [
            'campaigns' => WhatsAppCampaign::withCount('logs')->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Campaigns/WhatsApp/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:1024'],
            'audience' => ['required', 'in:subscribers,members,all'],
        ]);

        $data['created_by'] = $request->user()->id;
        $data['status'] = 'draft';

        WhatsAppCampaign::create($data);

        return redirect()->route('admin.campaigns.whatsapp.index')->with('success', 'WhatsApp campaign saved as draft.');
    }

    public function send(WhatsAppCampaign $whatsappCampaign): RedirectResponse
    {
        abort_unless($whatsappCampaign->status === 'draft', 403, 'Only draft campaigns can be sent.');

        SendWhatsAppCampaignJob::dispatch($whatsappCampaign);

        return back()->with('success', 'WhatsApp campaign queued for sending.');
    }

    public function destroy(WhatsAppCampaign $whatsappCampaign): RedirectResponse
    {
        abort_if($whatsappCampaign->status === 'sending', 403);
        $whatsappCampaign->delete();

        return back()->with('success', 'Campaign removed.');
    }
}
