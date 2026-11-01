<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentProofRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Vercel caps request bodies at 4.5 MB, so keep uploads under 4 MB.
            'proof' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:4096'],
            'bank_name' => ['nullable', 'string', 'max:64'],
        ];
    }

    public function messages(): array
    {
        return [
            'proof.required' => 'Bukti transfer wajib diunggah.',
            'proof.mimes' => 'Format file harus JPG, PNG, WEBP, atau PDF.',
            'proof.max' => 'Ukuran file maksimal 4 MB.',
        ];
    }
}
