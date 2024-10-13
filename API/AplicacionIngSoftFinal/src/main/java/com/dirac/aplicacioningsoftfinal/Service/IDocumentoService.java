package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.DTO.BusquedaFiltroDTO;
import com.dirac.aplicacioningsoftfinal.DTO.BusquedaOrdenarFiltrarDTO;
import com.dirac.aplicacioningsoftfinal.DTO.UrlDTO;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Date;
import java.util.List;

public interface IDocumentoService {

    DocumentoModel getDocument(ObjectId _id);

    DocumentoModel getDocumentByTitle(String titulo);

    List<DocumentoModel> getDocumentsByKeyword(List<String> keywords);

    List<DocumentoModel> getDocumentsByFechaSubida(Date fechaSubida);

    List<DocumentoModel> getDocumentsByCategoriaNombre(String nombreCategoria);

    List<DocumentoModel> getDocumentsByAutorUsuarioname(String nombreAutor);

    List<DocumentoModel> getDocumentsByLanguage(String idioma);

    String createDocument(DocumentoModel documento);

    String updateDocument(ObjectId idDocumentoAntiguo, DocumentoModel documentoNuevo);

    String deleteDocument(ObjectId _id);

    List<DocumentoModel> busquedaFiltroDocumentos(BusquedaFiltroDTO entrada);

    List<DocumentoModel> busquedaOrdenada(BusquedaOrdenarFiltrarDTO entrada);

    UrlDTO recuperarUrlById(ObjectId id);

    RedirectView downloadDocumentByTitle(String titulo) throws Exception;

    ResponseEntity<?> downloadDocumentById(ObjectId id) throws Exception;

    void updateDownloadStats(DocumentoModel document);

}
