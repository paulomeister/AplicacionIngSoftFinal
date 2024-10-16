package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.DTO.NuevosCredencialesDTO;
import com.dirac.aplicacioningsoftfinal.Exception.NoRoleSpecifiedException;
import com.dirac.aplicacioningsoftfinal.Exception.UserAlreadyExistsException;
import com.dirac.aplicacioningsoftfinal.Model.CredencialesModel;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;
import com.dirac.aplicacioningsoftfinal.Repository.ICredencialesRepository;
import com.dirac.aplicacioningsoftfinal.Repository.IUsuarioRepository;
import com.dirac.aplicacioningsoftfinal.Security.UsuarioAplicacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    public CredencialesService(ICredencialesRepository credencialesRepository, IUsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.credencialesRepository = credencialesRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
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

    @Transactional
    public void crearNuevasCredenciales(NuevosCredencialesDTO usuarioEntrante) throws UserAlreadyExistsException {

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
    public void crearNuevoUsuario(NuevosCredencialesDTO usuarioEntrante) throws UserAlreadyExistsException {

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

        }
        else {

            throw new UserAlreadyExistsException(format("El usuario \"%s\" ya se encuentra registrado en la aplicación!", username));

        }

    }


}
