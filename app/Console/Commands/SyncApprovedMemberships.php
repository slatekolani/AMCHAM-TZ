<?php

namespace App\Console\Commands;

use App\Models\MembershipApplication;
use App\Services\MembershipApprovalService;
use Illuminate\Console\Command;

class SyncApprovedMemberships extends Command
{
    protected $signature = 'membership:sync-approved';

    protected $description = 'Create or update companies for approved membership applications';

    public function handle(MembershipApprovalService $approvalService): int
    {
        $count = 0;
        MembershipApplication::where('status', 'approved')->with('user.company')->each(function ($application) use ($approvalService, &$count) {
            $approvalService->provision($application);
            $count++;
        });

        $this->info("Synced {$count} approved membership application(s).");

        return self::SUCCESS;
    }
}
