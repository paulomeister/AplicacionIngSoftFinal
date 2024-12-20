package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.DTO.BusquedaFiltroDTO;
import com.dirac.aplicacioningsoftfinal.DTO.OrdenDTO;
import com.dirac.aplicacioningsoftfinal.DTO.Res;
import com.dirac.aplicacioningsoftfinal.DTO.BusquedaOrdenarFiltrarDTO;
import com.dirac.aplicacioningsoftfinal.DTO.ArchivoDTO;
import com.dirac.aplicacioningsoftfinal.DTO.UrlDTO;
import com.dirac.aplicacioningsoftfinal.Exception.CreationException;
import com.dirac.aplicacioningsoftfinal.Exception.DeleteException;
import com.dirac.aplicacioningsoftfinal.Exception.DownloadDocumentException;
import com.dirac.aplicacioningsoftfinal.Exception.IdNotFoundException;
import com.dirac.aplicacioningsoftfinal.Exception.NoSuchDocumentFoundException;
import com.dirac.aplicacioningsoftfinal.Exception.UpdateException;
import com.dirac.aplicacioningsoftfinal.Exception.UsuarioNotFoundException;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel.Autores;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel.DatosComputados;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel.Valoracion;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel.DocsSubidos;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;
import com.dirac.aplicacioningsoftfinal.Repository.IDocumentoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.ByteArrayContent;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.mongodb.client.result.UpdateResult;
import com.google.api.client.json.JsonFactory;
import com.google.api.services.drive.Drive;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.time.LocalDate;
import java.util.Collections;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class DocumentoService implements IDocumentoService {

    @Autowired
    private final IDocumentoRepository documentoRepository;
    private final MongoTemplate mongoTemplate;

    @Lazy
    @Autowired
    private IUsuarioService usuarioService;

    @Autowired
    public DocumentoService(IDocumentoRepository documentoRepository, MongoTemplate mongoTemplate) {
        this.documentoRepository = documentoRepository;
        this.mongoTemplate = mongoTemplate;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static final String APPLICATION_NAME = "AplicacionIngSoftFinal";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String TOKENS_DIRECTORY_PATH = "tokens";
    private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE_FILE);
    private static final String CREDENTIALS_FILE_PATH = "./credentials.json";
    private final static String folderId = "1mdVe9JNnoWZKE7eN9n-szy4Zk2u8DAuV";

    private Credential getDriveCredentials(NetHttpTransport HTTP_TRANSPORT)
            throws GeneralSecurityException, IOException {

        InputStream in = DriveService.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
        if (in == null) {
            throw new FileNotFoundException("Resource not found: " + CREDENTIALS_FILE_PATH);
        }

        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in)); // Secrets

        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();

        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).setCallbackPath("/Callback")
                .build();
        return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");

    }

    public Drive createDrive() throws GeneralSecurityException, IOException {

        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport(); // TRANSPORT

        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, getDriveCredentials(HTTP_TRANSPORT))
                .setApplicationName(APPLICATION_NAME)
                .build();
        return drive;
    }

    public String uploadToDrive(MultipartFile file) throws GeneralSecurityException, IOException {

        String res;

        try {

            Drive drive = createDrive(); // Crea el documento drive

            com.google.api.services.drive.model.File fileMetaData = new com.google.api.services.drive.model.File();
            fileMetaData.setName(file.getOriginalFilename());
            fileMetaData.setParents(Collections.singletonList(folderId));

            // Contenido del header
            ByteArrayContent mediaContent = new ByteArrayContent("application/pdf", file.getBytes());

            // Sube el archivo a Google Drive
            com.google.api.services.drive.model.File uploadedFile = drive.files().create(fileMetaData, mediaContent)
                    .setFields("id").execute();

            // retorna el id de lo que se subió
            res = uploadedFile.getId();
        } catch (Exception e) {
            res = e.getMessage();
        }
        return res;
    }

    public com.google.api.services.drive.model.File getFileById(String fileId)
            throws GeneralSecurityException, IOException {
        Drive drive = createDrive();
        return drive.files().get(fileId).setFields("id, name, mimeType").execute();
    }

    public byte[] downloadFile(String fileId) throws GeneralSecurityException, IOException {

        Drive drive = createDrive(); // crea el servicio de drive

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        drive.files().get(fileId).executeMediaAndDownloadTo(outputStream);
        return outputStream.toByteArray(); // Devuelve el contenido del archivo como byte[]
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

                query.addCriteria(Criteria.where("autores.username").in(autores));

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

    // --- GETTERS --- //

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
        Pageable pageable = PageRequest.of(0, 5); // Página 0, 5 resultados
        List<DocumentoModel> documents = documentoRepository.findTopRatedDocuments(pageable);

        if (documents.isEmpty()) {
            throw new NoSuchDocumentFoundException("No se encontraron documentos valorados.");
        }

        return documents;
    }

    public List<DocumentoModel> getMostDownloadedDocuments() {
        Pageable pageable = PageRequest.of(0, 5); // Página 0, 5 resultados
        List<DocumentoModel> documents = documentoRepository.findMostDownloadedDocuments(pageable);

        if (documents.isEmpty()) {
            throw new NoSuchDocumentFoundException("No se encontraron documentos descargados.");
        }

        return documents;
    }

    // FILE
    @Override
    public ArchivoDTO viewTheFile(String fileId, String userId, ObjectId documentId) {
        try {

            byte[] fileBytes = downloadFile(fileId);
            com.google.api.services.drive.model.File file = getFileById(fileId);

            if (fileBytes.length != 0) { // Verifica que si se haya obtenido un archivo

                // Se obtiene el documento el cuál se está descargando para verificar si
                // existe.
                DocumentoModel documentoDownloading = getDocumentById(documentId);

                // obtenemos el usuario que está descargando:
                UsuarioModel usuarioDownloading = usuarioService.getUserById(userId).orElseThrow(
                        () -> new UsuarioNotFoundException("el usuario con el id, no fue encontrado"
                                + userId));

                // Actualizaremos el campo del "historial" en el documento
                UsuarioModel.Historial nuevoDoc = new UsuarioModel.Historial();

                nuevoDoc.setDocumentoId(documentoDownloading.get_id());
                nuevoDoc.setFechaHora(LocalDate.now());

                List<UsuarioModel.Historial> historialDocumentos = usuarioDownloading.getHistorialDocumentos();
                historialDocumentos.add(nuevoDoc); // se añade ese nuevo documento
                usuarioDownloading.setHistorialDocumentos(historialDocumentos); // se losetea

                // ACTUALIZAR en la base de datos
                usuarioService.insertUser(usuarioDownloading);
            }

            return new ArchivoDTO(file, fileBytes);

        } catch (Exception err) {
            throw new DownloadDocumentException();
        }

    }

    @Override
    public ArchivoDTO downloadTheFile(String fileId, String userId, ObjectId documentId) {
        try {

            byte[] fileBytes = downloadFile(fileId);
            com.google.api.services.drive.model.File file = getFileById(fileId);

            // // obtenemos el documento el cuál se está descargando
            DocumentoModel documentoDownloading = getDocumentById(documentId);

            // // // Obtenemos el usuario que está descargando:
            UsuarioModel usuarioDownloading = usuarioService.getUserById(userId).orElseThrow(
                    () -> new UsuarioNotFoundException("el usuario con el id, no fue encontrado" + userId));

            // // //Se actualizará el campo de documentos descargados
            UsuarioModel.Descargados nuevoDoc = new UsuarioModel.Descargados();
            nuevoDoc.setDocumentoId(documentoDownloading.get_id());
            nuevoDoc.setFechaHora(LocalDate.now());

            List<UsuarioModel.Descargados> docsActualizados = usuarioDownloading.getDocDescargados();
            docsActualizados.add(nuevoDoc); // Se añade un nuevo Documento
            usuarioDownloading.setDocDescargados(docsActualizados); // Se actualizan los nuevos documentos

            // // // Actualiza en la base de datos
            usuarioService.insertUser(usuarioDownloading);

            documentoRepository.save(documentoDownloading);

            return new ArchivoDTO(file, fileBytes);

        } catch (Exception e) {
            throw new DownloadDocumentException(e.getMessage());
        }

    }

    // INSERT

    @Override
    public Res insertDocument(MultipartFile file, String documentoJson) throws IOException, GeneralSecurityException {
        try {
            // Convertir el JSON a uno de tipo DocumentoModel
            ObjectMapper mapper = new ObjectMapper();
            DocumentoModel documento = mapper.readValue(documentoJson, DocumentoModel.class);

            // Se sube el documento al repositorio
            String documentURL = uploadToDrive(file);

            documento.setUrlArchivo(documentURL); // Se modifica la nueva url del documento, el cuál es el ID del
                                                  // documento!
            documentoRepository.save(documento);

            List<Autores> autores = documento.getAutores();

            // Esta es la funcionalidad para añadir el documento subido por el usuario.
            for (Autores autor : autores) {

                if ("principal".equals(autor.getRol().trim())) {

                    String id = autor.getUsuarioIdAsString();

                    UsuarioModel usuario = usuarioService.getUserById(id).orElseThrow(
                            () -> new UsuarioNotFoundException("Autor principal no se encontró en la base de datos"));

                    DocsSubidos nuevoDocSubido = new DocsSubidos(documento.get_id(), documento.getTitulo());

                    List<DocsSubidos> nuevosDOCSSubidos = usuario.getDocSubidos();
                    nuevosDOCSSubidos.add(nuevoDocSubido);
                    usuario.setDocSubidos(nuevosDOCSSubidos);
                    usuarioService.insertUser(usuario); // actualizar en la base de datos
                }
            }

            Res respuesta = new Res();

            respuesta.setMessage("El documento con _id: " + documento.get_id()
                    + " fue guardado con éxito y con fileId: " + documentURL);
            respuesta.setStatus(200);

            return respuesta;
        } catch (Exception e) {
            throw new CreationException("Documento" + e.getMessage() + " ");
        }
    }

    public String insertDocument(DocumentoModel document) {
        try {
            documentoRepository.save(document);
            String documentId = document.getIdAsString();
            return "El documento " + documentId + " fue guardado con éxito";
        } catch (Exception e) {
            throw new CreationException("Documento");
        }
    }

    // UPDATE

    // Método común para actualizar los campos del documento.

    private void actualizarCamposDocumento(DocumentoModel documentoNuevo, DocumentoModel documentoAntiguo) {
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

        if (documentoNuevo.getValoraciones() != null)
            documentoAntiguo.setValoraciones(documentoNuevo.getValoraciones());

        if (documentoNuevo.getVisibilidad() != null)
            documentoAntiguo.setVisibilidad(documentoNuevo.getVisibilidad());
    }

    @Override
    public String updateDocument(String documentoStringifeado) {
        try {
            // Convertir el JSON a un DocumentoModel
            ObjectMapper mapper = new ObjectMapper();
            DocumentoModel documentoNuevo = mapper.readValue(documentoStringifeado, DocumentoModel.class);

            // Obtener el documento antiguo por ID
            DocumentoModel documentoAntiguo = getDocumentById(documentoNuevo.get_id());

            if (documentoAntiguo == null) {
                throw new NoSuchDocumentFoundException(
                        "No existe un documento válido para el id: " + documentoNuevo.get_id().toHexString());
            }

            // Actualizar los campos del documento (sin archivo)
            actualizarCamposDocumento(documentoNuevo, documentoAntiguo);

            // Guardar el documento actualizado en la base de datos
            documentoRepository.save(documentoAntiguo);

            return "El documento fue actualizado exitosamente";

        } catch (Exception e) {
            throw new UpdateException("documento\n" + e.getMessage());
        }
    }

    @Override
    public String updateDocumentFile(String documentoJson, MultipartFile file) {
        try {
            // Convertir el JSON a un DocumentoModel
            ObjectMapper mapper = new ObjectMapper();
            DocumentoModel documentoNuevo = mapper.readValue(documentoJson, DocumentoModel.class);

            // Obtener el documento antiguo por ID
            DocumentoModel documentoAntiguo = getDocumentById(documentoNuevo.get_id());

            if (documentoAntiguo == null) {
                throw new NoSuchDocumentFoundException(
                        "No existe un documento válido para el id: " + documentoNuevo.get_id().toHexString());
            }

            // Actualizar los campos del documento (sin archivo)
            actualizarCamposDocumento(documentoNuevo, documentoAntiguo);

            // Manejo del archivo: subir a Drive y actualizar el URL
            String oldUrlArchivo = documentoAntiguo.getUrlArchivo();
            String newUrlArchivo = uploadToDrive(file);
            documentoAntiguo.setUrlArchivo(newUrlArchivo);

            // Guardar el documento actualizado en la base de datos
            documentoRepository.save(documentoAntiguo);

            // Eliminar el archivo antiguo de Drive
            if (oldUrlArchivo != null && !oldUrlArchivo.isEmpty()) {
                deleteFileById(oldUrlArchivo);
            }

            return "El documento, junto con su archivo, fueron actualizados correctamente.";

        } catch (Exception e) {
            throw new UpdateException("PDF del Documento\n" + e.getMessage());
        }
    }
    // DELETE:

    @Override
    public Res deleteDocument(ObjectId _id) {

        Res respuesta = new Res();

        try {
            String documentUrl = documentoRepository.findById(_id)
                    .orElseThrow(() -> new IdNotFoundException("Document id was not found")).getUrlArchivo();

            DocumentoModel documento = getDocumentById(_id);

            List<Autores> autores = documento.getAutores();

            // Esta es la funcionalidad para ELIMINAR el documento subido por el usuario.
            for (Autores autor : autores) {

                if ("principal".equals(autor.getRol().trim())) {

                    String id = autor.getUsuarioIdAsString();

                    UsuarioModel usuario = usuarioService.getUserById(id).orElseThrow(
                            () -> new UsuarioNotFoundException("Autor principal no se encontró en la base de datos"));

                    DocsSubidos documentoAEliminar = new DocsSubidos(_id, documento.getTitulo());

                    List<DocsSubidos> nuevosDOCSSubidos = usuario.getDocSubidos();
                    nuevosDOCSSubidos.remove(documentoAEliminar); // ELIMINA EL DOCUMENTO de la lista.
                    usuario.setDocSubidos(nuevosDOCSSubidos);
                    usuarioService.insertUser(usuario); // se actualiza el usuario
                }
            }

            // Se elimina el archivo y el documento
            deleteFileById(documentUrl);
            documentoRepository.deleteById(_id);

            respuesta.setMessage("El documento con _id " + _id + " fue eliminado con éxito.");
            respuesta.setStatus(200);

        } catch (Exception e) {

            respuesta.setMessage("No se pudo eliminar ese Documento :( " + e.getMessage());
            respuesta.setStatus(500);

        }
        return respuesta;
    }

    @Override
    public String deleteFileById(String fileId) throws GeneralSecurityException, IOException {
        String result;

        try {

            Drive drive = createDrive();

            // Elimina el archivo con el fileId proporcionado
            drive.files().delete(fileId).execute();

            result = "El archivo con ID:" + fileId + "fue eliminado con éxito.";

        } catch (Exception e) {

            result = "ERROR: No se pudo eliminar ese documento del repositorio\n\n" + e.getMessage();

        }
        return result;
    }

    // Método para agregar una valoración
    @Override
    public String agregarValoracion(ObjectId documentoId, Valoracion nuevaValoracion) {
        DocumentoModel documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado"));

        nuevaValoracion.setFechaCreacion(new Date());
        documento.getValoraciones().add(nuevaValoracion);
        actualizarDatosComputados(documento);
        documentoRepository.save(documento);

        return "Valoración agregada exitosamente";
    }

    @Override
    public String editarValoracion(ObjectId documentoId, ObjectId usuarioId, Valoracion valoracionActualizada) {
        DocumentoModel documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado"));

        List<Valoracion> valoraciones = documento.getValoraciones();

        Valoracion valoracionExistente = valoraciones.stream()
                .filter(v -> v.getUsuarioId().equals(usuarioId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Valoración no encontrada para el usuario"));

        valoracionExistente.setPuntuacion(valoracionActualizada.getPuntuacion());
        valoracionExistente.setComentario(valoracionActualizada.getComentario());
        actualizarDatosComputados(documento);

        documentoRepository.save(documento);
        return "Valoración actualizada exitosamente";
    }

    @Override
    public String eliminarValoracion(ObjectId documentoId, ObjectId usuarioId) {
        DocumentoModel documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado"));

        boolean removed = documento.getValoraciones().removeIf(v -> v.getUsuarioId().equals(usuarioId));
        if (!removed) {
            throw new IllegalArgumentException("Valoración no encontrada para el usuario");
        }

        actualizarDatosComputados(documento);
        documentoRepository.save(documento);

        return "Valoración eliminada exitosamente";
    }

    

    // Método para actualizar datos computados
    private void actualizarDatosComputados(DocumentoModel documento) {
        List<Valoracion> valoraciones = documento.getValoraciones();
        double sumaPuntuaciones = valoraciones.stream().mapToDouble(Valoracion::getPuntuacion).sum();
        int totalComentarios = valoraciones.size();

        documento.getDatosComputados().setValoracionPromedio(sumaPuntuaciones / Math.max(totalComentarios, 1));
        documento.getDatosComputados().setComentariosTotales(totalComentarios);
    }

    @Override
    public String eliminarValoracionesPorUsuarioIdEnTodosLosDocumentos(ObjectId usuarioId) {
           // Crear un filtro que aplique a todos los documentos y elimine todas las valoraciones con el usuarioId especificado
           Query query = new Query();
           Update update = new Update().pull("valoraciones", new Document("usuarioId", usuarioId));
           
           // Actualizar múltiples documentos
           mongoTemplate.updateMulti(query, update, DocumentoModel.class);

           return "Eliminado correctamente";
    }

}