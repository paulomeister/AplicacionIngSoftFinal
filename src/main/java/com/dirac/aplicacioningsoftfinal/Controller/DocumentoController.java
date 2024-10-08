package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.DTO.BusquedaFiltroDTO;
import com.dirac.aplicacioningsoftfinal.DTO.BusquedaOrdenarFiltrarDTO;
import com.dirac.aplicacioningsoftfinal.Exception.CreationException;
import com.dirac.aplicacioningsoftfinal.Exception.DeleteException;
import com.dirac.aplicacioningsoftfinal.Exception.InvalidVisibilityException;
import com.dirac.aplicacioningsoftfinal.Exception.NoSuchDocumentFoundException;
import com.dirac.aplicacioningsoftfinal.Exception.UpdateException;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import com.dirac.aplicacioningsoftfinal.Repository.IDocumentoRepository;
import com.dirac.aplicacioningsoftfinal.Service.IDocumentoService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URI;
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

    @GetMapping("id/{id}/download")
    public ResponseEntity<?> downloadDocumentById(@PathVariable("id") ObjectId id) {
        try {
            return documentoService.downloadDocumentById(id);
        } catch (NoSuchDocumentFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(String.format("El documento con id \"%s\" no se encuentra disponible", id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ha ocurrido un error durante la descarga del documento.");
        }
    }

    @GetMapping("titulo/{titulo}/download")
    public RedirectView downloadDocumentByTitle(@PathVariable("titulo") String titulo) {
        try {
            return documentoService.downloadDocumentByTitle(titulo);
        } catch (NoSuchDocumentFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    String.format("El documento con título \"%s\" no se encuentra disponible", titulo));
        } catch (InvalidVisibilityException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El documento no es visible para descarga.");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Ha ocurrido un error durante la descarga del documento.");
        }
    }

    @PostMapping("/onSearch/filter/")
    public ResponseEntity<List<DocumentoModel>> findAndFilterDocuments(@RequestBody BusquedaFiltroDTO queryParams) {

        List<DocumentoModel> documentos = documentoService.busquedaFiltroDocumentos(queryParams);

        List<DocumentoModel> documentosFiltrados = documentos
                .stream()
                .filter((documento) -> documento.getVisibilidad().equals("publico"))
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(documentosFiltrados);

    }

    @PostMapping("/onSearch/filter/orderBy")
    public ResponseEntity<List<DocumentoModel>> findFilterAndOrder(@RequestBody BusquedaOrdenarFiltrarDTO queryParams) {

        List<DocumentoModel> documentos = documentoService.busquedaOrdenada(queryParams);

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

    @GetMapping("/view/{_id}")
    public ResponseEntity<?> viewDocument(@PathVariable ObjectId _id) {
        try {
            DocumentoModel document = documentoService.getDocument(_id);

            if (document.getUrlArchivo() != null) {
                URI location = URI.create(document.getUrlArchivo());

                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(location).build();
            } else {
                return ResponseEntity.badRequest().build();
            }
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

    // CREATE

    @PostMapping("/insert")
    public ResponseEntity<?> insertDocuments(@RequestBody DocumentoModel documento) {
        try {

            String message = documentoService.createDocument(documento);
            return new ResponseEntity<String>(message, HttpStatus.CREATED);

        } catch (CreationException err) {

            return ResponseEntity.status(500).body(err.getMessage());

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
