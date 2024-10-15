package com.dirac.aplicacioningsoftfinal.Security.DAO;

import com.dirac.aplicacioningsoftfinal.Security.UsuarioAplicacion;
import com.dirac.aplicacioningsoftfinal.Service.ICredencialesService;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UsuarioDaoImpl implements IUsuarioDao {

    private final ICredencialesService credencialesService;

    public UsuarioDaoImpl(ICredencialesService credencialesService) {
        this.credencialesService = credencialesService;
    }

    @Override
    public Optional<UsuarioAplicacion> selectUserByUsername(String username) {

        return Optional.ofNullable(credencialesService.mapCredentialsFromDatabase(username));

    }
}
