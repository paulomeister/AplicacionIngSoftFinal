package com.dirac.aplicacioningsoftfinal.Model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

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
    private List<Map<String, String>> credenciales;
    private Map<String, String> perfil;
    private Map<String, String> preguntaSeguridad;
    private boolean esAdmin;
    private LocalDate fechaRegistro;
    private List<Map<String, String>> docSubidos;
    private List<Map<String, String>> historialDocumentos;
    private List<Map<String, String>> docDescargados;
}
