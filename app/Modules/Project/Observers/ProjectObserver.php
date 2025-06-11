<?php

namespace App\Modules\Project\Observers;

use Illuminate\Support\Facades\Auth;
use Modules\Project\Models\Project;

class ProjectObserver
{
    /**
     * Handle the Project "created" event.
     */
    public function created(Project $project): void
    {
        $this->logAction($project, 'create-projects', [
            'project_id' => $project->id,
            'name' => $project->name,
            'location' => $project->location,
            'manager_id' => $project->manager_id
        ]);
    }

    /**
     * Handle the Project "updated" event.
     */
    public function updated(Project $project): void
    {
        $changes = $project->getDirty();
        $original = $project->getOriginal();

        $this->logAction($project, 'edit-projects', [
            'project_id' => $project->id,
            'changes' => $changes,
            'original' => $original
        ]);
    }

    /**
     * Handle the Project "deleted" event.
     */
    public function deleted(Project $project): void
    {
        $this->logAction($project, 'delete-projects', [
            'project_id' => $project->id,
            'name' => $project->name,
            'location' => $project->location
        ]);
    }

    /**
     * Log the action to the tracking table
     */
    private function logAction(Project $project, string $action, array $info = []): void
    {
        $currentUser = Auth::user();

        \DB::table('trackings')->insert([
            'user_id' => $currentUser ? $currentUser->id : 0,
            'action' => $action,
            'model_type' => 'Project',
            'model_id' => $project->id,
            'info' => json_encode($info),
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
