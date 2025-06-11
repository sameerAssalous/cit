<?php

namespace Modules\Project\Models;

use App\Models\User;
use App\Modules\Project\Observers\ProjectObserver;
use Database\Factories\IssueFactory;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Issue\Models\Issue;

class Project extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = ['name', 'description', 'location','manager_id'];

    protected static function booted()
    {
        static::observe(ProjectObserver::class);
    }
    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public static function newFactory()
    {
        return ProjectFactory::new();
    }
}
