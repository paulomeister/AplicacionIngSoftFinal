package com.dirac.aplicacioningsoftfinal.Exception;

public class DownloadDocumentException extends RuntimeException{

    public DownloadDocumentException(){
        super("Error al intentar descargar un documento");
    }

}
