package com.dirac.aplicacioningsoftfinal.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO.Perfil;
import com.dirac.aplicacioningsoftfinal.Model.CredencialesModel;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;

public interface IUsuarioService {

    Optional<UsuarioModel> getUserById(String id);

    Optional<UsuarioModel> getUserByUsername(String username);

    String insertUser(UsuarioModel usuario);

    List<UsuarioModel> getAll();

    String updateUserEmail(String username, String newEmail);

    String updateUsername(String username, String newUsername);

    String updateProfile(String username, Perfil newProfile);

    String updateProfilePicture(String username, MultipartFile image);

    String deleteUserWithCredentialsAndDocuments(String username);

}
