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
        Schema::create('packets', function (Blueprint $table) {
            $table->id();
            $table->string('packet_name');
            $table->string('packet_number')->unique();
            $table->decimal('weight', 8, 2);
            $table->decimal('price', 8, 2);
            $table->foreignId('powder_id')->constrained('tea_leaf_powders')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packets');
    }
};
