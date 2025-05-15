<?php

namespace Modules\Project\Repositories;

use Modules\Project\Models\Project;

class ProjectRepository
{
    public function list()
    {
        return Project::latest()->paginate(10);
    }

    public function create(array $data)
    {
        return Project::create($data);
    }

    public function find(int $id): ?Project
    {
        return Project::findOrFail($id);
    }

    public function update(int $id, array $data)
    {
        $project = $this->find($id);
        $project->update($data);
        return $project;
    }

    public function delete(int $id): void
    {
        $this->find($id)->delete();
    }

    public function findWithIssues(int $id): Project
    {
        return Project::with('issues')->findOrFail($id);
    }
}
