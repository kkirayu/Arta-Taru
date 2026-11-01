<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
            'two_factor_code' => ['sometimes', 'string', 'size:6'],
            'recovery_code' => ['sometimes', 'string', 'size:8'],
        ];
    }

    /**
     * Get the validation messages.
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Password wajib diisi.',
            'two_factor_code.size' => 'Kode 2FA harus 6 digit.',
            'recovery_code.size' => 'Kode recovery harus 8 karakter.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->filled('two_factor_code') && $this->filled('recovery_code')) {
                $validator->errors()->add(
                    'two_factor_code',
                    'Gunakan kode 2FA atau kode recovery, tidak keduanya.'
                );
            }
        });
    }
}