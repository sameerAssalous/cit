<?php

namespace Modules\User\Services;

use App\Models\User;
use Modules\User\Repositories\UserRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    public function __construct(
        protected UserRepository $userRepository
    ) {}

    public function listUsers(array $filters): LengthAwarePaginator
    {
        return $this->userRepository->list($filters);
    }

    public function createUser(array $data): User
    {
        $user = $this->userRepository->create($data);
        $user->roles()->attach($data['role']);
        $user->refresh();
        return $user;
    }

    public function findUser(int $id): ?User
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            throw new \Exception('User not found', 404);
        }

        return $user;
    }

    public function updateUser(int $id, array $data): ?User
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            throw new \Exception('User not found', 404);
        }

        $user = $this->userRepository->update($user, $data);
        if(isset($data['role'])) {
            $user->roles()->attach($data['role']);
        }
        $user->refresh();
        return $user;
    }

    public function deleteUser(int $id): void
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            throw new \Exception('User not found', 404);
        }

        $this->userRepository->delete($user);
    }
}
