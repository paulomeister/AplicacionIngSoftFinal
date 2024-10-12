package com.dirac.aplicacioningsoftfinal.Repository;

import com.dirac.aplicacioningsoftfinal.DTO.UrlDTO;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;



import java.util.Date;
import java.util.List;
import java.util.Optional;


@Repository
public interface IDocumentoRepository extends MongoRepository<DocumentoModel, ObjectId> {

    @Query(value = "{ '_id': ?0 }", fields = "{'_id': 0, 'urlArchivo': 1, 'visibilidad': 1}")
    Optional<UrlDTO> findUrlArchivoById(ObjectId id);

    @Query("{_id : '?0'}")
    Optional<DocumentoModel> findDocumentByID(ObjectId _id);

    @Query("{titulo : ?0}")
    Optional<DocumentoModel> findDocumentByCustomTitle(String titulo);

    @Query("{ 'keywords': { $in: ?0 } }")
    List<DocumentoModel> findDocumentsByKeyword(List<String> keywords);

    @Query("{ 'fechaSubida': ?0 }")
    List<DocumentoModel> findDocumentsByFechaSubida(Date fechaSubida);

    @Query("{ 'categoria.nombre': ?0 }")
    List<DocumentoModel> findDocumentsByCategoriaNombre(String nombreCategoria);

    @Query("{ 'autores.nombre': ?0 }")
    List<DocumentoModel> findDocumentsByAutorUsuarioname(String nombreAutor);

    @Query("{ 'idioma': ?0 }")
    List<DocumentoModel> findDocumentsByLenguage(String idioma);

    @Query(value = "{ 'visibilidad': 'publico' }", sort = "{ 'fechaSubida': -1 }")
    List<DocumentoModel> findRecentDocuments(Pageable pageable);
    
    @Query(value = "{ 'visibilidad': 'publico' }", sort = "{ 'datosComputados.valoracionPromedio': -1 }")
    List<DocumentoModel> findTopRatedDocuments(Pageable pageable);

    @Query(value = "{ 'visibilidad': 'publico' }", sort = "{ 'datosComputados.descargasTotales': -1 }")
    List<DocumentoModel> findMostDownloadedDocuments(Pageable pageable);

   



}
