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
        Schema::create('sacks', function (Blueprint $table) {
            $table->id();
            $table->string('sack_name');
            $table->string('sack_number')->unique();
            $table->decimal('weight', 8, 2);
            $table->decimal('initial_weight', 8, 2);
            $table->foreignId('invoice_id')->constrained('invoices')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sacks');
    }
};
