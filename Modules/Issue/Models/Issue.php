<?php

namespace Modules\Issue\Models;

use App\Models\User;
use App\Modules\Issue\Observers\IssueObserver;
use Database\Factories\IssueFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\Project\Models\Project;

class Issue extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'project_id',
        'reported_by',
        'title',
        'description',
        'status',
        'due_date',
    ];

    protected static function booted()
    {
        static::observe(IssueObserver::class);
    }
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function attachment(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }

    public static function newFactory()
    {
        return IssueFactory::new();
    }
}
