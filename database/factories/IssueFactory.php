<?php

namespace Database\Factories;

use App\Models\User;
use Modules\Issue\Models\Issue;
use Illuminate\Database\Eloquent\Factories\Factory;

class IssueFactory extends Factory
{
    protected $model = Issue::class;

    public function definition()
    {
        return [
            'project_id' => \Modules\Project\Models\Project::factory(), // أو قيمة ثابتة لو مفيش Project factory
            'reported_by' =>User::factory(),
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'status' => 0,
            'due_date' => now()->addDays(7),
        ];
    }
}
