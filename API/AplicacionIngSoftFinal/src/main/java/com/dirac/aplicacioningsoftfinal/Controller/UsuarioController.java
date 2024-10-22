package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.Exception.UsuarioNotFoundException;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;
import com.dirac.aplicacioningsoftfinal.Service.IUsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/Usuarios")
public class UsuarioController {

    @Autowired
    private IUsuarioService usuarioService;

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

}
