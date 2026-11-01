<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Support\StoreSettings;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    private const PAGES = [
        'faq' => ['key' => 'faq_content', 'title' => 'Pertanyaan yang Sering Diajukan'],
        'kebijakan-privasi' => ['key' => 'privacy_policy', 'title' => 'Kebijakan Privasi'],
        'syarat-ketentuan' => ['key' => 'terms_conditions', 'title' => 'Syarat & Ketentuan'],
        'pengembalian' => ['key' => 'return_policy', 'title' => 'Kebijakan Pengembalian'],
    ];

    public function show(string $page): Response
    {
        abort_unless(isset(self::PAGES[$page]), 404);

        $config = self::PAGES[$page];
        $raw = StoreSettings::get($config['key'], '');
        $isJson = str_starts_with(trim((string) $raw), '[');

        return Inertia::render('Static/Page', [
            'title' => $config['title'],
            'slug' => $page,
            'content' => $isJson ? '' : (string) $raw,
            'items' => $isJson ? json_decode((string) $raw, true) : [],
        ]);
    }
}
