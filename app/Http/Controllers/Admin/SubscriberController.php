<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Rules\SafeEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriberController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Subscribers/Index', [
            'subscribers' => Subscriber::latest()->paginate(30),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', new SafeEmail(), 'unique:subscribers,email'],
        ]);

        Subscriber::create([
            'name' => $data['name'] ?? null,
            'email' => $data['email'],
            'status' => 'subscribed',
            'source' => 'admin',
        ]);

        return back()->with('success', 'Subscriber added.');
    }

    public function destroy(Subscriber $subscriber): RedirectResponse
    {
        $subscriber->delete();

        return back()->with('success', 'Subscriber removed.');
    }
}
