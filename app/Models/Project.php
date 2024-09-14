<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'user_id'];

    // A project belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A project has many tasks
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
