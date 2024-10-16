package com.dirac.aplicacioningsoftfinal.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;

import java.util.Optional;

@Repository
public interface IUsuarioRepository extends MongoRepository<UsuarioModel, String> {
    @Query("{'username':  '?0'}")
    Optional<UsuarioModel> findUserByUserName(String userName);

    // Abierto a extensión para no modificar la codebase existente. Búsqueda case-insensitive.
    @Query("{'username': {$regex: ?0, $options:  'i'}}")
    Optional<UsuarioModel> findUsuarioByUsername(String username);

}