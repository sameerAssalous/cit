<?php

namespace App\Modules\Project;

use App\Modules\Project\Models\Project;
use App\Modules\Project\Observers\ProjectObserver;
use Illuminate\Support\ServiceProvider;

class ProjectServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register any bindings
    }

    public function boot()
    {
        // Register the observer
        Project::observe(ProjectObserver::class);
    }
} 