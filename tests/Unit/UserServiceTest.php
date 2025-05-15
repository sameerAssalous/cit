<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\User\Repositories\UserRepository;
use Modules\User\Services\UserService;
use Tests\TestCase;

class UserServiceTest extends TestCase
{
    use RefreshDatabase;

    protected UserService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $repository = new UserRepository(new User());
        $this->service = new UserService($repository);
    }

    public function test_creates_user()
    {
        $user = $this->service->createUser([
            'name' => 'Unit Test',
            'email' => 'unit@example.com',
            'password' => 'password',
            'role' => 1,
        ]);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('Unit Test', $user->name);
    }

    public function test_finds_user()
    {
        $created = User::factory()->create();

        $user = $this->service->findUser($created->id);

        $this->assertEquals($created->id, $user->id);
    }

    public function test_throws_when_user_not_found()
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('User not found');

        $this->service->findUser(9999);
    }

    public function test_updates_user()
    {
        $user = User::factory()->create(['name' => 'Old Name']);

        $updated = $this->service->updateUser($user->id, [
            'name' => 'New Name',
            'role' => 1,
        ]);

        $this->assertEquals('New Name', $updated->name);
    }

    public function test_deletes_user()
    {
        $user = User::factory()->create();

        $this->service->deleteUser($user->id);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
