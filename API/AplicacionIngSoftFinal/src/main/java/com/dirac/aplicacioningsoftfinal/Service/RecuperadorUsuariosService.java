package com.dirac.aplicacioningsoftfinal.Service;


import com.dirac.aplicacioningsoftfinal.Security.DAO.IUsuarioDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import static java.lang.String.format;

@Service
public class RecuperadorUsuariosService implements UserDetailsService {

    private final IUsuarioDao usuarioDao;

    @Autowired
    public RecuperadorUsuariosService(IUsuarioDao usuarioDao) {
        this.usuarioDao = usuarioDao;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioDao.selectUserByUsername(username).
                orElseThrow(() -> new UsernameNotFoundException(format("El usuario \"%s\" no se encontró", username)));
    }

}
