package com.dirac.aplicacioningsoftfinal.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;
import java.util.List;

@Repository
public interface IUsuarioRepository extends MongoRepository<UsuarioModel, String> {
    @Query("{'nombre':  '?0'}")
    List<UsuarioModel> findUserByName(String name);

    @Query("{'_id': '?0'}")
    List<UsuarioModel> findUserById(String _id);
}