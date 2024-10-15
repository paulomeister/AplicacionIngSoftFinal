package com.dirac.aplicacioningsoftfinal.Security.DAO;

import com.dirac.aplicacioningsoftfinal.Security.UsuarioAplicacion;

import java.util.Optional;

public interface IUsuarioDao {

    Optional<UsuarioAplicacion> selectUserByUsername(String username);

}
