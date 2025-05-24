<?php
namespace Modules\Issue\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateIssueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['required', 'exists:projects,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'due_date' => ['nullable', 'date'],
            'attachment' => ['nullable', 'file']
        ];
    }
}
