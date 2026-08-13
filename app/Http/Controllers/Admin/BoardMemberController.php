<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BoardMember;
use App\Models\Company;
use App\Support\UrlNormalizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BoardMemberController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/BoardMembers/Index', [
            'boardMembers' => BoardMember::with('company:id,uuid,name')->orderBy('sort_order')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/BoardMembers/Edit', [
            'boardMember' => null,
            'companies' => Company::where('status', 'approved')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        if ($request->hasFile('photo')) {
            $data['photo_path'] = '/storage/' . $request->file('photo')->store('board-members', 'public');
        }
        unset($data['photo']);
        BoardMember::create($data);

        return redirect()->route('admin.board-members.index')->with('success', 'Board member added.');
    }

    public function edit(BoardMember $boardMember): Response
    {
        return Inertia::render('Admin/BoardMembers/Edit', [
            'boardMember' => $boardMember,
            'companies' => Company::where('status', 'approved')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, BoardMember $boardMember): RedirectResponse
    {
        $data = $this->validated($request);
        if ($request->hasFile('photo')) {
            if ($boardMember->photo_path && str_starts_with($boardMember->photo_path, '/storage/board-members/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $boardMember->photo_path));
            }
            $data['photo_path'] = '/storage/' . $request->file('photo')->store('board-members', 'public');
        }
        unset($data['photo']);
        $boardMember->update($data);

        return redirect()->route('admin.board-members.index')->with('success', 'Board member updated.');
    }

    public function destroy(BoardMember $boardMember): RedirectResponse
    {
        if ($boardMember->photo_path && str_starts_with($boardMember->photo_path, '/storage/board-members/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $boardMember->photo_path));
        }
        $boardMember->delete();

        return back()->with('success', 'Board member removed.');
    }

    private function validated(Request $request): array
    {
        $request->merge(['linkedin_url' => UrlNormalizer::normalize($request->input('linkedin_url'))]);

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role_title' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:3000'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'company_id' => ['nullable', 'exists:companies,id'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);
    }
}
