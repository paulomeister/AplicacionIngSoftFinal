package com.dirac.aplicacioningsoftfinal.Service;

import java.util.Optional;

import com.dirac.aplicacioningsoftfinal.DTO.UsuarioDTO;

public interface IUsuarioService {

    Optional<UsuarioDTO> getUserById(String id);

    Optional<UsuarioDTO> getUserByName(String name);
}

