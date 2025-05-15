<?php

namespace Modules\Tracking\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Modules\Tracking\Requests\ListTrackingRequest;
use Modules\Tracking\Requests\CreateTrackingRequest;
use Modules\Tracking\Resources\TrackingResource;
use Modules\Tracking\Services\TrackingService;

class TrackingController extends Controller
{
    public function __construct(protected TrackingService $trackingService) {}

    public function index(ListTrackingRequest $request): AnonymousResourceCollection
    {
        $records = $this->trackingService->list($request->validated());
        return TrackingResource::collection($records);
    }

    public function store(CreateTrackingRequest $request): JsonResponse
    {
        try {
            $tracking = $this->trackingService->create($request->validated());
            return response()->json(new TrackingResource($tracking), 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }
}
