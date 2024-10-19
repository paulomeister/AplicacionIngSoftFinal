package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.DTO.BusquedaFiltroDTO;
import com.dirac.aplicacioningsoftfinal.DTO.BusquedaOrdenarFiltrarDTO;
import com.dirac.aplicacioningsoftfinal.DTO.ArchivoDTO;
import com.dirac.aplicacioningsoftfinal.DTO.Res;
import com.dirac.aplicacioningsoftfinal.Exception.CreationException;
import com.dirac.aplicacioningsoftfinal.Exception.DeleteException;
import com.dirac.aplicacioningsoftfinal.Exception.NoSuchDocumentFoundException;
import com.dirac.aplicacioningsoftfinal.Exception.UpdateException;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import com.dirac.aplicacioningsoftfinal.Repository.IDocumentoRepository;
import com.dirac.aplicacioningsoftfinal.Service.IDocumentoService;
import com.dirac.aplicacioningsoftfinal.Service.IUsuarioService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.google.api.services.drive.model.File;
import com.google.common.base.Optional;
import com.google.common.net.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/Documentos")
@CrossOrigin("*")
public class DocumentoController {

    private final IDocumentoService documentoService;

    @Autowired
    public DocumentoController(IDocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    @Autowired
    IDocumentoRepository documentoRepository;

    @Autowired
    IUsuarioService usuarioService;

    //                                                              DRIVE                                                              

    @GetMapping("/getFileById")
    public ResponseEntity<Object> getFileById(@RequestParam("fileId") String fileId) {
        try {

            com.google.api.services.drive.model.File file = documentoService.getFileById(fileId);

            // Construye la URL para la visualización
            String previewUrl = "https://drive.google.com/file/d/" + file.getId() + "/preview";

            // Devuelve la URL en la respuesta
            return ResponseEntity.ok(previewUrl);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching file: " + e.getMessage());
        }
    }
  

    // VIEW
    // !el fileId debe de ser el que se guarda en la BD, no el que está en google
      // ejemplo:
    // http://localhost:8080/api/Documentos/viewFile?fileId=10Hx51uIibcJEx7h8AWs6Rd5o7KFVqtRD&userId=66ebbc56e9670a5556f9781a&documentId=123412341234123212341239

    @GetMapping("/viewFile")
    public ResponseEntity<?> viewFile(@RequestParam("fileId") String fileId,
            @RequestParam("userId") String userId,
            @RequestParam("documentId") ObjectId documentId) {
        try {

            ArchivoDTO dto = documentoService.viewTheFile(fileId, userId, documentId);

            File file = dto.getFile();
            byte[] fileBytes = dto.getFileBytes();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(fileBytes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("El documento no se pudo visualizar correctamente\n\n" + e.getMessage());
        }
    }

    // DOWNLOAD
    // !el fileId debe de ser el que se guarda en la BD, no el que está en google
    // ejemplo:
    // http://localhost:8080/api/Documentos/downloadFile?fileId=10Hx51uIibcJEx7h8AWs6Rd5o7KFVqtRD&userId=66ebbc56e9670a5556f9781a&documentId=123412341234123212341239
    @GetMapping("/downloadFile")
    public ResponseEntity<?> downloadFile(@RequestParam("fileId") String fileId,
            @RequestParam("userId") String userId,
            @RequestParam("documentId") ObjectId documentId) {
        try {

            ArchivoDTO archivo = documentoService.downloadTheFile(fileId, userId, documentId);

            File file = archivo.getFile();
            byte[] fileBytes = archivo.getFileBytes();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(fileBytes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("El documento no se pudo descargar\n\n" + e.getMessage());
        }
    }

    //                                ----------------------------- BÚSQUEDA -----------------------------

    @PostMapping("/onSearch/filter/")
    public ResponseEntity<List<DocumentoModel>> findAndFilterDocuments(@RequestBody BusquedaFiltroDTO queryParams) {

        List<DocumentoModel> documentos = documentoService.busquedaFiltroDocumentos(queryParams);

        List<DocumentoModel> documentosFiltrados = documentos
                .stream()
                .filter((documento) -> documento.getVisibilidad().equals("publico"))
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(documentosFiltrados);

    }

    // ordenar por

    @PostMapping("/onSearch/filter/orderBy")
    public ResponseEntity<List<DocumentoModel>> findFilterAndOrder(@RequestBody BusquedaOrdenarFiltrarDTO queryParams) {

        List<DocumentoModel> documentos = documentoService.busquedaOrdenada(queryParams);

        List<DocumentoModel> documentosFiltrados = documentos
                .stream()
                .filter((documento) -> documento.getVisibilidad().equals("publico"))
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(documentosFiltrados);

    }

    //                                --- -GETTERS -- //

    @GetMapping("/id/{_id}")
    public ResponseEntity<?> findDocumentByID(@PathVariable("_id") ObjectId _id) {

        try {

            DocumentoModel document = documentoService.getDocumentById(_id);

            return new ResponseEntity<DocumentoModel>(document, HttpStatus.OK);

        } catch (NoSuchDocumentFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        }

    }

    @GetMapping("/getByTitle/{titulo}")
    public ResponseEntity<?> findDocumentByCustomTitle(@PathVariable("titulo") String titulo) {

        try {

            DocumentoModel document = documentoService.getDocumentByTitle(titulo);

            return new ResponseEntity<DocumentoModel>(document, HttpStatus.OK);

        } catch (NoSuchDocumentFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        }
    }

    @GetMapping("/getByKeywords/{keywords}")
    public ResponseEntity<?> findDocumentByKeyword(@PathVariable("keywords") String keywords) {

        try {
            List<String> keywordList = Arrays.asList(keywords.split(","));

            List<DocumentoModel> documents = documentoService.getDocumentsByKeyword(keywordList);

            return new ResponseEntity<>(documents, HttpStatus.OK);

        } catch (NoSuchDocumentFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getByDate/{fechaSubida}")
    public ResponseEntity<?> findDocumentsByFechaSubida(
            @PathVariable("fechaSubida") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fechaSubida) {
        try {
            List<DocumentoModel> documents = documentoService.getDocumentsByFechaSubida(fechaSubida);
            return new ResponseEntity<>(documents, HttpStatus.OK);
        } catch (NoSuchDocumentFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getByCategory/{nombreCategoria}")
    public ResponseEntity<?> findDocumentsByCategoriaNombre(@PathVariable("nombreCategoria") String nombreCategoria) {

        try {
            List<DocumentoModel> documents = documentoService.getDocumentsByCategoriaNombre(nombreCategoria);
            return new ResponseEntity<>(documents, HttpStatus.OK);
        } catch (NoSuchDocumentFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }

    @GetMapping("/getByAuthor/{nombreAutor}")
    public ResponseEntity<?> findDocumentsByAutorUsuarioname(@PathVariable("nombreAutor") String nombreAutor) {
        try {
            List<DocumentoModel> documents = documentoService.getDocumentsByAutorUsuarioname(nombreAutor);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getByLenguage/{idioma}")
    public ResponseEntity<?> findDocumentsByLenguage(@PathVariable("idioma") String idioma) {
        try {
            List<DocumentoModel> documents = documentoService.getDocumentsByLenguage(idioma);
            return new ResponseEntity<>(documents, HttpStatus.OK);
        } catch (NoSuchDocumentFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

  //                                                                INSERTAR

    // /api/Documentos/insert
    // Método para insertar al "repositorio" y a la bd.

    @PostMapping("/insert")
    public ResponseEntity<?> insertDocuments(
            @RequestParam("document") String documentoJson,
            @RequestParam("file") MultipartFile file) {

        Res respuesta;

        try {
            respuesta = documentoService.insertDocument(file, documentoJson);
            return new ResponseEntity<Res>(respuesta, HttpStatus.CREATED);

        } 
        
        catch (CreationException err) {

            respuesta = new Res(500,"Error al crear la publicación/documento: \n" + err.getMessage());
            return ResponseEntity.status(500).body(respuesta);

        } catch (IOException | GeneralSecurityException e) {

            respuesta = new Res(500, "Error al subir el PDF");
            return ResponseEntity.status(500).body(respuesta);
        }
    }

    // ACTUALIZAR SOLAMENTE LOS DATOS y NO el archivo.
    @PutMapping("/updateDoc")
    public ResponseEntity<?> updateDocuments(@RequestParam("document") String documentToBeUpdated) {
        Res respuesta = new Res();
        try {

            String mensaje = documentoService.updateDocument(documentToBeUpdated);

            respuesta.setMessage(mensaje);
            respuesta.setStatus(200);
            return new ResponseEntity<Res>(respuesta, HttpStatus.OK);

        } catch (UpdateException err) {

            respuesta.setMessage("El documento no pudo ser actualizado por lo siguiente: " + err.getMessage());
            respuesta.setStatus(500);

            return ResponseEntity.status(500).body(respuesta);

        }
    }

    @PutMapping("/updateDocWithFile") // ACTUALIZA TANTO LOS ATRIBUTOS como el nuevo URL
    public ResponseEntity<?> updateDocumentAndFile(
            @RequestParam("document") String documentToBeUpdated,
            @RequestParam("file") MultipartFile file) {
                Res respuesta = new Res();
        try {

            String message = documentoService.updateDocumentFile(documentToBeUpdated, file);

            respuesta.setMessage(message);
            respuesta.setStatus(200);

            return new ResponseEntity<Res>(respuesta, HttpStatus.OK);

        } catch (UpdateException err) {

            respuesta.setMessage(err.getMessage());
            respuesta.setStatus(500);

            return ResponseEntity.status(500).body(respuesta);

        }
    }

    // DELETE

    @DeleteMapping("/delete/{_id}") // Este es el object ID
    public ResponseEntity<?> updateDocuments(@PathVariable("_id") ObjectId _id) {

        Res message;

        try {

            message = documentoService.deleteDocument(_id);

            return new ResponseEntity<Res>(message, HttpStatus.OK);

        } catch (DeleteException err) {

            message = new Res(500,"No se pudo eliminar el documento con ID: " + _id.toString());

            return ResponseEntity.status(500).body(message);

        }
    }

}
