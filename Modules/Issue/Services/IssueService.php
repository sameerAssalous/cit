<?php
namespace Modules\Issue\Services;

use Modules\Issue\Models\Issue;
use Modules\Issue\Repositories\IssueRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Barryvdh\DomPDF\Facade\Pdf;

class IssueService
{
    public function __construct(protected IssueRepository $repository) {}

    public function listIssues(array $filters): LengthAwarePaginator
    {
        return $this->repository->list($filters);
    }

    public function createIssue(array $data): Issue
    {
        $data['reported_by'] = auth()->id();
        return $this->repository->create($data);
    }

    public function findIssue(int $id): ?Issue
    {
        $issue = $this->repository->find($id);

        if (!$issue) {
            throw new \Exception('Issue not found', 404);
        }

        return $issue;
    }

    public function updateIssue(int $id, array $data): Issue
    {
        $issue = $this->findIssue($id);
        return $this->repository->update($issue, $data);
    }

    public function deleteIssue(int $id): void
    {
        $issue = $this->findIssue($id);
        $this->repository->delete($issue);
    }

    public function updateIssueStatus(int $id, array $data): Issue
    {
        $issue = $this->findIssue($id);
        $issue->status = $data['status'];
        $issue->save();
        return $issue->fresh();
    }

    public function exportPdf(array $filters)
    {
        $issues = $this->repository->listAll($filters);
        $pdf = Pdf::loadView('pdf.issues', ['issues' => $issues]);
        return $pdf->download('issues.pdf');
    }
}
