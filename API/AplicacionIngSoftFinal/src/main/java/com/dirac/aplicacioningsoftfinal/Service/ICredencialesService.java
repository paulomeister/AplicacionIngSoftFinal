package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.Security.UsuarioAplicacion;

public interface ICredencialesService {

    UsuarioAplicacion mapCredentialsFromDatabase(String username);

}
