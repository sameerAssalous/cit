<?php

namespace Modules\Issue\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            //'issue_id' => ['required', 'integer', 'exists:issues,id'],
            'comment' => ['required', 'string'],
        ];
    }
}
