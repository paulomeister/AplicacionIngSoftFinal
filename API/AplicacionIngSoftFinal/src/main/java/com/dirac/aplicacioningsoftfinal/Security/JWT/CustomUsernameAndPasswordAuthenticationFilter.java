package com.dirac.aplicacioningsoftfinal.Security.JWT;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Date;

public class CustomUsernameAndPasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {


    private final AuthenticationManager authenticationManager;
    private final JwtConfigurationVariables jwtConfigurationVariables;
    private final SecretKey secretKey;

    public CustomUsernameAndPasswordAuthenticationFilter(AuthenticationManager authenticationManager,
                                                         JwtConfigurationVariables jwtConfigurationVariables,
                                                         SecretKey secretKey) {
        this.authenticationManager = authenticationManager;
        this.jwtConfigurationVariables = jwtConfigurationVariables;
        this.secretKey = secretKey;
    }


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        try {
            UsernameAndPasswordAuthRequest authenticationRequest = new ObjectMapper()
                    .readValue(request.getInputStream(), UsernameAndPasswordAuthRequest.class);

            Authentication authentication = new UsernamePasswordAuthenticationToken(

                    authenticationRequest.getUsername(),
                    authenticationRequest.getPassword()

            );
            Authentication authenticate = authenticationManager.authenticate(authentication);
            response.addHeader("Access-Control-Allow-Methods", "POST");
            response.addHeader("Access-Control-Allow-Origin", "*");

            return authenticate;

        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }



    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain filterChain,
                                            Authentication authResult) {

        String token = Jwts.builder()
                .subject(authResult.getName())
                .claim("authorities", authResult.getAuthorities())
                .issuedAt(new Date())
                .expiration(java.sql.Date.valueOf(LocalDate.now().plusDays(jwtConfigurationVariables.getTokenExpirationAfterDays())))
                .signWith(secretKey)
                .compact();

        response.addHeader(jwtConfigurationVariables.getAuthorizationHeader(), jwtConfigurationVariables.getTokenPrefix() + token);
        response.addHeader("Access-Control-Allow-Methods", "POST");
        response.addHeader("Access-Control-Allow-Origin", "*");

    }


}
