<?php

namespace Modules\Project\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExportProjectIssuesRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [];
    }
}
