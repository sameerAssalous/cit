<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Issue\Enums\IssueStatus;
use Modules\Issue\Models\Issue;
use Modules\Project\Models\Project;
use Tests\TestCase;

class IssueControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $authUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
        $this->withoutExceptionHandling();
        $this->authUser = User::factory()->create();
        $this->authUser->roles()->attach(1); // Assume role 1 has all permissions
    }

    public function test_lists_issues()
    {
        Issue::factory()->count(3)->create();
        $response = $this->actingAs($this->authUser)->getJson('/api/issues');

        $response->assertOk()->assertJsonStructure(['data']);
    }

    public function test_creates_issue()
    {
        $project = Project::factory()->create();

        $payload = [
            'project_id' => $project->id,
            'title' => 'Test Issue',
            'description' => 'Issue description',
            'due_date' => now()->addWeek()->toDateString(),
        ];

        $response = $this->actingAs($this->authUser)->postJson('/api/issues', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'title', 'description']);
    }

    public function test_shows_issue()
    {
        $issue = Issue::factory()->create();

        $response = $this->actingAs($this->authUser)->getJson("/api/issues/{$issue->id}");

        $response->assertOk()
            ->assertJsonStructure(['id', 'title', 'description']);
    }

    public function test_updates_issue()
    {
        $issue = Issue::factory()->create();

        $payload = [
            'title' => 'Updated Title',
            'description' => $issue->description,
            'project_id' => $issue->project_id,
            'due_date' => $issue->due_date,
        ];

        $response = $this->actingAs($this->authUser)->putJson("/api/issues/{$issue->id}", $payload);

        $response->assertOk()->assertJsonPath('title', 'Updated Title');
    }

    public function test_deletes_issue()
    {
        $issue = Issue::factory()->create();

        $response = $this->actingAs($this->authUser)->deleteJson("/api/issues/{$issue->id}");

        $response->assertOk()->assertJson(['message' => 'Issue deleted successfully']);
    }

    public function test_updates_issue_status()
    {
        $issue = Issue::factory()->create();

        $payload = ['status' => IssueStatus::CLOSED->value];

        $response = $this->actingAs($this->authUser)->postJson("/api/issues/{$issue->id}/status", $payload);

        $response->assertOk()
            ->assertJsonPath('status', 4);
    }

    public function test_exports_issue_pdf()
    {
        $issue = Issue::factory()->create(['status'=> 2]);

        $response = $this->actingAs($this->authUser)->post("/api/issues/{$issue->id}/export");

        $response->assertOk();
        $this->assertTrue(str_contains($response->headers->get('content-type'), 'application/pdf'));
    }
}
