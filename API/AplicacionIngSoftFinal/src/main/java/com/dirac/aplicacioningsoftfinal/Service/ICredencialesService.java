package com.dirac.aplicacioningsoftfinal.Service;

import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.dirac.aplicacioningsoftfinal.DTO.CambiarPasswordDTO;
import com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO;
import com.dirac.aplicacioningsoftfinal.DTO.OlvidoPasswordDTO;
import com.dirac.aplicacioningsoftfinal.Exception.UserAlreadyExistsException;
import com.dirac.aplicacioningsoftfinal.Model.CredencialesModel;
import com.dirac.aplicacioningsoftfinal.Model.CredencialesModel.PreguntaSeguridad;
import com.dirac.aplicacioningsoftfinal.Security.UsuarioAplicacion;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface ICredencialesService {

    UsuarioAplicacion mapCredentialsFromDatabase(String username);
    Optional<CredencialesModel> getByUsername(String username);
    void crearNuevasCredenciales(String usuarioEntranteString)  throws UserAlreadyExistsException, JsonProcessingException;
    NuevosCredencialesDTO crearNuevoUsuario(String usuarioEntranteString)  throws UserAlreadyExistsException, JsonProcessingException;
    NuevosCredencialesDTO crearNuevoUsuarioConImagen(String usuarioEntranteString, MultipartFile image) throws UserAlreadyExistsException, JsonProcessingException;
    String cambiarPassword(CambiarPasswordDTO cambiarPasswordDTO);
    String obtenerPreguntaSeguridad(String username);
    String olvidoPasswordRecuperar(OlvidoPasswordDTO olvidoPasswordDTO);
    String cambiarPreguntaDeSeguridad(String username, PreguntaSeguridad nuevaPreguntaSeguridad);
    String eliminarCredenciales(String credencialId);
    String saveCredenciales(CredencialesModel credencial);

}
