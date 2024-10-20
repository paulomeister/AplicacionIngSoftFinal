package com.dirac.aplicacioningsoftfinal.Exception;

public class PasswordAlreadyUsedException extends RuntimeException {

    public PasswordAlreadyUsedException(String message) {
        super(message);
    }

}
