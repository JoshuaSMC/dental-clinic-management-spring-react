package com.dh.DentalClinic.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record PatientDTO(
        Long id,

        @NotBlank(message = "El nombre es requerido")
        String name,

        @NotBlank(message = "El apellido es requerido")
        String lastName,

        @NotBlank(message = "El email es requerido")
        @Email(message = "El email no es válido")
        String email,

        Long cardIdentity,

        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate admissionDate,

        AddressDTO address
) {}
