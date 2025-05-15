<?php
namespace Modules\Issue\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Modules\Issue\Requests\CreateIssueRequest;
use Modules\Issue\Requests\ExportIssueRequest;
use Modules\Issue\Requests\UpdateIssueRequest;
use Modules\Issue\Requests\UpdateIssueStatusRequest;
use Modules\Issue\Requests\ListIssuesRequest;
use Modules\Issue\Resources\IssueResource;
use Modules\Issue\Services\IssueService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class IssueController extends Controller
{
    public function __construct(protected IssueService $issueService) {}

    public function index(ListIssuesRequest $request): AnonymousResourceCollection
    {
        $issues = $this->issueService->listIssues($request->all());
        return IssueResource::collection($issues);
    }

    public function store(CreateIssueRequest $request): JsonResponse
    {
        $issue = $this->issueService->createIssue($request->validated());
        return response()->json(new IssueResource($issue), 201);
    }

    public function show(int $id): JsonResponse
    {
        $issue = $this->issueService->findIssue($id);
        return response()->json(new IssueResource($issue));
    }

    public function update(UpdateIssueRequest $request, int $id): JsonResponse
    {
        $issue = $this->issueService->updateIssue($id, $request->validated());
        return response()->json(new IssueResource($issue));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->issueService->deleteIssue($id);
        return response()->json(['message' => 'Issue deleted successfully']);
    }

    public function updateStatus(UpdateIssueStatusRequest $request, int $id): JsonResponse
    {
        $issue = $this->issueService->updateIssueStatus($id, $request->validated());
        return response()->json(new IssueResource($issue));
    }

    public function exportPdf(ExportIssueRequest $request)
    {
        return $this->issueService->exportPdf($request->all());
    }
}
