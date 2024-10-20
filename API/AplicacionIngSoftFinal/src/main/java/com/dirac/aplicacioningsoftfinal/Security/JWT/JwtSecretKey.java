package com.dirac.aplicacioningsoftfinal.Security.JWT;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;

@Configuration
public class JwtSecretKey {

    private final JwtConfigurationVariables jwtConfigurationVariables;

    @Autowired
    public JwtSecretKey(JwtConfigurationVariables jwtConfigurationVariables) {
        this.jwtConfigurationVariables = jwtConfigurationVariables;
    }

    @Bean
    public SecretKey secretKey() {

        return Keys.hmacShaKeyFor(jwtConfigurationVariables.getSecretKey().getBytes());

    }

}
