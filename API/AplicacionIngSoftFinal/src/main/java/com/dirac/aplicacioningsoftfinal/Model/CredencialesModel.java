package com.dirac.aplicacioningsoftfinal.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "Credenciales")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CredencialesModel {

    @Id
    private ObjectId _id;
    private String username;
    private String password;
    private String rol;
    private boolean isAccountNonExpired;
    private boolean isAccountNonLocked;
    private boolean isCredentialsNonExpired;
    private boolean isEnabled;
    private PreguntaSeguridad preguntaSeguridad;
    private List<Credenciales> credenciales;


    @JsonProperty("_id")
    public String returnIdAsString() { return _id != null ? _id.toHexString() : null; }

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class PreguntaSeguridad {

        private String pregunta;
        private String respuesta;

    }


    @AllArgsConstructor
    @Data
    public static class Credenciales {

        private String password;
        private boolean estado;

    }

}
