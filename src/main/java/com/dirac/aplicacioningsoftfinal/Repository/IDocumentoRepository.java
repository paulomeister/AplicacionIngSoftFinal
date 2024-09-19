package com.dirac.aplicacioningsoftfinal.Repository;

import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface IDocumentoRepository extends MongoRepository<DocumentoModel, Long> {

    @Query("{titulo : '?0'}")
    Optional<DocumentoModel> findDocumentByCustomTitle(String titulo);

}
