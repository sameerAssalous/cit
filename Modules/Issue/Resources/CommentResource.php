<?php

namespace Modules\Issue\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Modules\User\Resources\UserResource;

class CommentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'issue_id' => $this->issue_id,
            'user' => new UserResource($this->user),
            'comment' => $this->comment,
            'created_at' => $this->created_at,
        ];
    }
}
