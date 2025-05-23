<?php

namespace Modules\Project\Repositories;

use Modules\Project\Models\Project;

class ProjectRepository
{
    public function list()
    {
        $query = Project::latest();
        if(request()->user()->roles->first()->name == 'project_manager'){
            // get only issues of user prjects
                $query->where('manager_id', request()->user()->id);
        }


        return $query->paginate(20);
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
