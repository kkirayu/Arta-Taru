<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $delivery = $this->input('shipping_method', 'delivery') === 'delivery';

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:32', 'regex:/^[0-9+\-\s()]+$/'],
            'shipping_method' => ['required', 'in:delivery,pickup'],
            'address_line' => [$delivery ? 'required' : 'nullable', 'string', 'max:500'],
            'province' => [$delivery ? 'required' : 'nullable', 'string', 'max:100'],
            'city' => [$delivery ? 'required' : 'nullable', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'shipping_courier' => ['nullable', 'string', 'max:64'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'save_address' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama penerima wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'phone.required' => 'Nomor WhatsApp wajib diisi.',
            'phone.regex' => 'Nomor WhatsApp tidak valid.',
            'shipping_method.required' => 'Pilih metode pengiriman.',
            'address_line.required' => 'Alamat lengkap wajib diisi.',
            'province.required' => 'Provinsi wajib dipilih.',
            'city.required' => 'Kota/kabupaten wajib dipilih.',
        ];
    }
}
