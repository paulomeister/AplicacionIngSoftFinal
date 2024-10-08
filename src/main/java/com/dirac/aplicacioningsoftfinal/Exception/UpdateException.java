package com.dirac.aplicacioningsoftfinal.Exception;

public class UpdateException extends RuntimeException{
    
    public UpdateException(String collection){
        super("Error al intentar actualizar la colección: " + collection);
    }

}
