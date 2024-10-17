package com.dirac.aplicacioningsoftfinal.Security.JWT;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class UsernameAndPasswordAuthRequest {

    private String username;
    private String password;

}
