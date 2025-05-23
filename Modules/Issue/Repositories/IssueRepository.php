<?php
namespace Modules\Issue\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Issue\Models\Comment;
use Modules\Issue\Models\Issue;

class IssueRepository
{
    public function __construct(protected Issue $model) {}

    public function create(array $data): Issue
    {
        return $this->model->create($data);
    }

    public function update(Issue $issue, array $data): Issue
    {
        $issue->update($data);
        return $issue;
    }

    public function find(int $id): ?Issue
    {
        return $this->model->with('project')->find($id);
    }

    public function list(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with('project');

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['id'])) {
            $query->where('id', $filters['id']);
        }

        if (isset($filters['title'])) {
            $query->where('title', 'like', '%' . $filters['title'] . '%');
        }

        $perPage = $filters['per_page'] ?? 15;
        $page = $filters['page'] ?? 1;
        if(request()->user()->roles->first()->name == 'project_manager'){
            // get only issues of user prjects
            $query->whereHas('project', function ($query) {
                $query->where('manager_id', request()->user()->id);
            });
        }
        if(request()->user()->roles->first()->name == 'employee'){
                // get only issues of user prjects
                $query->where('reported_by', request()->user()->id);
        }
        return $query->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);
    }

    public function listAll(array $filters = [])
    {
        return $this->list($filters)->getCollection();
    }

    public function delete(Issue $issue): bool
    {
        return $issue->delete();
    }

    public function addComment(Issue $issue, string $content, $user)
    {
        $comment = new  Comment();
        $comment->issue_id = $issue->id;
        $comment->user_id = $user->id;
        $comment->comment = $content;
        $comment->save();


        return $comment;
    }
}
