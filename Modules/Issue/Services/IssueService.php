<?php
namespace Modules\Issue\Services;

use Modules\Issue\Models\Attachment;
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
        $attachment = $data['attachment'] ?? null;
        unset($data['attachment']);
        $issue = $this->repository->create($data);
        // upload attachment of this issue and save it

        if ($attachment && $attachment instanceof \Illuminate\Http\UploadedFile) {
            $path = $attachment->store('attachments', 'public');
            $attachments = Attachment::query()->create([
                'issue_id' => $issue->id,
                'file_path' => $path,
                'file_name' => $attachment->getClientOriginalName(),
                'file_type' => $attachment->getClientMimeType(),
            ]);
        }
        return $issue;
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

    public function exportPdf(int $id)
    {
        $issues = $this->repository->listAll(['id' => $id]);
        $pdf = Pdf::loadView('pdf.issues', ['issues' => $issues]);
        return $pdf->download('issues.pdf');
    }

    public function addComment(int $issueId, string $content, $user)
    {
        $issue = $this->findIssue($issueId);
        return $this->repository->addComment($issue, $content, $user);

    }
}
