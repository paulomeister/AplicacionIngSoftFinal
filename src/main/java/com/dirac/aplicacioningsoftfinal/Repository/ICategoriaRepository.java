package com.dirac.aplicacioningsoftfinal.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.dirac.aplicacioningsoftfinal.Model.CategoriaModel;
import java.util.List;

@Repository
public interface ICategoriaRepository extends MongoRepository<CategoriaModel, String> {

    @Query("{'nombre': ?0}")
    List<CategoriaModel> findByName(String name);

    @Query(value = "{'_id': ?0}")
    List<CategoriaModel> findSubcategories(String id);
}
