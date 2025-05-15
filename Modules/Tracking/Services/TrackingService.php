<?php

namespace Modules\Tracking\Services;

use Modules\Tracking\Repositories\TrackingRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Tracking\Models\Tracking;

class TrackingService
{
    public function __construct(protected TrackingRepository $trackingRepository) {}

    public function list(array $filters): LengthAwarePaginator
    {
        return $this->trackingRepository->list($filters);
    }

    public function create(array $data): Tracking
    {
        return $this->trackingRepository->create($data);
    }
}
