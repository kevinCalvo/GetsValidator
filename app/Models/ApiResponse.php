<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiResponse extends Model
{
    use HasFactory;
    protected $table = 'api_responses';

    protected $fillable = [
        'documento',
        'json_response',
    ];

    protected $casts = [
        'json_response' => 'array',
    ];
}
