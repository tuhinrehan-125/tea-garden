<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tea_leaf_powders', function (Blueprint $table) {
            $table->id();
            $table->string('powder_number')->unique();
            $table->string('powder_name');
            $table->decimal('total_weight', 8, 2);
            $table->decimal('initial_weight', 8, 2); // Total weight of the powder

            $table->timestamps();
        });
    
        // Pivot table for tracking sacks used in each powder
        Schema::create('sack_tea_leaf_powder', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sack_id')->constrained()->onDelete('cascade');
            $table->foreignId('tea_leaf_powder_id')->constrained()->onDelete('cascade');
            $table->decimal('weight_used', 8, 2); // The weight taken from the sack for the powder
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tea_leaf_powders');
        Schema::dropIfExists('sack_tea_leaf_powder');
    }
};
