package com.dirac.aplicacioningsoftfinal.Security.JWT;

import com.google.common.net.HttpHeaders;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;


@ConfigurationProperties(prefix = "application.jwt")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class JwtConfigurationVariables {

    private String secretKey;
    private String tokenPrefix;
    private Integer tokenExpirationAfterDays;

    public String getAuthorizationHeader() {

        return HttpHeaders.AUTHORIZATION;

    }


}
