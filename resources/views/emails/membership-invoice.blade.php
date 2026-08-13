<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ config('app.name') }}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4efe5;font-family:Arial,Helvetica,sans-serif;color:#17213d;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4efe5;padding:32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #d7c8a9;">
                    <tr>
                        <td style="background-color:#14234a;padding:24px 32px;">
                            <span style="color:#f0d99a;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;font-size:12px;">{{ $siteName }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;line-height:1.7;font-size:15px;">
                            <p style="margin:0 0 16px;">Dear {{ $application->applicant_name }},</p>
                            <p style="margin:0 0 16px;">
                                Congratulations — your membership application for <strong>{{ $company->name }}</strong> has been
                                <strong>approved</strong>. To activate your account and unlock full member benefits, please settle
                                the invoice attached to this email.
                            </p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid #eadfc8;background-color:#fbf8f0;">
                                <tr>
                                    <td style="padding:20px 24px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
                                            <tr>
                                                <td style="padding-bottom:4px;color:#667085;">Invoice number</td>
                                                <td align="right" style="padding-bottom:4px;font-weight:700;color:#14234a;">#{{ $invoice->invoice_number }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding-bottom:4px;color:#667085;">Membership</td>
                                                <td align="right" style="padding-bottom:4px;font-weight:700;color:#14234a;">{{ $invoice->tier_name }} — {{ ucfirst($invoice->billing_period) }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding-bottom:4px;color:#667085;">Amount due</td>
                                                <td align="right" style="padding-bottom:4px;font-weight:700;color:#14234a;">{{ $invoice->currency }} {{ number_format((float) $invoice->amount, 2) }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#667085;">Payment due date</td>
                                                <td align="right" style="font-weight:700;color:#cf2f3b;">{{ optional($invoice->due_date)->format('F j, Y') }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 16px;">
                                📎 Attached to this email is your official invoice, including full bank transfer and payment
                                details. Please use invoice <strong>#{{ $invoice->invoice_number }}</strong> as your payment
                                reference. Your account will be activated as soon as our finance team confirms payment.
                            </p>

                            <p style="margin:0 0 16px;">
                                Questions about this invoice? Contact us at
                                <a href="mailto:{{ $contactEmail }}" style="color:#cf2f3b;">{{ $contactEmail }}</a>
                                @if($contactPhone) or call {{ $contactPhone }} @endif.
                            </p>

                            <p style="margin:0;">Warm regards,<br>{{ $siteName }} Membership Team</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 32px;border-top:1px solid #eadfc8;font-size:12px;color:#667085;">
                            {{ $siteName }} · This email was sent to the address you registered with.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
