<?php

namespace Modules\Tracking\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Modules\User\Resources\UserResource;

class TrackingResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user_name' => $this->user?->name ?? '',
            'action' => $this->action,
            'model_type' => $this->model_type,
            'model_id' => $this->model_id,
            'info' => $this->info,
            'created_at' => $this->created_at,
        ];
    }
}
