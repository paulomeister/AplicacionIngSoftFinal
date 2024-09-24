package com.dirac.aplicacioningsoftfinal.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CategoriaDTO {

    private String id;
    private String nombre;
    private int totalDocumentos;
    private List<DocumentoDTO> documentos;
    private String imagen;

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class DocumentoDTO {
        private String id;
        private String titulo;
        private String descripcion;
        private Double valoracionPromedio;
        private Date fechaSubida;
    }
}
