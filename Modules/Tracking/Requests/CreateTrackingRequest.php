<?php

namespace Modules\Tracking\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTrackingRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'action' => ['required', 'string'],
            'model_type' => ['required', 'string'],
            'model_id' => ['required', 'integer'],
            'info' => ['nullable', 'array'],
        ];
    }
}
