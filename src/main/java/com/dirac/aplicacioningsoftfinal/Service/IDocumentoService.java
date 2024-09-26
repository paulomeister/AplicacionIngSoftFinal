package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;

public interface IDocumentoService {

    DocumentoModel getDocument(ObjectId _id);
    DocumentoModel getDocumentByTitle(String titulo);
    List<DocumentoModel> getDocumentsByKeyword(List<String> keywords);
    List<DocumentoModel> getDocumentsByFechaSubida (Date fechaSubida);
    List <DocumentoModel> getDocumentsByCategoriaNombre(String nombreCategoria);
    List <DocumentoModel> getDocumentsByAutorUsuarioname(String nombreAutor);
    List <DocumentoModel> getDocumentsByLenguage(String idioma);



}
