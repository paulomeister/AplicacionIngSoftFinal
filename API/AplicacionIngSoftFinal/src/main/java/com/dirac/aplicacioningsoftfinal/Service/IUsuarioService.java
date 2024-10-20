package com.dirac.aplicacioningsoftfinal.Service;

import java.util.Optional;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;

public interface IUsuarioService {

    Optional<UsuarioModel> getUserById(String id);

    Optional<UsuarioModel> getUserByUsername(String username);

    String insertUser(UsuarioModel usuario);

}
