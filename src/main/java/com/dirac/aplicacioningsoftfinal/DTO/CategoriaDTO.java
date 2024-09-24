package com.dirac.aplicacioningsoftfinal.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class CategoriaDTO {

    private String id;
    private String nombre;
    private String descripcion;
    private int totalDocumentos;
    private List<DocumentoDTO> documentos;


    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class DocumentoDTO {
        private String id;
        private String titulo;
        private String descripcion;
   }
}
