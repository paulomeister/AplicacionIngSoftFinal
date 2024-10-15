package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.Security.DAO.IUsuarioDao;
import com.dirac.aplicacioningsoftfinal.Security.UsuarioAplicacion;
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
