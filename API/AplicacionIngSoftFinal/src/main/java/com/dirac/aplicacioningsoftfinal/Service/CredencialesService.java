package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.DTO.CambiarPasswordDTO;
import com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO;
import com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO.Perfil;
import com.dirac.aplicacioningsoftfinal.Exception.*;
import com.dirac.aplicacioningsoftfinal.Model.CredencialesModel;
import com.dirac.aplicacioningsoftfinal.Model.CredencialesModel.Credenciales;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel.Descargados;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel.DocsSubidos;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel.Historial;
import com.dirac.aplicacioningsoftfinal.Repository.ICredencialesRepository;
import com.dirac.aplicacioningsoftfinal.Repository.IUsuarioRepository;
import com.dirac.aplicacioningsoftfinal.Security.UsuarioAplicacion;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static com.dirac.aplicacioningsoftfinal.Model.CredencialesModel.*;
import static com.dirac.aplicacioningsoftfinal.Model.UsuarioModel.*;
import static com.dirac.aplicacioningsoftfinal.Security.PermisosDeUsuarioPorRol.*;
import static java.lang.String.*;

@Service
public class CredencialesService implements ICredencialesService {

    private final ICredencialesRepository credencialesRepository;
    private final IUsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final ImgurService imgurService;

    @Autowired
    public CredencialesService(ICredencialesRepository credencialesRepository, IUsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, ImgurService imgurService) {
        this.credencialesRepository = credencialesRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.imgurService = imgurService;
    }

    @Override
    public UsuarioAplicacion mapCredentialsFromDatabase(String username) throws NoRoleSpecifiedException {

        CredencialesModel credenciales = credencialesRepository.findCredencialesByUsername(username).
                orElseThrow(() -> new UsernameNotFoundException(format("El usuario \"%s\" no se encontró en la base de datos", username)));

        Set<SimpleGrantedAuthority> grantedAuthorities = getGrantedAuthorities(username, credenciales);

        return new UsuarioAplicacion(

                credenciales.getUsername(),
                credenciales.getPassword(),
                grantedAuthorities,
                credenciales.isAccountNonExpired(),
                credenciales.isAccountNonLocked(),
                credenciales.isCredentialsNonExpired(),
                credenciales.isEnabled()

        );
    }

    private static Set<SimpleGrantedAuthority> getGrantedAuthorities(String username, CredencialesModel credenciales) {

        String rolUsuario = credenciales.getRol();

        Set<SimpleGrantedAuthority> grantedAuthorities;

        if (rolUsuario.equals("USUARIO")) {

            grantedAuthorities = USUARIO.getGrantedAuthorities();

        }
        else if (rolUsuario.equals("ADMIN")) {

            grantedAuthorities = ADMIN.getGrantedAuthorities();

        }

        else {

            throw new NoRoleSpecifiedException(format("El usuario \"%s\" no tiene un rol específico en la base de datos", username));

        }

        return grantedAuthorities;

    }


    public NuevosCredencialesDTO mapCredencialesToObject(String credencialesEnString) throws JsonProcessingException{
       
        // función para convertir de un json string a un objeto NuevoCredencialesDTO
        ObjectMapper mapper = new ObjectMapper();
        NuevosCredencialesDTO credencialesDTO = mapper.readValue(credencialesEnString, NuevosCredencialesDTO.class);

        return credencialesDTO;
   
    }


    @Transactional
    public void crearNuevasCredenciales(String usuarioEntranteString) throws UserAlreadyExistsException, JsonProcessingException {

            // SE MAPEA A UN OBJETO DE LA CLASE NUEVOSCREDENCIALES DTO PARA QUE DESDE EL FRONTEND SE PUEDA 
            // ENVIAR UN JSON.STRING() Y NO DÉ PROBLEMAS (en caso de que se envíe una IMAGEN)
            NuevosCredencialesDTO usuarioEntrante = mapCredencialesToObject(usuarioEntranteString);
        
            String username = usuarioEntrante.getUsername();

            Optional<CredencialesModel> posibleUsuario = credencialesRepository.findCredencialesByUsername(username);

            if(posibleUsuario.isEmpty()) {

                String hashedPassword = passwordEncoder.encode(usuarioEntrante.getPassword());


                Credenciales credenciales = new Credenciales(
                        hashedPassword,
                        true
                );

                List<Credenciales> listaCredenciales = List.of(credenciales);

                CredencialesModel nuevoUsuario = new CredencialesModel(

                        null,
                        username,
                        hashedPassword,
                        "USUARIO",
                        true,
                        true,
                        true,
                        true,
                        usuarioEntrante.getPreguntaSeguridad(),
                        listaCredenciales

                );

                credencialesRepository.save(nuevoUsuario);

            }
            else {

                throw new UserAlreadyExistsException(format("El usuario \"%s\" ya se encuentra registrado en la aplicación!", username));

            }

    }

    @Transactional
    public NuevosCredencialesDTO crearNuevoUsuario(String usuarioEntranteString) throws UserAlreadyExistsException, JsonProcessingException{

        // SE MAPEA A UN OBJETO DE LA CLASE NUEVOSCREDENCIALES DTO PARA QUE DESDE EL FRONTEND SE PUEDA 
        // ENVIAR UN JSON.STRING() Y NO DÉ PROBLEMAS (en caso de que se envíe una IMAGEN)
        NuevosCredencialesDTO usuarioEntrante = mapCredencialesToObject(usuarioEntranteString);

        String username = usuarioEntrante.getUsername();

        Optional<UsuarioModel> posibleUsuario = usuarioRepository.findUsuarioByUsername(username);


        if(posibleUsuario.isEmpty()) {

            List<DocsSubidos> docsSubidos = List.of();
            List<Historial> historial = List.of();
            List<Descargados> descargados = List.of();


            UsuarioModel nuevoUsuario = new UsuarioModel(

                    null,
                    usuarioEntrante.getUsername(),
                    usuarioEntrante.getEmail(),
                    usuarioEntrante.getPerfil(),
                    false,
                    LocalDate.now(),
                    docsSubidos,
                    historial,
                    descargados

            );

            usuarioRepository.save(nuevoUsuario);
            return usuarioEntrante;
        }
        else {

            throw new UserAlreadyExistsException(format("El usuario \"%s\" ya se encuentra registrado en la aplicación!", username));

        }

    }


    @Transactional
    public NuevosCredencialesDTO crearNuevoUsuarioConImagen(String usuarioEntranteString, MultipartFile image) throws UserAlreadyExistsException, JsonProcessingException {

        // SE MAPEA A UN OBJETO DE LA CLASE NUEVOSCREDENCIALES DTO PARA QUE DESDE EL FRONTEND SE PUEDA 
        // ENVIAR UN JSON.STRING() Y NO DÉ PROBLEMAS (en caso de que se envíe una IMAGEN)
        NuevosCredencialesDTO usuarioEntrante = mapCredencialesToObject(usuarioEntranteString);

        String username = usuarioEntrante.getUsername();

        Optional<UsuarioModel> posibleUsuario = usuarioRepository.findUsuarioByUsername(username);


        if(posibleUsuario.isEmpty()) {

            List<DocsSubidos> docsSubidos = List.of();
            List<Historial> historial = List.of();
            List<Descargados> descargados = List.of();

            // ACTUALIZAR PERFIL
            String imagenUrl = imgurService.uploadImage(image);
            String nombre = usuarioEntrante.getPerfil().getNombre();
            String apellido = usuarioEntrante.getPerfil().getApellido();

            Perfil perfilActualizado = new Perfil(nombre, apellido, imagenUrl); // Creamos un nuevo obj perfil para poderlo setear más adelante.

            usuarioEntrante.setPerfil(perfilActualizado); // Se actualiza el perfil.
            // ---

            UsuarioModel nuevoUsuario = new UsuarioModel(

                    null,
                    usuarioEntrante.getUsername(),
                    usuarioEntrante.getEmail(),
                    usuarioEntrante.getPerfil(),
                    false,
                    LocalDate.now(),
                    docsSubidos,
                    historial,
                    descargados

            );

            usuarioRepository.save(nuevoUsuario);
            return usuarioEntrante;
        }
        else {

            throw new UserAlreadyExistsException(format("El usuario \"%s\" ya se encuentra registrado en la aplicación!", username));

        }

    }



    @Transactional
    public String cambiarPassword(CambiarPasswordDTO nuevosCredenciales) throws InvalidPasswordSettingsException,
                                                                              UsuarioNotFoundException,
                                                                              PasswordAlreadyUsedException,
                                                                              ActivePasswordNotFoundException {

        String passwordActual = nuevosCredenciales.getPasswordActual();
        String nuevoPassword = nuevosCredenciales.getPasswordNuevo();


        if (Strings.isNullOrEmpty(passwordActual) || Strings.isNullOrEmpty(nuevoPassword)) {

            throw new InvalidPasswordSettingsException("Los campos de contraseñas no pueden estar vacíos");

        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String username = auth.getName();

        CredencialesModel usuario = credencialesRepository.
                findCredencialesByUsername(username).
                orElseThrow(() -> new UsuarioNotFoundException(String.format("El usuario \"%s\" no se encuentra en la base de datos! Error fatal", username)));

        String passwordAlmacenado = usuario.getPassword();

        if(!passwordEncoder.matches(passwordActual, passwordAlmacenado)) {

            throw new InvalidPasswordSettingsException("La contraseña actual no coincide con la contraseña registrada");

        }

        List<Credenciales> credenciales = usuario.getCredenciales();

        for(Credenciales c : credenciales) {

            boolean coincidencia = passwordEncoder.matches(nuevoPassword, c.getPassword());

            if(coincidencia) {

                throw new PasswordAlreadyUsedException("La contraseña nueva ingresada ya ha sido usada anteriormente");

            }

        }

        Credenciales credencialActivo = credenciales
                .stream()
                .filter((credencial) -> credencial.isEstado())
                .findFirst()
                .orElseThrow(() -> new ActivePasswordNotFoundException(String.format("El usuario \"%s\" no tiene contraseñas activas en sus credenciales. Error fatal", username)));

        credencialActivo.setEstado(false);

        String newHashedPassword = passwordEncoder.encode(nuevoPassword);

        usuario.setPassword(newHashedPassword);

        Credenciales newCredentials = new Credenciales(

                newHashedPassword,
                true

        );

        credenciales.add(newCredentials);

        credencialesRepository.save(usuario);

        return "La contraseña fue cambiada satisfactoriamente!";

    }

}
