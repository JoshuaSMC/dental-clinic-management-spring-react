package com.dh.DentalClinic.service;

import com.dh.DentalClinic.dto.AppointmentDTO;
import com.dh.DentalClinic.dto.DentistDTO;
import com.dh.DentalClinic.dto.PatientDTO;
import com.dh.DentalClinic.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AppointmentServiceTest {

    @Autowired
    private IAppointmentService appointmentService;
    @Autowired
    private IDentistService dentistService;
    @Autowired
    private IPatientService patientService;

    private static final AtomicInteger registrationCounter = new AtomicInteger(50000);

    private Long patientId;
    private Long dentistId;

    @BeforeEach
    void setUp() {
        dentistId = dentistService.save(
                new DentistDTO(null, "Dr. Test", "Dentist", registrationCounter.getAndIncrement())).id();
        patientId = patientService.save(
                new PatientDTO(null, "Test", "Patient", null, null, null, null)).id();
    }

    @Test
    void save() {
        LocalDate date = LocalDate.now().plusDays(30);
        AppointmentDTO dto = new AppointmentDTO(null, patientId, dentistId, date, LocalTime.of(10, 0));

        AppointmentDTO saved = appointmentService.save(dto);

        assertNotNull(saved.getId());
        assertEquals(patientId, saved.getPatientId());
        assertEquals(dentistId, saved.getDentistId());
        assertEquals(date, saved.getDate());
    }

    @Test
    void save_throwsOnDuplicateDentistDateTime() {
        LocalDate date = LocalDate.now().plusDays(31);
        LocalTime time = LocalTime.of(11, 0);
        appointmentService.save(new AppointmentDTO(null, patientId, dentistId, date, time));

        assertThrows(IllegalArgumentException.class, () ->
                appointmentService.save(new AppointmentDTO(null, patientId, dentistId, date, time)));
    }

    @Test
    void findById() {
        LocalDate date = LocalDate.now().plusDays(32);
        AppointmentDTO saved = appointmentService.save(
                new AppointmentDTO(null, patientId, dentistId, date, LocalTime.of(10, 0)));

        AppointmentDTO found = appointmentService.findById(saved.getId());

        assertNotNull(found);
        assertEquals(saved.getId(), found.getId());
    }

    @Test
    void findById_throwsWhenNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> appointmentService.findById(999999L));
    }

    @Test
    void delete() {
        LocalDate date = LocalDate.now().plusDays(33);
        AppointmentDTO saved = appointmentService.save(
                new AppointmentDTO(null, patientId, dentistId, date, LocalTime.of(10, 0)));

        appointmentService.delete(saved.getId());

        assertThrows(ResourceNotFoundException.class, () -> appointmentService.findById(saved.getId()));
    }

    @Test
    void delete_throwsWhenNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> appointmentService.delete(999999L));
    }

    @Test
    void findAll() {
        LocalDate date = LocalDate.now().plusDays(34);
        appointmentService.save(new AppointmentDTO(null, patientId, dentistId, date, LocalTime.of(10, 0)));

        assertFalse(appointmentService.findAll().isEmpty());
    }
}
