<?php

namespace Modules\Tracking\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListTrackingRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'action' => ['nullable', 'string'],
            'user_id' => ['nullable', 'integer'],
            'model_type' => ['nullable', 'string'],
            'per_page' => ['nullable', 'integer'],
            'page' => ['nullable', 'integer']
        ];
    }
}
