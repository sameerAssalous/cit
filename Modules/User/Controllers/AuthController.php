<?php

namespace Modules\User\Controllers;

use App\Http\Controllers\Controller;
use Modules\User\Requests\CreateCommentRequest;
use Illuminate\Http\JsonResponse;
use Modules\User\Requests\LoginRequest;
use Modules\User\Resources\UserResource;
use Modules\User\Services\AuthService;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                $request->email,
                $request->password
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'data' => [
                    'user' => new UserResource($result['user']),
                    'token' => $result['token'],
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function logout(): JsonResponse
    {
        try {
            $this->authService->logout();

            return response()->json([
                'status' => 'success',
                'message' => 'Logged out successfully',
                'data' => null
            ], 200);
        } catch (\Exception $e) {
            $statusCode = (int) ($e->getCode() ?: 500);
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }
}
