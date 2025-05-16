<?php

namespace Modules\Project\Controllers;

use App\Http\Controllers\Controller;
use Modules\Project\Requests\CreateProjectRequest;
use Modules\Project\Requests\UpdateProjectRequest;
use Modules\Project\Requests\ExportProjectIssuesRequest;
use Modules\Project\Services\ProjectService;
use Modules\Project\Resources\ProjectResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectController extends Controller
{
    public function __construct(protected ProjectService $projectService) {}

    public function index(): AnonymousResourceCollection
    {
        return ProjectResource::collection($this->projectService->listProjects());
    }

    public function store(CreateProjectRequest $request): JsonResponse
    {
        $project = $this->projectService->createProject($request->validated());
        return response()->json(new ProjectResource($project), 201);
    }

    public function show(int $id): JsonResponse
    {
        $project = $this->projectService->findProject($id);
        return response()->json(new ProjectResource($project));
    }

    public function update(UpdateProjectRequest $request, int $id): JsonResponse
    {
        $project = $this->projectService->updateProject($id, $request->validated());
        return response()->json(new ProjectResource($project));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->projectService->deleteProject($id);
        return response()->json(['message' => 'Project deleted successfully']);
    }

    public function exportIssues(ExportProjectIssuesRequest $request, int $projectId)
    {
        return $this->projectService->exportProjectIssuesToPDF($projectId);
    }
}
