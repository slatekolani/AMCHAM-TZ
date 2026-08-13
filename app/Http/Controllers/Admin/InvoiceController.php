<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\MembershipInvoiceMail;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class InvoiceController extends Controller
{
    public function send(Request $request, Invoice $invoice): RedirectResponse
    {
        $data = $request->validate([
            'invoice_file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:15360'],
        ]);

        $invoice->loadMissing(['membershipApplication.user', 'company']);
        $recipient = $invoice->membershipApplication->user->email;

        if ($invoice->file_path) {
            Storage::disk('public')->delete($invoice->file_path);
        }

        $invoice->update([
            'file_path' => $request->file('invoice_file')->store('membership-invoices', 'public'),
            'sent_at' => now(),
        ]);

        Mail::to($recipient)->send(new MembershipInvoiceMail($invoice->membershipApplication, $invoice->company, $invoice->fresh()));

        return back()->with('success', "Invoice #{$invoice->invoice_number} emailed to {$recipient}.");
    }

    public function markPaid(Invoice $invoice): RedirectResponse
    {
        if ($invoice->status !== 'paid') {
            $invoice->update([
                'status' => 'paid',
                'paid_at' => now(),
                'marked_paid_by' => Auth::id(),
            ]);
        }

        $company = $invoice->company;
        if ($company->status !== 'approved') {
            $company->update(['status' => 'approved', 'approved_at' => $company->approved_at ?? now()]);
        }

        return back()->with('success', "Invoice #{$invoice->invoice_number} marked as paid. {$company->name} is now active.");
    }
}
