<?php

namespace Modules\Project\Services;

use Modules\Project\Repositories\ProjectRepository;

class ProjectService
{
    public function __construct(protected ProjectRepository $projectRepository) {}

    public function listProjects()
    {
        return $this->projectRepository->list();
    }

    public function createProject(array $data)
    {
        return $this->projectRepository->create($data);
    }

    public function findProject(int $id)
    {
        return $this->projectRepository->find($id);
    }

    public function updateProject(int $id, array $data)
    {
        return $this->projectRepository->update($id, $data);
    }

    public function deleteProject(int $id): void
    {
        $this->projectRepository->delete($id);
    }

    public function exportProjectIssuesToPDF(int $projectId): string
    {
        $project = $this->projectRepository->findWithIssues($projectId);

        $pdf = \PDF::loadView('pdf.project_issues', compact('project'));
        $filePath = storage_path("app/public/projects/project_{$projectId}_issues.pdf");
        $pdf->save($filePath);

        return asset("storage/projects/project_{$projectId}_issues.pdf");
    }
}
