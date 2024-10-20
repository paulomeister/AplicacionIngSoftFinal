package com.dirac.aplicacioningsoftfinal.Exception;

public class DownloadDocumentException extends RuntimeException{

    public DownloadDocumentException(String message){
        super("Error al intentar descargar un documento por: \n" + message );
    }

    public DownloadDocumentException(){
        super("Error al intentar descargar un documento" );
    }

}
