package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.DTO.BusquedaFiltroDTO;
import com.dirac.aplicacioningsoftfinal.DTO.UrlDTO;
import com.dirac.aplicacioningsoftfinal.Exception.NoSuchDocumentFoundException;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import com.dirac.aplicacioningsoftfinal.Repository.IDocumentoRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class DocumentoService implements IDocumentoService {

    private final IDocumentoRepository documentoRepository;
    private final MongoTemplate mongoTemplate;


    @Autowired
    public DocumentoService(IDocumentoRepository documentoRepository, MongoTemplate mongoTemplate) {
        this.documentoRepository = documentoRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public UrlDTO recuperarUrlById(String id) {

        UrlDTO url = documentoRepository.findUrlArchivoById(id)
                .orElseThrow(() -> new NoSuchDocumentFoundException(String.format("El documento con id \"%s\" no se encuentra en la base de datos", id)));


        return url;

    }


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

        if(tieneFiltros) {

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

    // --- --- //

    public DocumentoModel getDocument(ObjectId _id) {

        return documentoRepository.findDocumentByID(_id)
                .orElseThrow(() -> new NoSuchDocumentFoundException(String.format("El documento con ID \"%s\" no se encuentra en la base de datos", _id)));

    }

    public DocumentoModel getDocumentByTitle(String titulo) {
        return documentoRepository.findDocumentByCustomTitle(titulo)
                .orElseThrow(() -> new NoSuchDocumentFoundException(String.format("El documento con título \"%s\" no se encuentra en la base de datos", titulo)));
    }

    public List<DocumentoModel> getDocumentsByKeyword(List<String> keywords) {
        List<DocumentoModel> documents = documentoRepository.findDocumentsByKeyword(keywords);


        if (documents.isEmpty()) {
            throw new NoSuchDocumentFoundException(String.format("No se encontraron documentos con las palabras clave \"%s\"", keywords));
        }
        return documents;
    }

        

    public List<DocumentoModel> getDocumentsByFechaSubida(Date fechaSubida) {
        List<DocumentoModel> documents = documentoRepository.findDocumentsByFechaSubida(fechaSubida);
        if (documents.isEmpty()) {
            throw new NoSuchDocumentFoundException(String.format("No se encontraron documentos con la fecha \"%s\"", fechaSubida));
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

    public List<DocumentoModel> getDocumentsByLenguage(String idioma) {

        List<DocumentoModel> documents = documentoRepository.findDocumentsByLenguage(idioma);

        if (documents.isEmpty()) {
            throw new NoSuchDocumentFoundException(
                    String.format("No se encontraron documentos del idioma \"%s\"", idioma));
        }

        return documents;
    }








}
