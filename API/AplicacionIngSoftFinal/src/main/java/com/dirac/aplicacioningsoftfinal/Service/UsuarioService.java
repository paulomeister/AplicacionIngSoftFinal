package com.dirac.aplicacioningsoftfinal.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO.Perfil;
import com.dirac.aplicacioningsoftfinal.Exception.GetSomethingException;
import com.dirac.aplicacioningsoftfinal.Exception.UpdateException;
import com.dirac.aplicacioningsoftfinal.Model.CredencialesModel;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;
import com.dirac.aplicacioningsoftfinal.Repository.IUsuarioRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService implements IUsuarioService {

    @Autowired
    private IUsuarioRepository usuarioRepository;
    @Autowired
    private IDocumentoService documentoService;
    @Autowired
    private ICredencialesService credencialesService;
    @Autowired
    private ImgurService imgurService;

    @Override
    public Optional<UsuarioModel> getUserById(String id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public Optional<UsuarioModel> getUserByUsername(String username) {
        return usuarioRepository.findUserByUserName(username);
    }

    @Override
    public String insertUser(UsuarioModel usuario) {
        usuarioRepository.save(usuario);
        return "El usuario con _id: " + usuario.get_idAString() + "  sido guardado con éxito";
    }

    @Override
    public List<UsuarioModel> getAll() {
        return usuarioRepository.findAll();
    }

    @Override
    public String deleteUserWithCredentialsAndDocuments(String username) {

        UsuarioModel usuarioToDelete = getUserByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("ERROR FATAL, el usuario " + username + " no pudo ser encontrado"));

        // elimina todos los documentos subido
        usuarioToDelete.getDocSubidos().forEach(document -> documentoService.deleteDocument(document.getDocumentoId())); // elimina
                                                                                                                         // todos
                                                                                                                         // los
                                                                                                                         // documentos

        // eliminar credenciales:
        CredencialesModel credencialToDelete = credencialesService.getByUsername(usuarioToDelete.getUsername())
                .orElseThrow(() -> new GetSomethingException(
                        "ERROR FATAL, las credenciales del usuario: " + username + " no fueron encontradas"));

        credencialesService.eliminarCredenciales(credencialToDelete.returnIdAsString()); // elimina credencial

        // eliminar usuario
        usuarioRepository.delete(usuarioToDelete);

        return "el usuario " + username + " fue eliminado correctamente!";
    }

    @Override
    public String updateUserEmail(String username, String newEmail) {

        // Expresión regular para validar el email
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";

        // Validar el formato del email
        if (!newEmail.matches(emailRegex)) {
            throw new GetSomethingException("El formato del email no es válido.");
        }

        // Verificar si el nuevo email ya existe
        Optional<UsuarioModel> userWithNewEmail = usuarioRepository.findByEmail(newEmail);
        if (userWithNewEmail.isPresent()) {
            throw new UpdateException("El nuevo correo ya existe en DOCTic");
        } else {
            // Buscar el usuario por nombre de usuario
            UsuarioModel usuario = usuarioRepository.findUsuarioByUsername(username)
                    .orElseThrow(() -> new GetSomethingException("No se pudo encontrar el usuario " + username));

            // Actualizar el email
            usuario.setEmail(newEmail);
            usuarioRepository.save(usuario); // Guarda el cambio
        }

        return "El email ha sido actualizado correctamente.";
    }

    @Override
    public String updateUsername(String username, String newUsername) {

        Optional<UsuarioModel> usuarioWithNewUsername = usuarioRepository.findUsuarioByUsername(newUsername); // verifica
                                                                                                              // si
        // alguien con
        // ese correo existe
        if (usuarioWithNewUsername.isPresent())
            throw new UpdateException("ERROR: El nuevo nombre de usuario ya existe en DOCTic");
        else {

            UsuarioModel usuario = usuarioRepository.findUsuarioByUsername(username)
                    .orElseThrow(() -> new GetSomethingException("No se pudo encontrar el usuario " + username));

            usuario.setUsername(newUsername);

            CredencialesModel credencialDelusuario = credencialesService.getByUsername(username)
                    .orElseThrow(() -> new GetSomethingException(
                            "ERROR FATAL, no se pudieron encontrar las credenciales del usuario."));

            credencialDelusuario.setUsername(newUsername);

            credencialesService.saveCredenciales(credencialDelusuario);

            usuarioRepository.save(usuario); // actualiza el email

        }

        return "El nombre de usuario ha sido actualizado correctamente.";

    }

    @Override
    public String updateProfile(String username, Perfil newProfile) {

        UsuarioModel updatingUsuario = usuarioRepository.findUsuarioByUsername(username)
                .orElseThrow(() -> new GetSomethingException("No se pudo encontrar al usuario: " + username));

        updatingUsuario.setPerfil(newProfile); // conmutamos el perfil

        usuarioRepository.save(updatingUsuario); // actualizamos

        return "El perfil del usuario : " + username + " ha sido actualizado con éxito.";

    }

    @Override
    public String updateProfilePicture(String username, MultipartFile image) {

        UsuarioModel usuario = getUserByUsername(username)
                .orElseThrow(() -> new GetSomethingException("No se pudo encontrar al usuario: " + username));

        // obtenemos el Perfil que vamos a actualizar
        Perfil perfil = usuario.getPerfil();
        String message = imgurService.uploadImage(image); // subimos la imagen

        perfil.setFotoPerfil(message); // actualizamos el perfil
        usuario.setPerfil(perfil); // actualizamos el usuario

        usuarioRepository.save(usuario); // actualizamos en la base de datos.

        return "La foto de perfil de " + username + " fue actualizada correctamente";

    }

}
