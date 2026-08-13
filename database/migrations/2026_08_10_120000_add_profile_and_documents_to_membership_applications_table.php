<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('membership_applications', function (Blueprint $table) {
            $table->text('company_profile')->nullable()->after('notes');
            $table->string('certificate_of_incorporation_path')->nullable()->after('company_profile');
            $table->string('business_license_path')->nullable()->after('certificate_of_incorporation_path');
            $table->string('tin_certificate_path')->nullable()->after('business_license_path');
        });
    }

    public function down(): void
    {
        Schema::table('membership_applications', function (Blueprint $table) {
            $table->dropColumn([
                'company_profile',
                'certificate_of_incorporation_path',
                'business_license_path',
                'tin_certificate_path',
            ]);
        });
    }
};
