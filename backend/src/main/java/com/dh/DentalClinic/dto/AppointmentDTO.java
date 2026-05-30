package com.dh.DentalClinic.dto;

import com.dh.DentalClinic.validation.ValidationGroups;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {

    private Long id;

    @NotNull
    private Long patientId;

    @NotNull
    private Long dentistId;

    @NotNull
    // Solo validar que la fecha sea futura/presente al CREAR; al editar se permite fecha pasada
    @FutureOrPresent(message = "La fecha del turno no puede ser en el pasado", groups = ValidationGroups.OnCreate.class)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @NotNull(message = "La hora del turno es requerida")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime time;
}
