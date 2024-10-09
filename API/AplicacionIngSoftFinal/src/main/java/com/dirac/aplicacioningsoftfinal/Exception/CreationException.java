package com.dirac.aplicacioningsoftfinal.Exception;

public class CreationException extends RuntimeException{

    public CreationException(String collection){
        super("Error al intentar crear un objeto de la colección " +  collection);
    }

}
