<?php

namespace App\Modules\Issue\Observers;

use Illuminate\Support\Facades\Auth;
use Modules\Issue\Models\Issue;

class IssueObserver
{
    /**
     * Handle the Issue "created" event.
     */
    public function created(Issue $issue): void
    {
        $this->logAction($issue, 'create-issues', [
            'issue_id' => $issue->id,
            'title' => $issue->title,
            'project_id' => $issue->project_id,
            'reporter_id' => $issue->reporter_id,
            'status' => $issue->status
        ]);
    }

    /**
     * Handle the Issue "updated" event.
     */
    public function updated(Issue $issue): void
    {
        $changes = $issue->getDirty();
        $original = $issue->getOriginal();

        // If status was changed, log it as a specific action
        if (isset($changes['status'])) {
            $this->logAction($issue, 'resolve-issues', [
                'issue_id' => $issue->id,
                'old_status' => $original['status'],
                'new_status' => $changes['status']
            ]);
        }

        $this->logAction($issue, 'edit-issues', [
            'issue_id' => $issue->id,
            'changes' => $changes,
            'original' => $original
        ]);
    }

    /**
     * Handle the Issue "deleted" event.
     */
    public function deleted(Issue $issue): void
    {
        $this->logAction($issue, 'delete-issues', [
            'issue_id' => $issue->id,
            'title' => $issue->title,
            'project_id' => $issue->project_id
        ]);
    }

    /**
     * Log the action to the tracking table
     */
    private function logAction(Issue $issue, string $action, array $info = []): void
    {
        $currentUser = Auth::user();

        \DB::table('trackings')->insert([
            'user_id' => $currentUser ? $currentUser->id : null,
            'action' => $action,
            'model_type' =>'Issue',
            'model_id' => $issue->id,
            'info' => json_encode($info),
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
