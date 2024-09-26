package com.dirac.aplicacioningsoftfinal.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Document(collection = "Documentos")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DocumentoModel {

    @Id
    private String _id;
    private String titulo;
    private String descripcion;
    private String visibilidad;
    private String urlArchivo;
    private List<String> keywords;
    private List<CategoriasEmbebidas> categoria;
    private List<Autores> autores;
    private List<Valoracion> valoraciones;
    private Date fechaSubida;
    private DatosComputados datosComputados;

    @Data
    public static class CategoriasEmbebidas {
        private String categoriaId;
        public String nombre;
    }

    @Data
    public static class Autores {
        private String usuarioId;
        private Boolean estaRegistrado;
        private String rol;
    }

    @Data
    public static class DatosComputados {
        private long descargasTotales;
        private double valoracionPromedio;
        private long comentariosTotales;
    }

    @Data
    public static class Valoracion {
        private String usuarioId;
        private Date fechaCreacion;
        private double puntuacion;
        private String comentario;
    }

}
