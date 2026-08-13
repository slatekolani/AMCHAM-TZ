<?php

namespace Tests\Feature;

use App\Models\MembershipTier;
use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class MembershipApplicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_selected_tier_survives_account_registration_and_returns_to_application(): void
    {
        $tier = $this->tier();

        $this->get(route('membership.join', $tier->slug))
            ->assertRedirect(route('register'))
            ->assertSessionHas('url.intended', route('membership.join', $tier->slug));

        $this->post(route('register'), [
            'name' => 'Jane Applicant',
            'email' => 'jane@company.co.tz',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])->assertRedirect(route('membership.join', $tier->slug));

        $this->assertAuthenticated();
    }

    public function test_authenticated_user_can_submit_application_with_tier_snapshot(): void
    {
        Storage::fake('public');
        $tier = $this->tier();
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('membership.join.store', $tier->slug), [
            'applicant_name' => $user->name,
            'email' => $user->email,
            'phone' => '+255 700 000 000',
            'company_name' => 'Applicant Company Ltd',
            'job_title' => 'Director',
            'sector' => 'Technology',
            'website' => 'https://example.co.tz',
            'logo' => UploadedFile::fake()->image('company-logo.png', 400, 400),
            'notes' => 'Interested in advocacy programmes.',
            'terms_accepted' => true,
        ])->assertRedirect(route('membership'));

        $this->assertDatabaseHas('membership_applications', [
            'user_id' => $user->id,
            'membership_tier_id' => $tier->id,
            'tier_name' => 'Gold',
            'tier_price' => 2500,
            'status' => 'pending',
        ]);
        $logoPath = $user->membershipApplications()->firstOrFail()->logo_path;
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $logoPath));
    }

    public function test_member_can_upload_and_replace_company_logo_from_profile_editor(): void
    {
        Storage::fake('public');
        Role::create(['name' => 'member']);
        $company = Company::create(['name' => 'Member Company', 'slug' => 'member-company', 'status' => 'approved']);
        $user = User::factory()->create(['company_id' => $company->id, 'email_verified_at' => now()]);
        $user->assignRole('member');

        $this->actingAs($user)->post(route('member.profile.update'), [
            '_method' => 'put',
            'sector' => 'Technology',
            'logo' => UploadedFile::fake()->image('new-logo.png', 500, 300),
        ])->assertSessionHasNoErrors();

        $company->refresh();
        $this->assertStringStartsWith('/storage/company-logos/', $company->logo_path);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $company->logo_path));
    }

    public function test_user_cannot_submit_a_second_membership_application(): void
    {
        $tier = $this->tier();
        $user = User::factory()->create();
        $user->membershipApplications()->create([
            'membership_tier_id' => $tier->id,
            'tier_name' => $tier->name,
            'tier_price' => $tier->price,
            'tier_currency' => $tier->currency,
            'tier_billing_period' => $tier->billing_period,
            'tier_benefits' => $tier->benefits,
            'applicant_name' => $user->name,
            'email' => $user->email,
            'phone' => '+255 700 000 000',
            'company_name' => 'First Company Ltd',
        ]);

        $this->actingAs($user)
            ->get(route('membership.join', $tier->slug))
            ->assertRedirect(route('membership'))
            ->assertSessionHas('success');

        $this->actingAs($user)->post(route('membership.join.store', $tier->slug), [
            'applicant_name' => $user->name,
            'email' => $user->email,
            'phone' => '+255 711 111 111',
            'company_name' => 'Second Company Ltd',
            'terms_accepted' => true,
        ])->assertRedirect(route('membership'));

        $this->assertDatabaseCount('membership_applications', 1);
    }

    public function test_approving_application_creates_visible_company_and_links_member(): void
    {
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'member']);
        $admin = User::factory()->create(['email_verified_at' => now()]);
        $admin->assignRole('admin');
        $applicant = User::factory()->create();
        $tier = $this->tier();
        $application = $applicant->membershipApplications()->create([
            'membership_tier_id' => $tier->id,
            'tier_name' => $tier->name,
            'tier_price' => $tier->price,
            'tier_currency' => $tier->currency,
            'tier_billing_period' => $tier->billing_period,
            'tier_benefits' => $tier->benefits,
            'applicant_name' => $applicant->name,
            'email' => $applicant->email,
            'phone' => '+255 700 000 000',
            'company_name' => 'New Approved Company',
            'sector' => 'Technology',
            'logo_path' => '/storage/membership-application-logos/logo.png',
        ]);

        $this->actingAs($admin)->put(route('admin.membership-applications.update', $application), [
            'status' => 'approved',
            'admin_notes' => 'Approved for membership.',
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('companies', [
            'name' => 'New Approved Company',
            'membership_tier_id' => $tier->id,
            'status' => 'approved',
        ]);
        $applicant->refresh();
        $this->assertNotNull($applicant->company_id);
        $this->assertTrue($applicant->hasRole('member'));
        $this->get(route('members'))->assertSee('New Approved Company');
    }

    private function tier(): MembershipTier
    {
        return MembershipTier::create([
            'name' => 'Gold',
            'slug' => 'gold',
            'price' => 2500,
            'currency' => 'USD',
            'billing_period' => 'year',
            'audience' => 'Established companies',
            'description' => 'Premium chamber membership.',
            'benefits' => ['Premium profile', 'Event access'],
            'sort_order' => 1,
            'is_active' => true,
        ]);
    }
}
