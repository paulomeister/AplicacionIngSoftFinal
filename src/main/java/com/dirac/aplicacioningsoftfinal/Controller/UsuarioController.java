package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.Exception.UsuarioNotFoundException;
import com.dirac.aplicacioningsoftfinal.Service.IUsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private IUsuarioService usuarioService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable ("id") String id) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(usuarioService.getUserById(id).orElseThrow(() -> new UsuarioNotFoundException("Este ID de Usuario no existe")));
    }

    @GetMapping("/getUserByName/{name}")
    public ResponseEntity<?> getUserByName(@PathVariable ("name") String name) {
        return ResponseEntity.ok(usuarioService.getUserByName(name));
    }
}
