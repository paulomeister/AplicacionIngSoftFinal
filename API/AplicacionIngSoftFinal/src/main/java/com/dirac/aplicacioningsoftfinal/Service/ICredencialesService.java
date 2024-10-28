package com.dirac.aplicacioningsoftfinal.Service;

import org.springframework.web.multipart.MultipartFile;

import com.dirac.aplicacioningsoftfinal.DTO.CambiarPasswordDTO;
import com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO;
import com.dirac.aplicacioningsoftfinal.Exception.UserAlreadyExistsException;
import com.dirac.aplicacioningsoftfinal.Security.UsuarioAplicacion;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface ICredencialesService {

    UsuarioAplicacion mapCredentialsFromDatabase(String username);
    void crearNuevasCredenciales(String usuarioEntranteString)  throws UserAlreadyExistsException, JsonProcessingException;
    NuevosCredencialesDTO crearNuevoUsuario(String usuarioEntranteString)  throws UserAlreadyExistsException, JsonProcessingException;
    NuevosCredencialesDTO crearNuevoUsuarioConImagen(String usuarioEntranteString, MultipartFile image) throws UserAlreadyExistsException, JsonProcessingException;
    String cambiarPassword(CambiarPasswordDTO cambiarPasswordDTO);

}
