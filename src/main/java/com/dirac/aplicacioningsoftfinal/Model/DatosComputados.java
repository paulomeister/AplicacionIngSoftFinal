package com.dirac.aplicacioningsoftfinal.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DatosComputados {
    private long descargasTotales;
    private double valoracionPromedio;
    private long comentariosTotales;
}
