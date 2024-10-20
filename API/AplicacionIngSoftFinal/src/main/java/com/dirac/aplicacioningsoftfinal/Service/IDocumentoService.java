package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.DTO.BusquedaFiltroDTO;
import com.dirac.aplicacioningsoftfinal.DTO.BusquedaOrdenarFiltrarDTO;
import com.dirac.aplicacioningsoftfinal.DTO.ArchivoDTO;
import com.dirac.aplicacioningsoftfinal.DTO.Res;
import com.dirac.aplicacioningsoftfinal.DTO.UrlDTO;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import org.bson.types.ObjectId;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Date;
import java.util.List;

public interface IDocumentoService {

        DocumentoModel getDocumentById(ObjectId _id);    
        DocumentoModel getDocumentByTitle(String titulo);    
    List<DocumentoModel> getDocumentsByKeyword(List<String> keywords);    
    List<DocumentoModel> getDocumentsByFechaSubida(Date fechaSubida);    
    List<DocumentoModel> getDocumentsByCategoriaNombre(String nombreCategoria);    
    List<DocumentoModel> getDocumentsByAutorUsuarioname(String nombreAutor);    
    List<DocumentoModel> getDocumentsByLanguage(String idioma);
    List<DocumentoModel> getRecentDocuments();
    List<DocumentoModel> getTopRatedDocuments();
    List<DocumentoModel> getMostDownloadedDocuments();
    
    Res insertDocument(MultipartFile file, String jsonFile) throws IOException, GeneralSecurityException;
    String insertDocument(DocumentoModel document);
    
    String updateDocument(String documentoStringifeado);
    String updateDocumentFile(String documentoJson, MultipartFile newFile);
    Res deleteDocument(ObjectId _id);
    
    ArchivoDTO viewTheFile(String fileId, String userId, ObjectId documentId);
    ArchivoDTO downloadTheFile(String fileId, String userId, ObjectId documentId);
    byte[] downloadFile(String fileId) throws GeneralSecurityException, IOException;
    String deleteFileById(String fileId) throws GeneralSecurityException, IOException;
    String uploadToDrive(MultipartFile file) throws GeneralSecurityException, IOException;
    com.google.api.services.drive.model.File getFileById(String fileId) throws GeneralSecurityException, IOException;
    

    List<DocumentoModel> busquedaFiltroDocumentos(BusquedaFiltroDTO entrada);
    List<DocumentoModel> busquedaOrdenada(BusquedaOrdenarFiltrarDTO entrada);      
    UrlDTO recuperarUrlById(ObjectId id);

}
