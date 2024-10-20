package com.dirac.aplicacioningsoftfinal.Security;

import com.google.common.collect.Sets;
import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Set;

@Getter
public enum PermisosDeUsuarioPorRol {

    USUARIO,
    ADMIN;

    public Set<SimpleGrantedAuthority> getGrantedAuthorities() {

        Set<SimpleGrantedAuthority> simpleGrantedAuthorities = Sets.newHashSet();

        simpleGrantedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));

        return simpleGrantedAuthorities;

    }

}
