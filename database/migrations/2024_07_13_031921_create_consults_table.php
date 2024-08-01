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
        Schema::create('consults', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('fechaR')->nullable();
            $table->string('doc');
            $table->string('typedoc');
            $table->string('fechaE')->nullable();
            $table->string('typeofentry');
            $table->json('report')->nullable();


            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consults');
    }
};
