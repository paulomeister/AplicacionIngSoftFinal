package com.dirac.aplicacioningsoftfinal.Model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.dirac.aplicacioningsoftfinal.DTO.DocDescargadosDTO;
import com.dirac.aplicacioningsoftfinal.DTO.DocSubidosDTO;
import com.dirac.aplicacioningsoftfinal.DTO.HistorialDocumentosDTO;
import com.dirac.aplicacioningsoftfinal.DTO.PerfilDTO;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

import static com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO.*;

@Document(collection = "Usuarios")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UsuarioModel {
    @Id
    private ObjectId _id;

    @JsonProperty("_id")
    public String get_idAString() {
        return _id != null ? _id.toHexString() : null;
    }

    private String username;
    private String email;
    private Perfil perfil;
    private boolean esAdmin;
    private LocalDate fechaRegistro;
    private List<DocsSubidos> docSubidos;
    private List<Historial> historialDocumentos;
    private List<Descargados> docDescargados;

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class Historial {

        @Id
        private ObjectId documentoId;
        private LocalDate fechaHora;

        @JsonProperty("documentoId")
        public String returnIdAsString() {
            return documentoId != null ? documentoId.toHexString() : null;
        }

    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class Descargados {

        @Id
        private ObjectId documentoId;
        private LocalDate fechaHora;

        @JsonProperty("documentoId")
        public String returnIdAsString() {
            return documentoId != null ? documentoId.toHexString() : null;
        }

    }

    
    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class DocsSubidos {

        private ObjectId documentoId;
        private String titulo;

        @JsonProperty("documentoId")
        public String returnDocIdIdAsString() {
            return documentoId != null ? documentoId.toHexString() : null;
        }

    }



}
