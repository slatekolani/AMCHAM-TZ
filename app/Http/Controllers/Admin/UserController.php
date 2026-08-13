<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        abort_unless(Auth::user()?->hasRole('super-admin'), 403);

        return Inertia::render('Admin/Users/Index', [
            'users' => User::with('roles', 'company')->orderBy('name')->get()->map(fn (User $user) => [
                'id' => $user->id,
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'company' => $user->company?->name,
                'roles' => $user->getRoleNames(),
            ]),
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->user()->hasRole('super-admin'), 403);
        abort_if($request->user()->is($user), 422, 'You cannot change your own role.');

        $data = $request->validate([
            'role' => ['required', 'in:super-admin,admin,member'],
        ]);

        $user->syncRoles([$data['role']]);

        return back()->with('success', "{$user->name}'s role updated to {$data['role']}.");
    }
}
