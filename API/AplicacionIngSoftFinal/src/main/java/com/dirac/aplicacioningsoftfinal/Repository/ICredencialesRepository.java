package com.dirac.aplicacioningsoftfinal.Repository;

import com.dirac.aplicacioningsoftfinal.Model.CredencialesModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICredencialesRepository extends MongoRepository<CredencialesModel, String> {

    @Query("{ $or: [ {'username': {$regex: ?0, $options: 'i'}}, {'email': {$regex: ?0, $options: 'i'}} ] }")
    Optional<CredencialesModel> findCredencialesByIdentificador(String identificador);

}
