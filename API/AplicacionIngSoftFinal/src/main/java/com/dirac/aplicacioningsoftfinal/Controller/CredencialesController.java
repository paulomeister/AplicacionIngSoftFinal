package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.DTO.CambiarPasswordDTO;
import com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO;
import com.dirac.aplicacioningsoftfinal.DTO.Res;
import com.dirac.aplicacioningsoftfinal.Exception.*;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import com.dirac.aplicacioningsoftfinal.Model.CredencialesModel.Credenciales;
import com.dirac.aplicacioningsoftfinal.Service.ICredencialesService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.io.JsonEOFException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static java.lang.String.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/")
public class CredencialesController {

    private final ICredencialesService credencialesService;

    @Autowired
    public CredencialesController(ICredencialesService credencialesService) {
        this.credencialesService = credencialesService;
    }

    @PostMapping("registrarse")
    public ResponseEntity<?> crearNuevosCredenciales(@RequestParam("credentials") String credencialesString) {

        try {

            credencialesService.crearNuevasCredenciales(credencialesString);
            NuevosCredencialesDTO credencialesDTO = credencialesService.crearNuevoUsuario(credencialesString);

            
            Res res = new Res();
            res.setMessage("El usuario "+ credencialesDTO.getUsername() +" fue agregado con éxito a la base de datos");
            res.setStatus(200);
            
            return ResponseEntity.ok().body(res);

        }
        catch(UserAlreadyExistsException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());

        }
        catch(Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).body("ERROR: " + e.getMessage());
        }

    }

    @PostMapping("registrarseConImagen")
    public ResponseEntity<?> crearNuevosCredenciales(@RequestParam("credentials") String credencialesString, @RequestParam("image") MultipartFile imagen ) {

        try {
            credencialesService.crearNuevasCredenciales(credencialesString);
            NuevosCredencialesDTO credencialesDTO = credencialesService.crearNuevoUsuarioConImagen(credencialesString, imagen);


            return ResponseEntity.ok().body(String.format("El usuario %s fue agregado con éxito a la base de datos", credencialesDTO.getUsername()));

        }
        catch(UserAlreadyExistsException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());

        }
        catch(Exception e){
            return ResponseEntity.status(500).body("ERROR: " + e.getMessage());
        }

    }



    @PostMapping("password/change")
    @PreAuthorize("hasAnyRole('ROLE_USUARIO', 'ROL_ADMIN')")
    public ResponseEntity<?> cambiarPassword(@RequestBody CambiarPasswordDTO cambiarPasswordDTO) {

        try {

            String respuesta = credencialesService.cambiarPassword(cambiarPasswordDTO);
            return new ResponseEntity<String>(respuesta, HttpStatus.OK);

        }
        catch(InvalidPasswordSettingsException | PasswordAlreadyUsedException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        }
        catch(UsuarioNotFoundException | ActivePasswordNotFoundException e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());

        }


    }



}
