package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.DTO.BusquedaFiltroDTO;
import com.dirac.aplicacioningsoftfinal.DTO.BusquedaOrdenarFiltrarDTO;
import com.dirac.aplicacioningsoftfinal.DTO.DocDescargadosDTO;
import com.dirac.aplicacioningsoftfinal.DTO.HistorialDocumentosDTO;
import com.dirac.aplicacioningsoftfinal.DTO.Res;
import com.dirac.aplicacioningsoftfinal.Exception.CreationException;
import com.dirac.aplicacioningsoftfinal.Exception.DeleteException;
import com.dirac.aplicacioningsoftfinal.Exception.NoSuchDocumentFoundException;
import com.dirac.aplicacioningsoftfinal.Exception.UpdateException;
import com.dirac.aplicacioningsoftfinal.Exception.UsuarioNotFoundException;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel.DatosComputados;
import com.dirac.aplicacioningsoftfinal.Repository.IDocumentoRepository;
import com.dirac.aplicacioningsoftfinal.Service.IDocumentoService;
import com.dirac.aplicacioningsoftfinal.Service.IUsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
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

    ////////////////////////////////////////// DRIVE
    ////////////////////////////////////////// //////////////////////////////////////////

    @PostMapping("/uploadToGoogleDrive")
    public ResponseEntity<Object> handleFileUpload(@RequestParam("file") MultipartFile file)
            throws IOException, GeneralSecurityException {

        // Si envían un pdf que está VACÍO, entonces:
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No hay nada en el archivo");
        }

        // Verifica si el archivo es un PDF
        if (!file.getContentType().equals("application/pdf")) {
            return ResponseEntity.badRequest().body("Solo pdf's se permiten.");
        }

        // Sube el Documento a Drive
        String res = documentoService.uploadImageToDrive(file);

        if (res != "ERROR") {
            return ResponseEntity.ok(res);
        } else {
            return ResponseEntity.status(500).body(res);
        }
    }

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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //                                              VIEW
    // !el fileId debe de ser el que se guarda en la BD, no el que está en google DRIVE! <<<---<-<-<-<-<-<-<-<-
    // ejemplo: http://localhost:8080/api/Documentos/viewFile?fileId=10Hx51uIibcJEx7h8AWs6Rd5o7KFVqtRD&userId=66ebbc56e9670a5556f9781a&documentId=123412341234123212341239
    
    @GetMapping("/viewFile")
    public ResponseEntity<?> viewFile(@RequestParam("fileId") String fileId,
                                      @RequestParam("userId") String userId,
                                      @RequestParam("documentId") ObjectId documentId
                                          ) {
        try {

             // obtenemos el documento el cuál se está descargando PARA VERIFICAR SI REALMENTE EXISTE O NO
             DocumentoModel documentoDownloading = documentoService.getDocumentById(documentId);

             // obtenemos el usuario que está descargando:
             UsuarioModel usuarioDownloading = usuarioService.getUserById(userId).orElseThrow(()->new UsuarioNotFoundException("el usuario con el id, no fue encontrado" + userId));
 
             // se actualizará el campo del historial de documentos 
 
             HistorialDocumentosDTO nuevoDoc = new HistorialDocumentosDTO();
 
             nuevoDoc.setDocumentoId(documentoDownloading.get_id());
             nuevoDoc.setFechaHora(LocalDate.now());
 

             List<HistorialDocumentosDTO> historialDocumentos = usuarioDownloading.getHistorialDocumentos();
             historialDocumentos.add(nuevoDoc); // se añade ese nuevo documento
             usuarioDownloading.setHistorialDocumentos(historialDocumentos);   // se lo setea    
 
             // ACTUALIZAR en la base de datos
             usuarioService.insertUser(usuarioDownloading);


            byte[] fileBytes = documentoService.downloadFile(fileId);
            com.google.api.services.drive.model.File file = documentoService.getFileById(fileId);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(fileBytes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("El documento no se pudo visualizar correctamente\n\n" + e.getMessage());
        }
    }


    //                                              DOWNLOAD
    
    // !el fileId debe de ser el que se guarda en la BD, no el que está en google DRIVE! <<<---<-<-<-<-<-<-<-<-
    // ejemplo: http://localhost:8080/api/Documentos/downloadFile?fileId=10Hx51uIibcJEx7h8AWs6Rd5o7KFVqtRD&userId=66ebbc56e9670a5556f9781a&documentId=123412341234123212341239
    @GetMapping("/downloadFile")
    public ResponseEntity<?> downloadFile(@RequestParam("fileId") String fileId,
                                          @RequestParam("userId") String userId,
                                          @RequestParam("documentId") ObjectId documentId
                                          ) {
        try {

            byte[] fileBytes = documentoService.downloadFile(fileId);
            com.google.api.services.drive.model.File file = documentoService.getFileById(fileId);

            // obtenemos el documento el cuál se está descargando
            DocumentoModel documentoDownloading = documentoService.getDocumentById(documentId);

            DatosComputados nuevosDatos = new DatosComputados(); // se crea un nuevo DTO de DatosComputados

            long descargasTotales = documentoDownloading.getDatosComputados().getDescargasTotales() + 1; // se le añade uno a la descarga
            double valoracionPromedio = documentoDownloading.getDatosComputados().getValoracionPromedio();
            long comentariosTotales = documentoDownloading.getDatosComputados().getComentariosTotales();

            nuevosDatos.setDescargasTotales(descargasTotales); // se actualizan los datos
            nuevosDatos.setValoracionPromedio(valoracionPromedio);
            nuevosDatos.setComentariosTotales(comentariosTotales);

            documentoDownloading.setDatosComputados(nuevosDatos); // se actualizan los datos computados en el documento


            // obtenemos el usuario que está descargando:
            UsuarioModel usuarioDownloading = usuarioService.getUserById(userId).orElseThrow(()->new UsuarioNotFoundException("el usuario con el id, no fue encontrado" + userId));

            // se actualizará el campo de documentos descargados

            DocDescargadosDTO nuevoDoc = new DocDescargadosDTO();

            nuevoDoc.setDocumentoId(documentoDownloading.get_id());
            nuevoDoc.setFechaHora(LocalDate.now());


            List<DocDescargadosDTO> docsActualizados = usuarioDownloading.getDocDescargados();
            docsActualizados.add(nuevoDoc); // se añade ese nuevo documento
            usuarioDownloading.setDocDescargados(docsActualizados);   // se lo setea    

            // ACTUALIZAR en la base de datos
            usuarioService.insertUser(usuarioDownloading);
            documentoService.insertDocument(documentoDownloading);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(fileBytes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("El documento no se pudo descargar\n\n" + e.getMessage());
        }
    }

//         -----------------------------          BÚSQUEDA          -----------------------------          

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

    // --- -GETTERS -- //

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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
    // /api/Documentos/insert
    // Método para insertar al "repositorio" y a la bd.

    @PostMapping("/insert")
    public ResponseEntity<?> insertDocuments(
            @RequestParam("document") String documentoJson,
            @RequestParam("file") MultipartFile file) {
        try {
            // Convertir el JSON a uno de tipo DocumentoModel
            ObjectMapper mapper = new ObjectMapper();
            DocumentoModel documento = mapper.readValue(documentoJson, DocumentoModel.class);

            // Se sube el documento al repositorio
            String documentURL = documentoService.uploadImageToDrive(file);

            documento.setUrlArchivo(documentURL); // Se modifica la nueva url del documento, el cuál es el ID del documento!

            documentoService.insertDocument(documento); // Se inserta el NUEVO documento a la base de datos

            Res respuesta = new Res();

            respuesta.setMessage("listo");
            respuesta.setStatus(200);

            return new ResponseEntity<Res>(respuesta, HttpStatus.CREATED);

        } catch (CreationException err) {
            return ResponseEntity.status(500).body("Error al crear la publicación/documento:\n\n"+err.getMessage());

            // !important TODO manejar los errores de la bd.

        }
        catch(IOException | GeneralSecurityException e) {
            return ResponseEntity.status(500).body("ERROR al subir el PDF\n\n" + e.getMessage());
        }
    }

    // UPDATE
    @PutMapping("/update/{_id}")
    public ResponseEntity<?> updateDocuments(@PathVariable("_id") ObjectId _id, @RequestBody DocumentoModel documento) {
        try {

            String message = documentoService.updateDocument(_id, documento);

            return new ResponseEntity<String>(message, HttpStatus.OK);

        } catch (UpdateException err) {

            return ResponseEntity.status(500).body(err.getMessage());

        }
    }

    // DELETE

    @DeleteMapping("/delete/{_id}")
    public ResponseEntity<?> updateDocuments(@PathVariable("_id") ObjectId _id) {
        try {

            String message = documentoService.deleteDocument(_id);

            return new ResponseEntity<String>(message, HttpStatus.OK);

        } catch (DeleteException err) {

            return ResponseEntity.status(500).body(err.getMessage());

        }
    }

}
