<?php

namespace Modules\Issue\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attachment extends Model
{
    protected $fillable = [
        'issue_id',
        'file_path',
        'file_name',
        'file_type',
        'file_size'
    ];

    public function issue(): BelongsTo
    {
        return $this->belongsTo(Issue::class);
    }

}
