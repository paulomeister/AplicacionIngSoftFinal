package com.dirac.aplicacioningsoftfinal.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class OlvidoPasswordDTO {

    private String username;
    private String respuesta;
    private String nuevoPassword;


}
