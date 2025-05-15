<?php

namespace Modules\Tracking\Repositories;

use Modules\Tracking\Models\Tracking;
use Illuminate\Pagination\LengthAwarePaginator;

class TrackingRepository
{
    public function __construct(protected Tracking $model) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (isset($filters['action'])) {
            $query->where('action', $filters['action']);
        }

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['model_type'])) {
            $query->where('model_type', $filters['model_type']);
        }

        $perPage = $filters['per_page'] ?? 15;
        $page = $filters['page'] ?? 1;

        return $query->orderByDesc('created_at')->paginate($perPage, ['*'], 'page', $page);
    }

    public function create(array $data): Tracking
    {
        return $this->model->create($data);
    }
}
