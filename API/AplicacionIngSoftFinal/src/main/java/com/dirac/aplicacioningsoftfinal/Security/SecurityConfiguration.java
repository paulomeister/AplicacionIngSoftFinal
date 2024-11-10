package com.dirac.aplicacioningsoftfinal.Security;

import com.dirac.aplicacioningsoftfinal.Security.JWT.CustomUsernameAndPasswordAuthenticationFilter;
import com.dirac.aplicacioningsoftfinal.Security.JWT.JwtConfigurationVariables;
import com.dirac.aplicacioningsoftfinal.Security.JWT.JwtTokenVerifier;
import com.dirac.aplicacioningsoftfinal.Service.RecuperadorUsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;

import java.util.Arrays;

import static com.dirac.aplicacioningsoftfinal.Security.PermisosDeUsuarioPorRol.ADMIN;
import static com.dirac.aplicacioningsoftfinal.Security.PermisosDeUsuarioPorRol.USUARIO;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final PasswordEncoder passwordEncoder;
    private final RecuperadorUsuariosService recuperadorUsuariosService;
    private final SecretKey secretKey;
    private final JwtConfigurationVariables jwtConfigurationVariables;

    @Autowired
    public SecurityConfiguration(PasswordEncoder passwordEncoder, RecuperadorUsuariosService recuperadorUsuariosService, SecretKey secretKey, JwtConfigurationVariables jwtConfigurationVariables) {
        this.passwordEncoder = passwordEncoder;
        this.recuperadorUsuariosService = recuperadorUsuariosService;
        this.secretKey = secretKey;
        this.jwtConfigurationVariables = jwtConfigurationVariables;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {

        
        http
                .csrf((csrf) -> csrf.disable())
                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilter(new CustomUsernameAndPasswordAuthenticationFilter(authenticationManager, jwtConfigurationVariables, secretKey))
                .addFilterAfter(new JwtTokenVerifier(secretKey, jwtConfigurationVariables), CustomUsernameAndPasswordAuthenticationFilter.class)
                .authorizeHttpRequests((authz) -> authz

                        .requestMatchers(HttpMethod.POST,"/api/Documentos/downloadFile")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .requestMatchers(HttpMethod.PUT, "/preguntaSeguridad/change/*")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .requestMatchers(HttpMethod.POST, "/password/change")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .requestMatchers(HttpMethod.PUT, "/api/Documentos/updateDoc")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .requestMatchers(HttpMethod.PUT, "/api/Documentos/updateDocWithFile")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .requestMatchers(HttpMethod.POST, "/api/Documentos/insert")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .requestMatchers(HttpMethod.DELETE, "/api/Documentos/delete/*")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .requestMatchers(HttpMethod.POST, "/api/Documentos/uploadToDrive")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .requestMatchers(HttpMethod.PUT, "/api/Usuarios/updateEmail/*/*")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .requestMatchers(HttpMethod.PUT, "/api/Usuarios/updateUsername/*/*")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .requestMatchers(HttpMethod.PUT, "/api/Usuarios/updateProfile/*")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .requestMatchers(HttpMethod.PUT, "/api/Usuarios/updateProfile/*")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .requestMatchers(HttpMethod.PUT, "/api/Usuarios/*/updateProfilePicture")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .requestMatchers(HttpMethod.DELETE, "/api/Usuarios/deleteUser/*")
                        .hasAnyRole(USUARIO.name(), ADMIN.name())

                        .anyRequest()
                        .permitAll()
                );

        return http.build();

    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        authenticationManagerBuilder
                .userDetailsService(recuperadorUsuariosService)
                .passwordEncoder(passwordEncoder);

        return authenticationManagerBuilder.build();
    }

    @Bean
    UrlBasedCorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET","POST"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;

    }

}
