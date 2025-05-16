<?php

use Illuminate\Support\Facades\Route;
use Modules\Project\Controllers\ProjectController;
use Modules\User\Controllers\AuthController;
use Modules\User\Controllers\UserController;
use Modules\Issue\Controllers\IssueController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
});


Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('users', UserController::class)->middleware([
        'index' => 'permission:view-users',
        'store' => 'permission:create-users',
        'update' => 'permission:edit-users',
        'destroy' => 'permission:delete-users',
    ]);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('issues', IssueController::class)->middleware([
        'index' => 'permission:view-issues',
        'store' => 'permission:create-issues',
        'update' => 'permission:edit-issues',
        'destroy' => 'permission:delete-issues',
    ]);

    Route::post('issues/{id}/status', [IssueController::class, 'updateStatus'])
        ->middleware('permission:resolve-issues');

    Route::post('issues/{id}/export', [IssueController::class, 'exportPdf'])
        ->middleware('permission:view-issues');
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('projects', ProjectController::class)->middleware([
        'index' => 'permission:view-projects',
        'store' => 'permission:create-projects',
        'update' => 'permission:edit-projects',
        'destroy' => 'permission:delete-projects',
    ]);

    Route::post('projects/{id}/export', [ProjectController::class, 'exportIssues'])
        ->middleware('permission:view-issues');
});
