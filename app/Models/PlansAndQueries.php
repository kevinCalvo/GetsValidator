<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlansAndQueries extends Model
{
    use HasFactory;

    protected $fillable = ['plans', 'queries', 'users', 'fetched_at'];
    protected $casts = [
        'plans' => 'array',
        'queries' => 'array',
        'fetched_at' => 'datetime',
    ];
}
