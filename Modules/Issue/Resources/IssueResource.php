<?php

namespace Modules\Issue\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Modules\Issue\Enums\IssueStatus;
use Modules\Project\Resources\ProjectResource;
use Modules\User\Resources\UserResource;

class IssueResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,

            'status' => $this->status,
            'due_date' => $this->due_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'project' => $this->project,
            'comments' => $this->comments? CommentResource::collection($this->comments) : [],
            'reported_by' => new UserResource($this->reporter),
        ];
    }
}
