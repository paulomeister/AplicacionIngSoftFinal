package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.DTO.CambiarPasswordDTO;
import com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO;
import com.dirac.aplicacioningsoftfinal.DTO.OlvidoPasswordDTO;
import com.dirac.aplicacioningsoftfinal.Security.UsuarioAplicacion;

public interface ICredencialesService {

    UsuarioAplicacion mapCredentialsFromDatabase(String username);
    void crearNuevasCredenciales(NuevosCredencialesDTO usuarioEntrante);
    void crearNuevoUsuario(NuevosCredencialesDTO usuarioEntrante);
    String cambiarPassword(CambiarPasswordDTO cambiarPasswordDTO);
    String obtenerPreguntaSeguridad(String username);
    String olvidoPasswordRecuperar(OlvidoPasswordDTO olvidoPasswordDTO);

}
