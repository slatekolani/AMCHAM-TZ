<?php

namespace App\Mail;

use App\Models\Company;
use App\Models\Invoice;
use App\Models\MembershipApplication;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class MembershipInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public MembershipApplication $application,
        public Company $company,
        public Invoice $invoice,
    ) {
    }

    public function build(): self
    {
        $mail = $this->subject("You're approved — Invoice #{$this->invoice->invoice_number} for your {$this->invoice->tier_name} membership")
            ->view('emails.membership-invoice', [
                'application' => $this->application,
                'company' => $this->company,
                'invoice' => $this->invoice,
                'siteName' => Setting::get('site_name', config('app.name')),
                'contactEmail' => Setting::get('contact_email', config('mail.from.address')),
                'contactPhone' => Setting::get('contact_phone'),
            ]);

        if ($this->invoice->file_path && Storage::disk('public')->exists($this->invoice->file_path)) {
            $extension = pathinfo($this->invoice->file_path, PATHINFO_EXTENSION) ?: 'pdf';
            $mail->attach(Storage::disk('public')->path($this->invoice->file_path), [
                'as' => "Invoice-{$this->invoice->invoice_number}.{$extension}",
            ]);
        }

        return $mail;
    }
}
