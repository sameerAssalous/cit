<?php

namespace App\Modules\User\Observers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        $this->logAction($user, 'create-users', [
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->roles->pluck('name')->toArray()
        ]);
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        $changes = $user->getDirty();
        $original = $user->getOriginal();

        $this->logAction($user, 'edit-users', [
            'user_id' => $user->id,
            'changes' => $changes,
            'original' => $original
        ]);
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        $this->logAction($user, 'delete-users', [
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email
        ]);
    }

    /**
     * Log the action to the tracking table
     */
    private function logAction(User $user, string $action, array $info = []): void
    {
        $currentUser = Auth::user();

        \DB::table('trackings')->insert([
            'user_id' => $currentUser ? $currentUser->id : null,
            'action' => $action,
            'model_type' => 'User',
            'model_id' => $user->id,
            'info' => json_encode($info),
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
