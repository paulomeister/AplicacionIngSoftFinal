package com.dirac.aplicacioningsoftfinal.Security.JWT;

import com.google.common.base.Strings;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class JwtTokenVerifier extends OncePerRequestFilter {

    private final SecretKey secretKey;
    private final JwtConfigurationVariables jwtConfigurationVariables;

    public JwtTokenVerifier(SecretKey secretKey, JwtConfigurationVariables jwtConfigurationVariables) {
        this.secretKey = secretKey;
        this.jwtConfigurationVariables = jwtConfigurationVariables;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authorizationHeader = request.getHeader(jwtConfigurationVariables.getAuthorizationHeader());

        if (Strings.isNullOrEmpty(authorizationHeader) || !authorizationHeader.startsWith(jwtConfigurationVariables.getTokenPrefix())) {

            filterChain.doFilter(request, response);

        }

        String token = authorizationHeader.replace(jwtConfigurationVariables.getTokenPrefix(), "");

        try {



            Jws<Claims> claimsJws = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);

            Claims body = claimsJws.getPayload();

            String username = body.getSubject();

            var authorities = (List<Map<String,String>>) body.get("authorities");

            Set<SimpleGrantedAuthority> simpleGrantedAuthorities = authorities.stream()
                    .map((element) -> new SimpleGrantedAuthority(element.get("authority")))
                    .collect(Collectors.toSet());

            Authentication authentication = new UsernamePasswordAuthenticationToken(

                    username,
                    null,
                    simpleGrantedAuthorities

            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

        }
        catch(JwtException e) {

            throw new IllegalStateException(String.format("Token \"%s\" no es confiable!", token));

        }

        filterChain.doFilter(request, response);


    }
}
