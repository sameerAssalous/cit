<?php

namespace App\Modules\User;

use App\Modules\User\Models\User;
use App\Modules\User\Observers\UserObserver;
use Illuminate\Support\ServiceProvider;

class UserServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register any bindings
    }

    public function boot()
    {
        // Register the observer
        User::observe(UserObserver::class);
    }
} 