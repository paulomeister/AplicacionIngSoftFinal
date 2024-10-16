package com.dirac.aplicacioningsoftfinal.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.dirac.aplicacioningsoftfinal.Model.CredencialesModel.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NuevosCredencialesDTO {

    private String username;
    private String email;
    private Perfil perfil;
    private String password;
    private PreguntaSeguridad preguntaSeguridad;

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class Perfil {

        private String nombre;
        private String apellido;
        private String fotoPerfil;


    }

}
