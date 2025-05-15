<?php

namespace Modules\Issue\Requests;

namespace Modules\Issue\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExportIssueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'from_date' => ['nullable', 'date'],
            'to_date' => ['nullable', 'date'],
        ];
    }
}
