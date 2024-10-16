package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO;
import com.dirac.aplicacioningsoftfinal.Exception.UserAlreadyExistsException;
import com.dirac.aplicacioningsoftfinal.Service.ICredencialesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

}
