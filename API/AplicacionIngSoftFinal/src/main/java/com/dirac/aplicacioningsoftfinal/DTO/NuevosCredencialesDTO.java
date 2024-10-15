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
    private String password;
    private PreguntaSeguridad preguntaSeguridad;

}
