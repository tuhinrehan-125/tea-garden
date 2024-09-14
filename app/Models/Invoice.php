<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = ['place_name', 'invoice_number', 'price', 'weight', 'initial_weight'];

    public function sacks() {
        return $this->hasMany(Sack::class);
    }
    public function powders() {
        return $this->hasMany(TeaLeafPowder::class);
    }
}
