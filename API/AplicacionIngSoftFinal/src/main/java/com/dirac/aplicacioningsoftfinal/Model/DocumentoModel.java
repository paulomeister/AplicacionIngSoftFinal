package com.dirac.aplicacioningsoftfinal.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;
import java.util.List;

@Document(collection = "Documentos")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DocumentoModel {

    @Id
    private ObjectId _id;

    @JsonProperty("_id")
    public String getIdAsString(){
        return _id != null ? _id.toHexString() : null;
    }

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
    private String idioma;

    @AllArgsConstructor
    @Data
    public static class CategoriasEmbebidas {
        private ObjectId categoriaId;

        @JsonProperty("categoriaId")
        public String getCategoriaIdAsString() {
            return categoriaId != null ? categoriaId.toHexString() : null;
        }
    
        public String nombre;
    }

    @AllArgsConstructor
    @Data
    public static class Autores {
        private ObjectId usuarioId; 
        private Boolean estaRegistrado;

        @JsonProperty("usuarioId")
        public String getUsuarioIdAsString() {
            return usuarioId != null ? usuarioId.toHexString() : null;
        }
    
        private String rol;
        private String username;
        private String nombre;
    }

    @AllArgsConstructor
    @Data
    public static class DatosComputados {
        private long descargasTotales;
        private double valoracionPromedio;
        private long comentariosTotales;
    }

    @AllArgsConstructor
    @Data
    public static class Valoracion {
        private ObjectId usuarioId; 

        @JsonProperty("usuarioId")
        public String getUsuarioIdAsString() {
            return usuarioId != null ? usuarioId.toHexString() : null;
        }
    
        private Date fechaCreacion;
        private double puntuacion;
        private String comentario;
    }

}
