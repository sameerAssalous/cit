<?php

namespace Modules\User\Controllers;

use App\Http\Controllers\Controller;
use Modules\User\Requests\CreateUserRequest;
use Modules\User\Requests\ListUsersRequest;
use Modules\User\Requests\UpdateUserRequest;
use Modules\User\Resources\UserResource;
use Modules\User\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    public function index(ListUsersRequest $request): AnonymousResourceCollection
    {
        $users = $this->userService->listUsers($request->all());
        return UserResource::collection($users);
    }

    public function store(CreateUserRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->createUser($request->validated());
            return response()->json(new UserResource($user), 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $user = $this->userService->findUser($id);
            return response()->json(new UserResource($user));
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        try {
            $user = $this->userService->updateUser($id, $request->validated());
            return response()->json(new UserResource($user));
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500 ?: 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->userService->deleteUser($id);
            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }
}
