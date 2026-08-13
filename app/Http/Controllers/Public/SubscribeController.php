<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Rules\SafeEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SubscribeController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', new SafeEmail()],
        ]);

        Subscriber::updateOrCreate(
            ['email' => $data['email']],
            ['name' => $data['name'] ?? null, 'status' => 'subscribed', 'source' => 'website']
        );

        return back()->with('success', 'You are subscribed to AMCHAM Tanzania updates.');
    }

    public function unsubscribe(string $token): RedirectResponse
    {
        $subscriber = Subscriber::where('token', $token)->firstOrFail();
        $subscriber->update(['status' => 'unsubscribed']);

        return redirect('/')->with('success', 'You have been unsubscribed from AMCHAM Tanzania updates.');
    }
}
