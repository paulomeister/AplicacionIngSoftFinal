package com.dirac.aplicacioningsoftfinal.Security;

import lombok.Getter;

@Getter
public enum PermisosDeUsuario {

    USUARIO_GENERAL("usuario:general"),
    ADMIN_GESTIONA("admin:gestiona");


    private final String permiso;

    PermisosDeUsuario(String permiso) {
        this.permiso = permiso;
    }

}
