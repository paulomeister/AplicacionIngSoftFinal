package com.dirac.aplicacioningsoftfinal.Exception;

public class DeleteException extends RuntimeException{
    
    public DeleteException(String collection){
        super("Error al intentar eliminar la colección: " + collection);
    }
    
}
