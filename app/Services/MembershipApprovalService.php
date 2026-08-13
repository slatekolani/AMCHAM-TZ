<?php

namespace App\Services;

use App\Models\Company;
use App\Models\CompanyDocument;
use App\Models\Invoice;
use App\Models\MembershipApplication;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class MembershipApprovalService
{
    public function provision(MembershipApplication $application): Company
    {
        return DB::transaction(function () use ($application) {
            $application->loadMissing('user');
            $user = $application->user;
            $company = $user->company;
            $requiresPayment = $application->tier_price !== null && (float) $application->tier_price > 0;

            $attributes = [
                'membership_tier_id' => $application->membership_tier_id,
                'name' => $application->company_name,
                'sector' => $application->sector,
                'logo_path' => $application->logo_path,
                'website' => $application->website,
                'phone' => $application->phone,
                'email' => $application->email,
            ];

            if ($application->company_profile) {
                $attributes['description'] = $application->company_profile;
            }

            if ($company) {
                $company->update($attributes);
            } else {
                $company = Company::create([
                    ...$attributes,
                    'status' => $requiresPayment ? 'pending' : 'approved',
                    'approved_at' => $requiresPayment ? null : now(),
                    'slug' => $this->uniqueSlug($application->company_name),
                ]);
                $user->update(['company_id' => $company->id]);
            }

            $this->syncDocument($company, $application->certificate_of_incorporation_path, 'Certificate of Incorporation', $user->id);
            $this->syncDocument($company, $application->business_license_path, 'Business Licence', $user->id);
            $this->syncDocument($company, $application->tin_certificate_path, 'TIN Certificate', $user->id);

            Role::firstOrCreate(['name' => 'member', 'guard_name' => 'web']);
            if (! $user->hasRole('member') && ! $user->hasAnyRole(['admin', 'super-admin'])) {
                $user->assignRole('member');
            }

            // Bookkeeping record only — an admin still has to upload the actual invoice
            // document (with bank details) and send it before the member receives anything.
            if ($requiresPayment) {
                $this->issueInvoice($application, $company);
            }

            return $company;
        });
    }

    private function issueInvoice(MembershipApplication $application, Company $company): Invoice
    {
        return Invoice::firstOrCreate(
            ['membership_application_id' => $application->id],
            [
                'company_id' => $company->id,
                'invoice_number' => $this->nextInvoiceNumber(),
                'tier_name' => $application->tier_name,
                'amount' => $application->tier_price,
                'currency' => $application->tier_currency,
                'billing_period' => $application->tier_billing_period,
                'status' => 'unpaid',
                'issued_at' => now(),
                'due_date' => now()->addDays(14),
            ],
        );
    }

    private function nextInvoiceNumber(): string
    {
        $year = now()->format('Y');
        $sequence = Invoice::whereYear('created_at', $year)->count() + 1;

        return sprintf('AMCHAM-%s-%04d', $year, $sequence);
    }

    private function syncDocument(Company $company, ?string $path, string $title, int $uploadedBy): void
    {
        if (! $path) {
            return;
        }

        CompanyDocument::updateOrCreate(
            ['company_id' => $company->id, 'title' => $title],
            ['uploaded_by' => $uploadedBy, 'file_path' => str_replace('/storage/', '', $path), 'visibility' => 'private'],
        );
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'member-company';
        $slug = $base;
        $counter = 2;

        while (Company::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
