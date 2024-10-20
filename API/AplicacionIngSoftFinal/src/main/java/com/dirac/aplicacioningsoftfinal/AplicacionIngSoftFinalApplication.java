package com.dirac.aplicacioningsoftfinal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class AplicacionIngSoftFinalApplication {

    public static void main(String[] args) {
        SpringApplication.run(AplicacionIngSoftFinalApplication.class, args);
    }

}
