<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Pages/Index', [
            'pages' => Page::orderBy('title')->get(),
        ]);
    }

    public function edit(Page $page): Response
    {
        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
        ]);
    }

    public function update(Request $request, Page $page): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'array'],
            'content.blocks' => ['nullable', 'array'],
            'content.blocks.*.id' => ['required', 'string'],
            'content.blocks.*.type' => ['required', 'string', 'in:hero,stats,heading_text,values_grid,tag_list,fact,timeline'],
            'content.blocks.*.data' => ['required', 'array'],
            'content.blocks.*.data.items.*.image_upload' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'content.copy' => ['nullable', 'array'],
            'content.copy.*' => ['nullable', 'string', 'max:2000'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', 'in:draft,published'],
        ]);

        foreach ($data['content']['blocks'] ?? [] as &$block) {
            if (($block['type'] ?? null) !== 'values_grid') {
                continue;
            }

            foreach ($block['data']['items'] ?? [] as &$item) {
                if (($item['image_upload'] ?? null) instanceof \Illuminate\Http\UploadedFile) {
                    $item['image'] = '/storage/' . $item['image_upload']->store('page-card-images', 'public');
                }
                unset($item['image_upload']);
            }
            unset($item);
        }
        unset($block);

        $page->update($data);

        return back()->with('success', 'Page updated.');
    }
}
