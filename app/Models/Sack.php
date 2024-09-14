<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sack extends Model
{
    use HasFactory;
    protected $fillable = ['sack_name', 'sack_number', 'price', 'weight', 'initial_weight', 'invoice_id'];

    public function invoice() {
        return $this->belongsTo(Invoice::class);
    }
    // public function powders() {
    //     return $this->hasMany(TeaLeafPowder::class);
    // }

    public function powders()
    {
        return $this->belongsToMany(TeaLeafPowder::class)->withPivot('weight_used')->withTimestamps();
    }
}
