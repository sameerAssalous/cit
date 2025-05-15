<?php

namespace Modules\Project\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Issue\Models\Issue;

class Project extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'description', 'location','manager_id'];

    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }
}
