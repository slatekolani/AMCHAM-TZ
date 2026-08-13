# AMCHAM Tanzania Digital Platform

A Laravel 10 + Inertia.js + React (TypeScript) + Tailwind platform for the American Chamber of Commerce in Tanzania: a public corporate site, a member company portal with a content-approval workflow, a CMS, role-based administration, and Email/WhatsApp communication tooling.

## Stack

- Laravel 10, Inertia.js, React 18 + TypeScript, Tailwind CSS, MySQL
- `spatie/laravel-permission` for role-based access control (`super-admin`, `admin`, `member`)
- `spatie/laravel-activitylog` for the admin activity log / audit trail
- TipTap for rich-text editing (news articles, events, email campaigns)

## Setup

```bash
composer install
npm install
cp .env.example .env   # if .env doesn't already exist
php artisan key:generate
php artisan storage:link
```

Set `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` in `.env` to point at a MySQL database, then:

```bash
php artisan migrate --seed
```

This seeds:
- Roles and a super-admin account: `edgarfwalo99@gmail.com` / `password`
- An admin account: `admin@amcham-tz.com` / `password`
- A demo member-portal login tied to CRDB Bank: `member@crdbbank.example.com` / `password`
- Membership tiers, sample member companies, published news/events/resources, and one pending news submission (to see the approval workflow immediately)

Run the app:

```bash
php artisan serve
npm run dev
```

### Background jobs (email announcements and campaigns)

Campaign sends are queued (`QUEUE_CONNECTION=database`). Run a worker locally:

```bash
php artisan queue:work
```

Without a worker running, campaigns will stay `sending` until a worker processes the queue.

## Content editable from the admin — nothing is hardcoded

Every piece of public content (home hero/stats, About, Membership tiers, Events, News, Members directory, Resources, Contact info, site settings) is stored in the database and editable from `/admin`, not hardcoded in the frontend.

### CMS page editor — visual blocks, no JSON

`/admin/pages/{page}/edit` is a block-based visual editor: each page (Home, About, Membership, Contact) is a stack of typed sections — Hero banner, Stats strip, Heading & text, Values grid, Tag list, Single fact — each with its own plain-language form (text inputs, a rich-text editor for body copy, add/remove rows for repeatable lists). Admins add, remove, reorder (move up/down), and edit sections without ever seeing or writing JSON. The underlying storage is still a JSON column (`pages.content`), but that's purely an implementation detail — see `resources/js/Components/Admin/PageBlockEditor.tsx` for the block editors and `resources/js/utils/blocks.ts` for how the public pages read them back out.

## Roles

- **super-admin / admin** — full access to `/admin`: Pages, Companies (approve/suspend), News & Events moderation queues, Resources, Media library, Subscribers, Settings, Users & roles, Email/WhatsApp campaigns, activity log.
- **member** — access to `/member-portal`: edit their company's public profile, draft and submit news articles/events for review, upload company documents. Submissions go through: `draft → pending_review → published` or `rejected` (with a reason shown back to the member), with email notifications at each step.

## WhatsApp — enabling live sending

By default `WHATSAPP_PROVIDER=log` — campaigns are created and "sent" normally, but messages are only written to `storage/logs/laravel.log`, not actually delivered. This is intentional: no live sending happens until real credentials are supplied.

To go live:

- **WhatsApp (Meta Cloud API)** — set `WHATSAPP_PROVIDER=cloud_api` and fill in `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN` in `.env`. Note: Meta only allows freeform text messages within a 24-hour customer service window — broadcast campaigns outside that window require a pre-approved message template, which is not implemented here.

The WhatsApp provider implements `App\Services\Notifications\WhatsAppProviderContract`, bound in `App\Providers\AppServiceProvider`, so a different gateway can be swapped in without touching the campaign controller or job.

## Email

Email campaigns send via Laravel's Mail facade — real and functional out of the box, no external cost. `MAIL_MAILER=log` locally (emails land in `storage/logs/laravel.log`); set proper SMTP/Mailgun/Postmark/SES credentials in `.env` for production sending.

Publishing or approving a news article or event, and uploading a resource categorized as `Newsletter`, automatically queues a one-time announcement email to all approved member-company email addresses and active website subscribers. Duplicate addresses are collapsed and unsafe addresses are rejected before notifications are queued. Keep `php artisan queue:work` running in production to deliver these messages.

## Testing

`php artisan test` runs against an isolated in-memory SQLite database (`phpunit.xml` sets `DB_CONNECTION=sqlite` / `DB_DATABASE=:memory:`) — it never touches your dev MySQL database. Keep those two lines uncommented; they were commented out in the original scaffold, which meant `RefreshDatabase` silently wiped the real dev database on every test run.

## Security note: Laravel email-validation CRLF advisory (GHSA-5vg9-5847-vvmq / CVE-2026-48019)

`laravel/framework` has an upstream advisory where the built-in `email` validation rule can let a crafted address through that, combined with how Symfony Mailer/Mime handle certain sequences, injects extra mail headers (CRLF injection) once that address is used as a `Mail::to()` recipient. The fix only ships in 12.60+/13.10+ — there is no patched release in the 10.x line, and Laravel's advisory documents no other workaround.

Since a major-version upgrade is a separate, much larger effort, this app mitigates it directly instead of silently living with it:

- `App\Support\EmailSafety` — an independent email check (rejects raw/percent-encoded control characters, header-injection markers like `<`, `,`, `;`, whitespace; cross-validates with PHP's own `filter_var(FILTER_VALIDATE_EMAIL)`, which doesn't share Laravel's parser).
- `App\Rules\SafeEmail` — stacked alongside Laravel's `email` rule on every form that accepts a public/user-supplied address that can end up as a mail recipient: registration, login, password reset, the public contact form, the newsletter subscribe form, and the company profile email field (admin + member).
- A second, independent check at the actual send sink in `App\Jobs\SendEmailCampaignJob` — every recipient is re-validated with `EmailSafety::isSafe()` immediately before `Mail::to()->send()`, so even a record that reached the database through some other path (a seeder, a future import, direct DB access) can't smuggle a malicious address into an outgoing email.

This closes the actual exploitable path (attacker-controlled address → outbound mail) without needing the upstream patch. Confirmed with `php artisan test` (all 25 existing tests still pass) and a manual check that a CRLF/percent-encoded payload is rejected while normal addresses are accepted.

## Known gaps / deliberate scope boundaries

- Campaign audience targeting is coarse (`subscribers` / `members` / `all`) — no per-tier or per-sector segmentation yet.
