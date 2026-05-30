package com.dh.DentalClinic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DentistDTO(
        Long id,

        @NotBlank(message = "El nombre es requerido")
        String name,

        @NotBlank(message = "El apellido es requerido")
        String lastName,

        @NotNull(message = "La matrícula es requerida")
        Integer registration
) {}
