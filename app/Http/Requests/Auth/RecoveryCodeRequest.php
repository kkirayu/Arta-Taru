<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RecoveryCodeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'size:8'],
        ];
    }

    /**
     * Get the validation messages.
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Kode recovery wajib diisi.',
            'code.size' => 'Kode recovery harus 8 karakter.',
        ];
    }
}