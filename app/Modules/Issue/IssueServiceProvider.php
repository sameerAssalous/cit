<?php

namespace App\Modules\Issue;

use App\Modules\Issue\Models\Issue;
use App\Modules\Issue\Observers\IssueObserver;
use Illuminate\Support\ServiceProvider;

class IssueServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register any bindings
    }

    public function boot()
    {
        // Register the observer
        Issue::observe(IssueObserver::class);
    }
} 