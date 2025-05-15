<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $permissions = [
            // User management permissions
            ['name' => 'view-users', 'description' => 'Can view users'],
            ['name' => 'create-users', 'description' => 'Can create users'],
            ['name' => 'edit-users', 'description' => 'Can edit users'],
            ['name' => 'delete-users', 'description' => 'Can delete users'],

            // Project management permissions
            ['name' => 'view-projects', 'description' => 'Can view projects'],
            ['name' => 'create-projects', 'description' => 'Can create projects'],
            ['name' => 'edit-projects', 'description' => 'Can edit projects'],
            ['name' => 'delete-projects', 'description' => 'Can delete projects'],

            // Issue management permissions
            ['name' => 'view-issues', 'description' => 'Can view issues'],
            ['name' => 'create-issues', 'description' => 'Can create issues'],
            ['name' => 'edit-issues', 'description' => 'Can edit issues'],
            ['name' => 'delete-issues', 'description' => 'Can delete issues'],
            ['name' => 'assign-issues', 'description' => 'Can assign issues to others'],
            ['name' => 'resolve-issues', 'description' => 'Can resolve issues'],

            // Comment permissions
            ['name' => 'view-comments', 'description' => 'Can view comments'],
            ['name' => 'create-comments', 'description' => 'Can create comments'],
            ['name' => 'edit-comments', 'description' => 'Can edit comments'],
            ['name' => 'delete-comments', 'description' => 'Can delete comments'],

            // Attachment permissions
            ['name' => 'view-attachments', 'description' => 'Can view attachments'],
            ['name' => 'upload-attachments', 'description' => 'Can upload attachments'],
            ['name' => 'delete-attachments', 'description' => 'Can delete attachments'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }

        // Create roles and assign permissions
        $roles = [
            'admin' => [
                'description' => 'System Administrator',
                'permissions' => Permission::all()->pluck('name')->toArray(),
            ],
            'project_manager' => [
                'description' => 'Project Manager',
                'permissions' => [
                    'view-users',
                    'view-projects',
                    'create-projects',
                    'edit-projects',
                    'view-issues',
                    'create-issues',
                    'edit-issues',
                    'assign-issues',
                    'resolve-issues',
                    'view-comments',
                    'create-comments',
                    'edit-comments',
                    'view-attachments',
                    'upload-attachments',
                ],
            ],
            'employee' => [
                'description' => 'Regular Employee',
                'permissions' => [
                    'view-projects',
                    'view-issues',
                    'create-issues',
                    'view-comments',
                    'create-comments',
                    'view-attachments',
                    'upload-attachments',
                ],
            ],
        ];

        foreach ($roles as $roleName => $roleData) {
            $role = Role::create([
                'name' => $roleName,
                'description' => $roleData['description'],
            ]);

            $permissions = Permission::whereIn('name', $roleData['permissions'])->get();
            $role->permissions()->attach($permissions);
        }
    }
}
