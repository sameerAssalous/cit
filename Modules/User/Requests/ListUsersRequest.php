<?php

namespace Modules\User\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListUsersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string' ],
            'email' => ['nullable', 'string', ],
            'role' => ['nullable', 'string'],
        ];
    }
}
