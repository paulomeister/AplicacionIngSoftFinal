package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO.Perfil;
import com.dirac.aplicacioningsoftfinal.DTO.Res;
import com.dirac.aplicacioningsoftfinal.Exception.GetSomethingException;
import com.dirac.aplicacioningsoftfinal.Exception.UpdateException;
import com.dirac.aplicacioningsoftfinal.Exception.UsuarioNotFoundException;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;

import com.dirac.aplicacioningsoftfinal.Service.IUsuarioService;
import com.dirac.aplicacioningsoftfinal.Service.ImgurService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/Usuarios")
public class UsuarioController {

    @Autowired
    private IUsuarioService usuarioService;

    private ImgurService imgurService = new ImgurService();

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") String id) {
        UsuarioModel usuario = usuarioService.getUserById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Este ID de Usuario no existe"));

        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/getByUsername/{username}")
    public ResponseEntity<?> getUserByUserName(@PathVariable("username") String username) {
        UsuarioModel usuario = usuarioService.getUserByUsername(username)
                .orElseThrow(() -> new UsuarioNotFoundException("Este Usuario no existe"));

        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/getAllUsers")
    ResponseEntity<?> getAllUsers() {
        return ResponseEntity.status(200).body(usuarioService.getAll());
    }

    @PostMapping("/uploadProfilePic")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile image) {
        try {
            String imageUrl = imgurService.uploadImage(image);
            return ResponseEntity.ok().body(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // Actualizar el email del usuario
    @PutMapping("updateEmail/{username}/{newEmail}")
    public ResponseEntity<String> updateUserEmail(@PathVariable String username, @PathVariable String newEmail) {
        try {
            String response = usuarioService.updateUserEmail(username, newEmail);
            return ResponseEntity.ok(response);
        } catch (UpdateException | GetSomethingException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    // Actualizar el nombre de usuario
    @PutMapping("updateUsername/{username}/{newUsername}")
    public ResponseEntity<String> updateUsername(@PathVariable String username, @PathVariable String newUsername) {
        try {
            String response = usuarioService.updateUsername(username, newUsername);
            return ResponseEntity.ok(response);
        } catch (UpdateException | GetSomethingException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Actualizar el nombre y / o apellido del usuario 
    //! NO PUEDE ENVIARSE EL PERFIL VACÍO, DESDE EL FRONTEND ENVIAR EL PERFIL (Con los campos cambiados y sin cambiar)
    @PutMapping("/updateProfile/{username}")
    public ResponseEntity<String> updateProfile(@PathVariable String username, @RequestBody Perfil newProfile) {
        try {
            String response = usuarioService.updateProfile(username, newProfile);
            return ResponseEntity.ok(response);
        } catch (GetSomethingException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{username}/updateProfilePicture")
    public ResponseEntity<String> updateProfilePicture(@RequestParam("image") MultipartFile image, @PathVariable("username") String username) {
        try {
            String response = usuarioService.updateProfilePicture(username, image);
            return ResponseEntity.ok(response);
        } catch (GetSomethingException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @DeleteMapping("/deleteUser/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable("username") String username) {

        Res res = new Res();

        try {
            res.setMessage(usuarioService.deleteUserWithCredentialsAndDocuments(username));
            res.setStatus(200);
        } catch (Exception e) {
            res.setMessage(e.getMessage());
            res.setStatus(500);
        }

        return ResponseEntity.status(res.getStatus()).body(res);

    }

}
