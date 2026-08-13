<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membership_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('membership_tier_id')->nullable()->constrained()->nullOnDelete();
            $table->string('tier_name');
            $table->decimal('tier_price', 10, 2)->nullable();
            $table->string('tier_currency', 3);
            $table->string('tier_billing_period');
            $table->json('tier_benefits')->nullable();
            $table->string('applicant_name');
            $table->string('email');
            $table->string('phone', 50);
            $table->string('company_name');
            $table->string('job_title')->nullable();
            $table->string('sector')->nullable();
            $table->string('website')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->index(['membership_tier_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_applications');
    }
};
