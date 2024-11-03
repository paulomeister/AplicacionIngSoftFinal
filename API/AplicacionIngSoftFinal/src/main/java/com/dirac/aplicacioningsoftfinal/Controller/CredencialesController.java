package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.DTO.CambiarPasswordDTO;
import com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO;
import com.dirac.aplicacioningsoftfinal.DTO.OlvidoPasswordDTO;
import com.dirac.aplicacioningsoftfinal.Exception.*;
import com.dirac.aplicacioningsoftfinal.Service.ICredencialesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> crearNuevosCredenciales(@RequestBody NuevosCredencialesDTO credencialesDTO) {

        try {

            credencialesService.crearNuevasCredenciales(credencialesDTO);

            credencialesService.crearNuevoUsuario(credencialesDTO);

            return ResponseEntity.ok().body(format("El usuario \"%s\" fue agregado con éxito a la base de datos", credencialesDTO.getUsername()));

        }
        catch(UserAlreadyExistsException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());

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

    @GetMapping("preguntaSeguridad/{username}")
    public ResponseEntity<?> obtenerPreguntaSeguridad(@PathVariable("username") String username) {

            try {

                String preguntaSeguridad = credencialesService.obtenerPreguntaSeguridad(username);
                return new ResponseEntity<String>(preguntaSeguridad, HttpStatus.OK);

            }
            catch(UsuarioNotFoundException e) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

            }

    }

    @PostMapping("recuperarPassword")
    public ResponseEntity<?> recuperarPassword(@RequestBody OlvidoPasswordDTO olvidoPasswordDTO) {

        try {

            String respuesta = credencialesService.olvidoPasswordRecuperar(olvidoPasswordDTO);

            return new ResponseEntity<String>(respuesta, HttpStatus.OK);

        }
        catch(UsuarioNotFoundException | InvalidPasswordSettingsException | PasswordAlreadyUsedException | InvalidSecretException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        }
        catch(ActivePasswordNotFoundException e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());

        }

    }

}
