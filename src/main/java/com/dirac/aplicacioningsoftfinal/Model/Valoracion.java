package com.dirac.aplicacioningsoftfinal.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Valoracion {
    private String usuarioId;
    private Date fechaCreacion;
    private double puntuacion;
    private String comentario;
}