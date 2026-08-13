<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['super-admin', 'admin', 'member'] as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $superAdmin = User::firstOrCreate(
            ['email' => 'edgarfwalo99@gmail.com'],
            [
                'name' => 'Edgar Bonaventure Fwalo',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $superAdmin->syncRoles(['super-admin']);

        $admin = User::firstOrCreate(
            ['email' => 'admin@amcham-tz.com'],
            [
                'name' => 'AMCHAM Administrator',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles(['admin']);
    }
}
