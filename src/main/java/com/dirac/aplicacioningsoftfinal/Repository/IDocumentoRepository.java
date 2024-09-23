package com.dirac.aplicacioningsoftfinal.Repository;

import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;


@Repository
public interface IDocumentoRepository extends MongoRepository<DocumentoModel, ObjectId> {

    @Query("{_id : '?0'}")
    Optional<DocumentoModel> findDocumentByID(ObjectId _id);

    @Query("{titulo : ?0}")
    Optional<DocumentoModel> findDocumentByCustomTitle(String titulo);

    @Query("{ 'keywords': { $in: ?0 } }")
    List<DocumentoModel> findDocumentsByKeyword(List<String> keywords);

    @Query("{ 'fechaSubida': ?0 }")
    List<DocumentoModel> findDocumentsByFechaSubida(Date fechaSubida);


}
