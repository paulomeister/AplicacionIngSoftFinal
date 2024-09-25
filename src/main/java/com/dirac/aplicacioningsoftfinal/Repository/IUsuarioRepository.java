package com.dirac.aplicacioningsoftfinal.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;

import java.util.Optional;

@Repository
public interface IUsuarioRepository extends MongoRepository<UsuarioModel, String> {
    @Query("{'username':  '?0'}")
    Optional<UsuarioModel> findUserByName(String name);
}