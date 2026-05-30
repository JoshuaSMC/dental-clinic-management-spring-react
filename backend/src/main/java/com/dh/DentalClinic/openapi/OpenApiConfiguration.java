package com.dh.DentalClinic.openapi;

import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;


@OpenAPIDefinition(
        info= @Info(
                title="Dental Clinic API",
                version="1.0",
                description="API para gestionar la clínica dental"
        ),
        security={
                @SecurityRequirement(name="jwt")
        }
)
@SecurityScheme(
        name="jwt",
        description="JWT Authentication",
        type= SecuritySchemeType.HTTP,
        scheme="bearer",
        bearerFormat="JWT",
        in = SecuritySchemeIn.HEADER
)
@Configuration
public class OpenApiConfiguration {

}
