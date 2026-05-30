package com.dh.DentalClinic.repository;

import com.dh.DentalClinic.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;

@Repository
public interface IAppointmentRepository extends JpaRepository<Appointment, Long> {

    // Para crear: verifica si ya existe turno con ese odontólogo/fecha/hora
    boolean existsByDentist_IdAndDateAndTime(Long dentistId, LocalDate date, LocalTime time);

    // Para editar: misma verificación excluyendo el turno actual
    boolean existsByDentist_IdAndDateAndTimeAndIdNot(Long dentistId, LocalDate date, LocalTime time, Long excludeId);

    // Borrado en cascada al eliminar un odontólogo o un paciente
    void deleteAllByDentist_Id(Long dentistId);
    void deleteAllByPatient_Id(Long patientId);
}
