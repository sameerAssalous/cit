<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;
    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
        $this->withoutExceptionHandling();
    }

    public function test_lists_users()
    {
        User::factory()->count(3)->create();
        $user = User::factory()->create();
        $user->roles()->attach(1);
        $response = $this->actingAs($user)
            ->getJson('/api/users');

        $response->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_creates_user()
    {
        $payload = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 1, // Assume role with id 1 exists
        ];

        $user = User::factory()->create();
        $user->roles()->attach(1);
        $response = $this->actingAs($user)->postJson('/api/users', $payload);

        $response->assertStatus(201)->assertJsonStructure(['id', 'name', 'email']);
    }

    public function test_shows_user()
    {
        $user = User::factory()->create();
        $adminUser = User::factory()->create();
        $adminUser->roles()->attach(1);
        $this->actingAs($adminUser);

        $response = $this->getJson("/api/users/{$user->id}");

        $response->assertOk()
            ->assertJsonStructure(['id', 'name', 'email']);
    }

    public function test_updates_user()
    {
        $user = User::factory()->create();
        $adminUser = User::factory()->create();
        $adminUser->roles()->attach(1);
        $this->actingAs($adminUser);

        $response = $this->putJson("/api/users/{$user->id}", [
            'name' => 'Updated Name',
            'email' => $user->email,
            'role' => 1,
        ]);

        $response->assertOk()
            ->assertJsonPath('name', 'Updated Name');
    }

    public function test_deletes_user()
    {
        $user = User::factory()->create();

        $adminUser = User::factory()->create();
        $adminUser->roles()->attach(1);
        $this->actingAs($adminUser);

        $response = $this->deleteJson("/api/users/{$user->id}");

        $response->assertOk()
            ->assertJson(['message' => 'User deleted successfully']);
    }
}
