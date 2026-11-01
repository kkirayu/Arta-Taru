<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:50'],
            'recipient_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32', 'regex:/^[0-9+\-\s()]+$/'],
            'province' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'address_line' => ['required', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:500'],
            'is_default' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'label.required' => 'Label alamat wajib diisi.',
            'recipient_name.required' => 'Nama penerima wajib diisi.',
            'phone.required' => 'Nomor WhatsApp wajib diisi.',
            'province.required' => 'Provinsi wajib dipilih.',
            'city.required' => 'Kota/kabupaten wajib dipilih.',
            'address_line.required' => 'Alamat lengkap wajib diisi.',
        ];
    }
}
