<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CampaignMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $campaignSubject,
        public string $bodyHtml,
    ) {
    }

    public function build(): self
    {
        return $this->subject($this->campaignSubject)
            ->view('emails.campaign')
            ->with(['bodyHtml' => $this->bodyHtml]);
    }
}
