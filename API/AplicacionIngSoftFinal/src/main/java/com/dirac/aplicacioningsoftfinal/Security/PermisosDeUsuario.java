package com.dirac.aplicacioningsoftfinal.Security;

public enum PermisosDeUsuario {


    USUARIO_CREA("usuario:crea"),
    USUARIO_ELIMINA("usuario:elimina"),
    USUARIO_ACTUALIZA("usuario:actualiza"),
    USUARIO_BORRA("usuario:borra"),
    ADMIN_GESTIONA("admin:gestiona");


    private final String permiso;

    PermisosDeUsuario(String permiso) {
        this.permiso = permiso;
    }

}
