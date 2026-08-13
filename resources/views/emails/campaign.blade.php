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
                            <span style="color:#f0d99a;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;font-size:12px;">AMCHAM Tanzania</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;line-height:1.7;font-size:15px;">
                            {!! $bodyHtml !!}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 32px;border-top:1px solid #eadfc8;font-size:12px;color:#667085;">
                            You are receiving this email because you subscribed to AMCHAM Tanzania updates or hold an active membership.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
