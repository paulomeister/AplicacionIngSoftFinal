package com.dirac.aplicacioningsoftfinal.Exception;

public class InvalidVisibilityException extends RuntimeException{
    public InvalidVisibilityException(String message ){
        super(message);
    }

    public InvalidVisibilityException(){
        super("La visibilidad está privada así que no se puede acceder a ella");
    }

}
