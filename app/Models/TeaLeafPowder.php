<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeaLeafPowder extends Model
{
    use HasFactory;
    protected $fillable = ['powder_name', 'powder_number', 'total_weight', 'initial_weight'];

    public function invoice() {
        return $this->belongsTo(Invoice::class);
    }
    public function sack() {
        return $this->belongsTo(Sack::class);
    }
    // public function packets() {
    //     return $this->hasMany(Packet::class);
    // }
    public function packets()
    {
        return $this->hasMany(Packet::class, 'powder_id');
    }

    public function sacks()
    {
        return $this->belongsToMany(Sack::class)->withPivot('weight_used')->withTimestamps();
    }
    
}

