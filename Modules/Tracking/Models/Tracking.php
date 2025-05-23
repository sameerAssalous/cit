<?php

namespace Modules\Tracking\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Tracking extends Model
{
    protected $fillable = ['user_id', 'action_type', 'trackable_type', 'trackable_id', 'info', 'performed_at'];

    protected $casts = [
        'info' => 'array',
        'performed_at' => 'datetime',
    ];

    public function trackable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
