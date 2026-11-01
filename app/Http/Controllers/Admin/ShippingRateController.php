<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingRate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShippingRateController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ShippingRate::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('province', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/ShippingRates/Index', [
            'rates' => $query->orderBy('province')->orderBy('city')->paginate(30)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        ShippingRate::create($this->validated($request));

        return back()->with('success', 'Tarif ongkir ditambahkan.');
    }

    public function update(Request $request, ShippingRate $shippingRate)
    {
        $shippingRate->update($this->validated($request));

        return back()->with('success', 'Tarif ongkir diperbarui.');
    }

    public function destroy(ShippingRate $shippingRate)
    {
        $shippingRate->delete();

        return back()->with('success', 'Tarif ongkir dihapus.');
    }

    public function toggleActive(ShippingRate $shippingRate)
    {
        $shippingRate->update(['is_active' => ! $shippingRate->is_active]);

        return back()->with('success', 'Status tarif diperbarui.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'province' => ['required', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'cost' => ['required', 'numeric', 'min:0'],
            'free_shipping_min_total' => ['nullable', 'numeric', 'min:0'],
            'eta_min_days' => ['required', 'integer', 'min:0', 'max:60'],
            'eta_max_days' => ['required', 'integer', 'min:0', 'max:60', 'gte:eta_min_days'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
