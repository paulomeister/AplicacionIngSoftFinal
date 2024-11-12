package com.dirac.aplicacioningsoftfinal.DTO;

import org.bson.types.ObjectId;

public class ValoracionDTO {

    private ObjectId usuarioId;
    private Double puntuacion;
    private String comentario;

    // Getters y Setters

    public ObjectId getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(ObjectId usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Double getPuntuacion() {
        return puntuacion;
    }

    public void setPuntuacion(Double puntuacion) {
        this.puntuacion = puntuacion;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
