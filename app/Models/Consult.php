<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consult extends Model
{
    use HasFactory;
    protected $fillable =[
        'name',
        'user_id',
        'fechaR',
        'doc',
        'typedoc',
        'typeofentry',
        'fechaE',
    ];
}
