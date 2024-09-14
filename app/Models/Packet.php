<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Packet extends Model
{
    use HasFactory;

    
    protected $fillable = ['packet_number', 'packet_name', 'weight', 'price', 'powder_id'];
    
    // public function powder() {
    //     return $this->belongsTo(TeaLeafPowder::class);
    // }
    
    public function teaLeafPowder()
    {
        return $this->belongsTo(TeaLeafPowder::class, 'powder_id');
    }
}
