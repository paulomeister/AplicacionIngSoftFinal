package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.DTO.CambiarPasswordDTO;
import com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO;
import com.dirac.aplicacioningsoftfinal.DTO.OlvidoPasswordDTO;
import com.dirac.aplicacioningsoftfinal.DTO.Res;
import com.dirac.aplicacioningsoftfinal.Exception.*;
import com.dirac.aplicacioningsoftfinal.Model.CredencialesModel.PreguntaSeguridad;
import com.dirac.aplicacioningsoftfinal.Service.ICredencialesService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


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
            res.setMessage(
                    "El usuario " + credencialesDTO.getUsername() + " fue agregado con éxito a la base de datos");
            res.setStatus(200);

            return ResponseEntity.ok().body(res);

        } catch (UserAlreadyExistsException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).body("ERROR: " + e.getMessage());
        }

    }

    @PostMapping("registrarseConImagen")
    public ResponseEntity<?> crearNuevosCredenciales(@RequestParam("credentials") String credencialesString,
            @RequestParam("image") MultipartFile imagen) {

        try {
            credencialesService.crearNuevasCredenciales(credencialesString);
            NuevosCredencialesDTO credencialesDTO = credencialesService.crearNuevoUsuarioConImagen(credencialesString,
                    imagen);

            return ResponseEntity.ok().body(String.format("El usuario %s fue agregado con éxito a la base de datos",
                    credencialesDTO.getUsername()));

        } catch (UserAlreadyExistsException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(500).body("ERROR: " + e.getMessage());
        }

    }

    // recibe un body con la nuevaPregunta y se le pone en la ruta, el username correspondiente;
    @PutMapping("preguntaSeguridad/change/{username}")
    public ResponseEntity<?> cambiarPreguntaDeSeguridad(@RequestBody PreguntaSeguridad nuevaPreguntaSeguridad,
            @PathVariable("userId") String username) {

        Res res = new Res();

        try {

            res.setMessage(credencialesService.cambiarPreguntaDeSeguridad(username, nuevaPreguntaSeguridad));
            res.setStatus(200);

        } catch (Exception e) {

            res.setMessage(e.getMessage());
            res.setStatus(500);

        }

        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @PostMapping("password/change")
    public ResponseEntity<?> cambiarPassword(@RequestBody CambiarPasswordDTO cambiarPasswordDTO) {

        try {

            String respuesta = credencialesService.cambiarPassword(cambiarPasswordDTO);
            return new ResponseEntity<String>(respuesta, HttpStatus.OK);

        } catch (InvalidPasswordSettingsException | PasswordAlreadyUsedException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        } catch (UsuarioNotFoundException | ActivePasswordNotFoundException e) {

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
