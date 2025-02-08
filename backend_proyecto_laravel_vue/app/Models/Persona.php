<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function documentos(){
        return $this->hasMany(Documento::class);
    }
}
