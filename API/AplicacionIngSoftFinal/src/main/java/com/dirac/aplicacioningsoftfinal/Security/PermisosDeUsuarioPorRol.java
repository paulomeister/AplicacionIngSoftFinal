package com.dirac.aplicacioningsoftfinal.Security;

import com.google.common.collect.Sets;
import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Set;
import java.util.stream.Collectors;

import static com.dirac.aplicacioningsoftfinal.Security.PermisosDeUsuario.*;

@Getter
public enum PermisosDeUsuarioPorRol {

    USUARIO(Sets.newHashSet(USUARIO_GENERAL)),
    ADMIN(Sets.newHashSet(ADMIN_GESTIONA));


    private final Set<PermisosDeUsuario> permisosDeUsuarios;

    PermisosDeUsuarioPorRol(Set<PermisosDeUsuario> permisosDeUsuarios) {
        this.permisosDeUsuarios = permisosDeUsuarios;
    }

    public Set<SimpleGrantedAuthority> getGrantedAuthorities() {

        Set<SimpleGrantedAuthority> simpleGrantedAuthorities = getPermisosDeUsuarios()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermiso()))
                .collect(Collectors.toSet());

        simpleGrantedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));

        return simpleGrantedAuthorities;

    }

}
