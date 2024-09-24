package com.dirac.aplicacioningsoftfinal.auth_testing;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import static com.dirac.aplicacioningsoftfinal.auth_testing.TiposDeUsuarios.ADMIN;
import static com.dirac.aplicacioningsoftfinal.auth_testing.TiposDeUsuarios.GENUSER;
import static org.springframework.security.config.Customizer.*;

@EnableWebSecurity
@Configuration
public class SecurityConfiguration {

    // UNSAFE | For testing purposes only. TODO: implement our custom authentication service.

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public SecurityConfiguration(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf((csrf) -> csrf.disable())
                .authorizeHttpRequests((auth) -> auth

                        .requestMatchers("/api/Documentos/*/*/download")
                        .hasAnyRole(ADMIN.name(), GENUSER.name())
                        .anyRequest()
                        .permitAll()

                )
                .httpBasic(withDefaults());

        return http.build();

    }


    @Bean
    public UserDetailsService userDetailsService() {

        UserDetails jemasso = User.builder()
                .username("jemasso")
                .password(passwordEncoder.encode("jhonmasso123"))
                .roles(GENUSER.name())
                .build();

        UserDetails beccaria = User.builder()
                .username("cbeccaria")
                .password(passwordEncoder.encode("plegalità"))
                .roles(ADMIN.name())
                .build();

        UserDetails paul = User.builder()
                .username("jpaul")
                .password(passwordEncoder.encode("password123"))
                .roles(ADMIN.name())
                .build();

        return new InMemoryUserDetailsManager(
                jemasso,
                beccaria,
                paul
        );

    }



}
