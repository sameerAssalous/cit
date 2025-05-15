<?php

namespace Modules\Project\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Modules\User\Resources\UserResource;

class ProjectResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'issues' => $this->issues ? $this->issues->map(fn($issue) => [
                'id' => $issue->id,
                'title' => $issue->title,
                'description' => $issue->description,
                'status' => $issue->status,
                'created_at' => $issue->created_at,
                'updated_at' => $issue->updated_at,
            ]) : [],
            'manager' => $this->manager ?  new UserResource($this->manager): null,
            'name' => $this->name,
            'description' => $this->description,
            'location' => $this->location,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
