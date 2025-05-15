<?php

namespace Modules\User\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository
{
    public function __construct(protected User $model)
    {
    }

    public function create(array $data): User
    {
        $user = $this->model->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        if (isset($data['roles'])) {
            $user->roles()->sync($data['roles']);
        }

        return $user->load('roles.permissions');
    }

    public function update(User $user, array $data): User
    {
        $user->update([
            'name' => $data['name'] ?? $user->name,
            'email' => $data['email'] ?? $user->email,
            'password' => isset($data['password']) ? bcrypt($data['password']) : $user->password,
        ]);

        if (isset($data['roles'])) {
            $user->roles()->sync($data['roles']);
        }

        return $user->load('roles.permissions');
    }

    public function find(int $id): ?User
    {
        return $this->model->with('roles.permissions')->find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function list(array $filters=[]): LengthAwarePaginator
    {
        $query = $this->model->with('roles.permissions');
        if (isset($filters['search_term'])) {
            $query->where(function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search_term'] . '%')
                    ->orWhere('email', 'like', '%' . $filters['search_term'] . '%');
            });
        }
        if (isset($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }
        if (isset($filters['email'])) {
            $query->where('email', 'like', '%' . $filters['email'] . '%');
        }
        if (isset($filters['role'])) {
            $query->whereHas('roles', function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['role'] . '%');
            });
        }

        $perPage = $filters['per_page'] ?? 15;
        $page = $filters['page'] ?? 1;
        $offset = ($page - 1) * $perPage;
        $query->offset($offset)->limit($perPage);
        $query->orderBy('created_at', 'desc');
        return $query->paginate($perPage,'*', 'page', $page);
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }
}
