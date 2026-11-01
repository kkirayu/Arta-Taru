<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Models\CustomerAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    private function user(Request $request)
    {
        return Auth::guard('customer')->user();
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Account/Addresses', [
            'addresses' => $this->user($request)->addresses()->orderByDesc('is_default')->latest()->get(),
            'destinations' => app(\App\Services\ShippingRateResolver::class)->destinations(),
        ]);
    }

    public function store(StoreAddressRequest $request)
    {
        $user = $this->user($request);
        $data = $request->validated();

        if ($user->addresses()->count() === 0) {
            $data['is_default'] = true;
        }

        if (! empty($data['is_default'])) {
            $user->addresses()->update(['is_default' => false]);
        }

        $user->addresses()->create($data);

        return back()->with('success', 'Alamat berhasil ditambahkan.');
    }

    public function update(StoreAddressRequest $request, CustomerAddress $address)
    {
        abort_unless($address->user_id === $this->user($request)->id, 404);

        $data = $request->validated();

        if (! empty($data['is_default'])) {
            $this->user($request)->addresses()->update(['is_default' => false]);
        }

        $address->update($data);

        return back()->with('success', 'Alamat berhasil diperbarui.');
    }

    public function destroy(Request $request, CustomerAddress $address)
    {
        abort_unless($address->user_id === $this->user($request)->id, 404);

        $wasDefault = $address->is_default;
        $address->delete();

        if ($wasDefault) {
            $this->user($request)->addresses()->latest()->first()?->update(['is_default' => true]);
        }

        return back()->with('success', 'Alamat berhasil dihapus.');
    }

    public function setDefault(Request $request, CustomerAddress $address)
    {
        abort_unless($address->user_id === $this->user($request)->id, 404);

        $this->user($request)->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return back()->with('success', 'Alamat utama berhasil diubah.');
    }
}
