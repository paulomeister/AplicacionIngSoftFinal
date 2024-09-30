package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.DTO.BusquedaFiltroDTO;
import com.dirac.aplicacioningsoftfinal.DTO.UrlDTO;
import com.dirac.aplicacioningsoftfinal.Exception.NoSuchDocumentFoundException;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import com.dirac.aplicacioningsoftfinal.Service.IDocumentoService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
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

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadDocumentById(@PathVariable("id") String id) throws Exception {

        try {

            UrlDTO resultado = documentoService.recuperarUrlById(id);

            String visibilidad = resultado.getVisibilidad();

            if(visibilidad.equals("publico")) {

                String url = resultado.getUrlArchivo();
                URL castedUrl = new URL(url);

                URLConnection connection = castedUrl.openConnection();
                InputStream inputStream = connection.getInputStream();

                String nombreArchivo = url.substring(url.lastIndexOf("/") + 1);

                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; nombre=" + nombreArchivo);

                return ResponseEntity.ok()
                        .headers(headers)
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(new InputStreamResource(inputStream));

            }

        }
        catch (NoSuchDocumentFoundException e) {

            throw new Exception(e);

        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(String.format("El documento con id \"%s\" no se encuentra disponible para descargar", id));

    }


    @PostMapping("/onSearch/filter/")
    public ResponseEntity<List<DocumentoModel>> findAndFilterDocuments(@RequestBody BusquedaFiltroDTO queryParams){

        List<DocumentoModel> documentos = documentoService.busquedaFiltroDocumentos(queryParams);

        List<DocumentoModel> documentosFiltrados = documentos
                .stream()
                .filter((documento) -> documento.getVisibilidad().equals("publico"))
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(documentosFiltrados);

    }

    // --- --- //

    @GetMapping("/id/{_id}")
    public ResponseEntity<?> findDocumentByID(@PathVariable("_id") ObjectId _id) {

        try {

            DocumentoModel document = documentoService.getDocument(_id);

            return new ResponseEntity<DocumentoModel>(document, HttpStatus.OK);

        }
        catch (NoSuchDocumentFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        }


    }

    @GetMapping("/getByTitle/{titulo}")
    public ResponseEntity<?> findDocumentByCustomTitle(@PathVariable("titulo") String titulo) {


        try {

            DocumentoModel document = documentoService.getDocumentByTitle(titulo);

            return new ResponseEntity<DocumentoModel>(document, HttpStatus.OK);

        }
        catch (NoSuchDocumentFoundException e) {

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
    public ResponseEntity<?> findDocumentsByFechaSubida(@PathVariable("fechaSubida") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fechaSubida) {
        try {
            List<DocumentoModel> documents = documentoService.getDocumentsByFechaSubida(fechaSubida);
            return new ResponseEntity<>(documents, HttpStatus.OK);
        } catch (NoSuchDocumentFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getByCategory/{nombreCategoria}")
    public ResponseEntity<?> findDocumentsByCategoriaNombre(@PathVariable("nombreCategoria") String nombreCategoria) {

        try{
            List<DocumentoModel> documents = documentoService.getDocumentsByCategoriaNombre(nombreCategoria);
            return new ResponseEntity<>(documents, HttpStatus.OK);
        }catch (NoSuchDocumentFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }
    @GetMapping("/getByAuthor/{nombreAutor}")
    public ResponseEntity<?> findDocumentsByAutorUsuarioname(@PathVariable("nombreAutor") String nombreAutor) {
        try {
            List<DocumentoModel> documents = documentoService.getDocumentsByAutorUsuarioname(nombreAutor);
            return new ResponseEntity<>(documents, HttpStatus.OK);
        } catch (NoSuchDocumentFoundException e) {
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






}
