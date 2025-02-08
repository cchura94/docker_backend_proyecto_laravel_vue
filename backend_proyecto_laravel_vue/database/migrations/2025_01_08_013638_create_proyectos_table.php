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
        Schema::create('proyectos', function (Blueprint $table) {
            $table->id();

            $table->string("nombre");
            $table->text("descripcion")->nullable();
            $table->date("fecha_inicio");
            $table->date("fecha_fin");
            $table->enum('estado', ["activo", "completado", "cancelado"]);
            $table->bigInteger("jefe_proyecto")->unsigned();
            $table->foreign("jefe_proyecto")->references("id")->on("users");
            $table->decimal("porcentaje_avance", 5, 2)->default(0);      
            
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proyectos');
    }
};
