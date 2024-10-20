package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.DTO.BusquedaFiltroDTO;
import com.dirac.aplicacioningsoftfinal.DTO.OrdenDTO;
import com.dirac.aplicacioningsoftfinal.DTO.Res;
import com.dirac.aplicacioningsoftfinal.DTO.BusquedaOrdenarFiltrarDTO;
import com.dirac.aplicacioningsoftfinal.DTO.UrlDTO;
import com.dirac.aplicacioningsoftfinal.Exception.CreationException;
import com.dirac.aplicacioningsoftfinal.Exception.DeleteException;
import com.dirac.aplicacioningsoftfinal.Exception.IdNotFoundException;
import com.dirac.aplicacioningsoftfinal.Exception.InvalidVisibilityException;
import com.dirac.aplicacioningsoftfinal.Exception.NoSuchDocumentFoundException;
import com.dirac.aplicacioningsoftfinal.Exception.UpdateException;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel.DatosComputados;
import com.dirac.aplicacioningsoftfinal.Repository.IDocumentoRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.ByteArrayContent;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.DriveScopes;
import com.google.api.client.json.JsonFactory;
import com.google.api.services.drive.Drive;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.util.Collections;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class DocumentoService implements IDocumentoService {

    private final IDocumentoRepository documentoRepository;
    private final MongoTemplate mongoTemplate;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String SERVICE_ACOUNT_KEY_PATH = getPathToGoodleCredentials();

    private static String getPathToGoodleCredentials() {
        String currentDirectory = System.getProperty("user.dir");
        Path filePath = Paths.get(currentDirectory, "cred.json");
        return filePath.toString();
    }

    public String uploadImageToDrive(MultipartFile file) throws GeneralSecurityException, IOException {

        String res;

        try {
            String folderId = "1mdVe9JNnoWZKE7eN9n-szy4Zk2u8DAuV";

            Drive drive = createDriveService();

            com.google.api.services.drive.model.File fileMetaData = new com.google.api.services.drive.model.File();
            fileMetaData.setName(file.getOriginalFilename());
            fileMetaData.setParents(Collections.singletonList(folderId));

            ByteArrayContent mediaContent = new ByteArrayContent("application/pdf", file.getBytes());

            // Sube el archivo a Google Drive
            com.google.api.services.drive.model.File uploadedFile = drive.files().create(fileMetaData, mediaContent)
                    .setFields("id").execute();

            // retorna el id de lo que se subió
            res = uploadedFile.getId();
        } catch (Exception e) {
            res = "ERROR";
        }
        return res;
    }

    private Drive createDriveService() throws GeneralSecurityException, IOException {

        GoogleCredential credential = GoogleCredential.fromStream(new FileInputStream(SERVICE_ACOUNT_KEY_PATH))
                .createScoped(Collections.singleton(DriveScopes.DRIVE));

        return new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                credential).build();

    }

    public com.google.api.services.drive.model.File getFileById(String fileId)
            throws GeneralSecurityException, IOException {
        Drive drive = createDriveService();
        return drive.files().get(fileId).setFields("id, name, mimeType").execute();
    }

    public byte[] downloadFile(String fileId) throws GeneralSecurityException, IOException {
        Drive drive = createDriveService();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        drive.files().get(fileId).executeMediaAndDownloadTo(outputStream);
        return outputStream.toByteArray(); // Devuelve el contenido del archivo como byte[]
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Autowired
    public DocumentoService(IDocumentoRepository documentoRepository, MongoTemplate mongoTemplate) {
        this.documentoRepository = documentoRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public UrlDTO recuperarUrlById(ObjectId id) {

        UrlDTO url = documentoRepository.findUrlArchivoById(id)
                .orElseThrow(() -> new NoSuchDocumentFoundException(
                        String.format("El documento con id \"%s\" no se encuentra en la base de datos", id)));

        return url;

    }


    // FILTRAR POR
    public List<DocumentoModel> busquedaFiltroDocumentos(BusquedaFiltroDTO entrada) {

        Query query = new Query();

        String titulo = entrada.getTitulo();

        if (titulo != null && !titulo.isEmpty()) {

            query.addCriteria(Criteria.where("titulo").regex(".*" + titulo + ".*", "i"));

        }

        Boolean tieneFiltros = entrada.getTieneFiltros();

        List<String> keywords = entrada.getKeywords();
        List<String> categorias = entrada.getCategorias();
        List<String> autores = entrada.getAutores();
        Integer desde = entrada.getDesde();
        Integer hasta = entrada.getHasta();

        if (tieneFiltros) {

            if (keywords != null && !keywords.isEmpty()) {

                query.addCriteria(Criteria.where("keywords").in(keywords));

            }

            if (categorias != null && !categorias.isEmpty()) {

                query.addCriteria(Criteria.where("categoria.nombre").in(categorias));

            }

            if (autores != null && !autores.isEmpty()) {

                query.addCriteria(Criteria.where("autores.nombre").in(autores));

            }

            if (desde != null || hasta != null) {

                Criteria dateCriteria = Criteria.where("year");

                if (desde != null && desde > 0) {

                    dateCriteria.gte(desde);

                }
                if (hasta != null && hasta > 0) {

                    dateCriteria.lte(hasta);

                }

                query.addCriteria(dateCriteria);

            }

        }

        return mongoTemplate.find(query, DocumentoModel.class);

    }

    // -- ORDENAR POR -- //

    @Override
    public List<DocumentoModel> busquedaOrdenada(BusquedaOrdenarFiltrarDTO entrada) {

        Query query = new Query();

        String titulo = entrada.getTitulo();

        if (titulo != null && !titulo.isEmpty()) {

            query.addCriteria(Criteria.where("titulo").regex(".*" + titulo + ".*", "i"));

        }

        Boolean tieneFiltros = entrada.getTieneFiltros();

        List<String> keywords = entrada.getKeywords();
        List<String> categorias = entrada.getCategorias();
        List<String> autores = entrada.getAutores();
        Integer desde = entrada.getDesde();
        Integer hasta = entrada.getHasta();

        if (tieneFiltros) {

            if (keywords != null && !keywords.isEmpty()) {

                query.addCriteria(Criteria.where("keywords").in(keywords));

            }

            if (categorias != null && !categorias.isEmpty()) {

                query.addCriteria(Criteria.where("categoria.nombre").in(categorias));

            }

            if (autores != null && !autores.isEmpty()) {

                query.addCriteria(Criteria.where("autores.nombre").in(autores));

            }

            if (desde != null || hasta != null) {

                Criteria dateCriteria = Criteria.where("year");

                if (desde != null && desde > 0) {

                    dateCriteria.gte(desde);

                }
                if (hasta != null && hasta > 0) {

                    dateCriteria.lte(hasta);

                }

                query.addCriteria(dateCriteria);

            }

        }
        //

        Boolean tieneOrden = entrada.getTieneOrden();
        List<OrdenDTO> orden = entrada.getOrden();
        if (tieneOrden && orden != null && !orden.isEmpty()) {
            List<Sort.Order> orders = new ArrayList<>();
            for (OrdenDTO ordenDTO : orden) {
                String campo = ordenDTO.getCampo();
                String direccion = ordenDTO.getDireccion();
                if (campo != null && !campo.isEmpty()
                        && (direccion.equalsIgnoreCase("asc") || direccion.equalsIgnoreCase("desc"))) {
                    Sort.Direction sortDirection = direccion.equalsIgnoreCase("asc") ? Sort.Direction.ASC
                            : Sort.Direction.DESC;
                    orders.add(new Sort.Order(sortDirection, campo));
                }
            }

            if (!orders.isEmpty()) {
                query.with(Sort.by(orders));
            }
        }

        return mongoTemplate.find(query, DocumentoModel.class);

    }

    // --- --- //

    public DocumentoModel getDocumentById(ObjectId _id) {

        return documentoRepository.findDocumentByID(_id)
                .orElseThrow(() -> new NoSuchDocumentFoundException(
                        String.format("El documento con ID \"%s\" no se encuentra en la base de datos", _id)));

    }

    public DocumentoModel getDocumentByTitle(String titulo) {
        return documentoRepository.findDocumentByCustomTitle(titulo)
                .orElseThrow(() -> new NoSuchDocumentFoundException(
                        String.format("El documento con título \"%s\" no se encuentra en la base de datos", titulo)));
    }

    public List<DocumentoModel> getDocumentsByKeyword(List<String> keywords) {
        List<DocumentoModel> documents = documentoRepository.findDocumentsByKeyword(keywords);

        if (documents.isEmpty()) {
            throw new NoSuchDocumentFoundException(
                    String.format("No se encontraron documentos con las palabras clave \"%s\"", keywords));
        }
        return documents;
    }

    public List<DocumentoModel> getDocumentsByFechaSubida(Date fechaSubida) {
        List<DocumentoModel> documents = documentoRepository.findDocumentsByFechaSubida(fechaSubida);
        if (documents.isEmpty()) {
            throw new NoSuchDocumentFoundException(
                    String.format("No se encontraron documentos con la fecha \"%s\"", fechaSubida));
        }
        return documents;
    }

    public List<DocumentoModel> getDocumentsByCategoriaNombre(String nombreCategoria) {

        List<DocumentoModel> documents = documentoRepository.findDocumentsByCategoriaNombre(nombreCategoria);

        if (documents.isEmpty()) {
            throw new NoSuchDocumentFoundException(
                    String.format("No se encontraron documentos con la categoría \"%s\"", nombreCategoria));
        }

        return documents;
    }

    public List<DocumentoModel> getDocumentsByAutorUsuarioname(String nombreAutor) {

        List<DocumentoModel> documents = documentoRepository.findDocumentsByAutorUsuarioname(nombreAutor);

        if (documents.isEmpty()) {
            throw new NoSuchDocumentFoundException(
                    String.format("No se encontraron documentos del autor \"%s\"", nombreAutor));
        }

        return documents;
    }

    public List<DocumentoModel> getDocumentsByLanguage(String idioma) {

        List<DocumentoModel> documents = documentoRepository.findDocumentsByLanguage(idioma);

        if (documents.isEmpty()) {
            throw new NoSuchDocumentFoundException(
                    String.format("No se encontraron documentos del idioma \"%s\"", idioma));
        }

        return documents;
    }
    public List<DocumentoModel> getRecentDocuments() {
        
        Pageable pageable = PageRequest.of(0, 5);
        List<DocumentoModel> documents = documentoRepository.findRecentDocuments(pageable);
    
        if (documents.isEmpty()) {
            throw new NoSuchDocumentFoundException("No se encontraron documentos recientes.");
        }
    
        return documents;
    }

    public List<DocumentoModel> getTopRatedDocuments() {
        Pageable pageable = PageRequest.of(0, 5);  // Página 0, 5 resultados
        List<DocumentoModel> documents = documentoRepository.findTopRatedDocuments(pageable);
    
        if (documents.isEmpty()) {
            throw new NoSuchDocumentFoundException("No se encontraron documentos valorados.");
        }
    
        return documents;
    }

    public List<DocumentoModel> getMostDownloadedDocuments() {
        Pageable pageable = PageRequest.of(0, 5);  // Página 0, 5 resultados
        List<DocumentoModel> documents = documentoRepository.findMostDownloadedDocuments(pageable);
    
        if (documents.isEmpty()) {
            throw new NoSuchDocumentFoundException("No se encontraron documentos descargados.");
        }
    
        return documents;
    }


    public ResponseEntity<?> downloadDocumentById(ObjectId id) throws Exception {
        UrlDTO resultado = recuperarUrlById(id);
        String visibilidad = resultado.getVisibilidad();

        if (visibilidad.equals("publico")) {
            DocumentoModel document = getDocumentById(id);
            updateDownloadStats(document);

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

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(String.format("El documento con id \"%s\" no se encuentra disponible para descargar", id));
    }

    public RedirectView downloadDocumentByTitle(String titulo) {
        DocumentoModel document = getDocumentByTitle(titulo);
        if (!document.getVisibilidad().equals("publico")) {
            throw new InvalidVisibilityException();
        }

        updateDownloadStats(document);
        return new RedirectView(document.getUrlArchivo());
    }

    public void updateDownloadStats(DocumentoModel document) {
        DatosComputados datosComputados = document.getDatosComputados();
        long descargasTotales = datosComputados.getDescargasTotales() + 1;
        double valoracionPromedio = datosComputados.getValoracionPromedio();
        long comentariosTotales = datosComputados.getComentariosTotales();

        document.setDatosComputados(new DatosComputados(descargasTotales, valoracionPromedio, comentariosTotales));
        documentoRepository.save(document);
    }

    @Override
    public String insertDocument(DocumentoModel documento) {
        try {
            documentoRepository.save(documento);
            return "El documento con _id: " + documento.get_id() + " fue guardado con éxito";
        } catch (Error e) {
            throw new CreationException("documento");
        }
    }

    @Override
    public String updateDocument(ObjectId idDocumentoAntiguo, DocumentoModel documentoNuevo) {

        try {

            DocumentoModel documentoAntiguo = documentoRepository.findById(idDocumentoAntiguo)
                    .orElseThrow(() -> new IdNotFoundException("No se pudo hallar un documento con ese id"));

            // Each attribute is kept on
            if (documentoNuevo.getAutores() != null)
                documentoAntiguo.setAutores(documentoNuevo.getAutores());

            if (documentoNuevo.getDatosComputados() != null)
                documentoAntiguo.setDatosComputados(documentoNuevo.getDatosComputados());

            if (documentoNuevo.getDescripcion() != null)
                documentoAntiguo.setDescripcion(documentoNuevo.getDescripcion());

            if (documentoNuevo.getFechaSubida() != null)
                documentoAntiguo.setFechaSubida(documentoNuevo.getFechaSubida());

            if (documentoNuevo.getIdioma() != null)
                documentoAntiguo.setIdioma(documentoNuevo.getIdioma());

            if (documentoNuevo.getKeywords() != null)
                documentoAntiguo.setKeywords(documentoNuevo.getKeywords());

            if (documentoNuevo.getTitulo() != null)
                documentoAntiguo.setTitulo(documentoNuevo.getTitulo());

            if (documentoNuevo.getUrlArchivo() != null)
                documentoAntiguo.setUrlArchivo(documentoNuevo.getUrlArchivo());

            if (documentoNuevo.getValoraciones() != null)
                documentoAntiguo.setValoraciones(documentoNuevo.getValoraciones());

            if (documentoNuevo.getVisibilidad() != null)
                documentoAntiguo.setVisibilidad(documentoNuevo.getVisibilidad());

            // Document is saved
            documentoRepository.save(documentoAntiguo);

            return "El documento con _id " + documentoAntiguo.get_id() + " fue actualizado con éxito";

        } catch (Error e) {
            throw new UpdateException("documento\n" + e.getMessage());
        }

    }

    @Override
    public String deleteDocument(ObjectId _id) {
        try {
            documentoRepository.deleteById(_id);

            return "El documento con _id " + _id + "fue eliminado con éxito.";

        } catch (Exception e) {
            throw new DeleteException("documento\n" + e.getMessage());

        }
    }
}
