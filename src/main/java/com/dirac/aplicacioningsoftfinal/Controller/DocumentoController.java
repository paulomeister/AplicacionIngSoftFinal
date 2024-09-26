package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.Exception.NoSuchDocumentFoundException;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import com.dirac.aplicacioningsoftfinal.Service.IDocumentoService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;
import java.util.List;


@RestController
@RequestMapping("/api/Documentos")
public class DocumentoController {

    private final IDocumentoService documentoService;

    @Autowired
    public DocumentoController(IDocumentoService documentoService) {
        this.documentoService = documentoService;
    }

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
