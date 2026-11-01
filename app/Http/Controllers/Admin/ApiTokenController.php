<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ApiTokenController extends Controller
{
    /**
     * Show the API token management page.
     */
    public function index(Request $request): Response
    {
        $tokens = $request->user()->tokens()->latest()->paginate(10);

        return Inertia::render('Admin/ApiTokens/Index', [
            'tokens' => $tokens,
        ]);
    }

    /**
     * Store a new API token.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'abilities' => ['sometimes', 'array'],
            'expires_at' => ['sometimes', 'date'],
        ]);

        $abilities = $request->input('abilities', ['*']);
        $expiresAt = $request->input('expires_at') 
            ? \Illuminate\Support\Carbon::parse($request->input('expires_at')) 
            : null;

        $token = $request->user()->createToken($request->name, $abilities, $expiresAt);

        return back()->with([
            'success' => 'API token berhasil dibuat.',
            'token' => $token->plainTextToken,
        ]);
    }

    /**
     * Revoke an API token.
     */
    public function destroy(Request $request, string $tokenId): RedirectResponse
    {
        $request->user()->tokens()->where('id', $tokenId)->delete();

        return back()->with('success', 'API token berhasil dihapus.');
    }
}