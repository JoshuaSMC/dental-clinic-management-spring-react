package com.dh.DentalClinic.controller;

import com.dh.DentalClinic.dto.AppointmentDTO;
import com.dh.DentalClinic.dto.DentistDTO;
import com.dh.DentalClinic.dto.PatientDTO;
import com.dh.DentalClinic.repository.IAppointmentRepository;
import com.dh.DentalClinic.repository.IDentistRepository;
import com.dh.DentalClinic.repository.IPatientRepository;
import com.dh.DentalClinic.service.IAppointmentService;
import com.dh.DentalClinic.service.IDentistService;
import com.dh.DentalClinic.service.IPatientService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class AppointmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IDentistService dentistService;
    @Autowired
    private IPatientService patientService;
    @Autowired
    private IAppointmentService appointmentService;
    @Autowired
    private IAppointmentRepository appointmentRepository;
    @Autowired
    private IDentistRepository dentistRepository;
    @Autowired
    private IPatientRepository patientRepository;

    private static final AtomicInteger registrationCounter = new AtomicInteger(40000);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;

    private Long patientId;
    private Long dentistId;

    @BeforeEach
    void setUp() {
        dentistId = dentistService.save(
                new DentistDTO(null, "Dr. Test", "Controller", registrationCounter.getAndIncrement())).id();
        patientId = patientService.save(
                new PatientDTO(null, "Test", "Controller", null, null, null, null)).id();
    }

    @AfterEach
    void tearDown() {
        appointmentRepository.deleteAll(
                appointmentRepository.findAll().stream()
                        .filter(a -> a.getDentist().getId().equals(dentistId)
                                || a.getPatient().getId().equals(patientId))
                        .toList()
        );
        dentistRepository.findById(dentistId).ifPresent(dentistRepository::delete);
        patientRepository.findById(patientId).ifPresent(patientRepository::delete);
    }

    @Test
    void testSaveAppointment() throws Exception {
        String date = LocalDate.now().plusDays(30).format(DATE_FMT);
        String appointmentJson = String.format(
                "{\"patientId\": %d, \"dentistId\": %d, \"date\": \"%s\", \"time\": \"10:00\"}",
                patientId, dentistId, date);

        mockMvc.perform(post("/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(appointmentJson)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.patientId").value(patientId))
                .andExpect(jsonPath("$.dentistId").value(dentistId))
                .andExpect(jsonPath("$.date").value(date));
    }

    @Test
    void testSaveAppointment_pacienteInexistente() throws Exception {
        String date = LocalDate.now().plusDays(31).format(DATE_FMT);
        String appointmentJson = String.format(
                "{\"patientId\": 999999, \"dentistId\": %d, \"date\": \"%s\", \"time\": \"10:00\"}",
                dentistId, date);

        mockMvc.perform(post("/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(appointmentJson)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetAllAppointments() throws Exception {
        mockMvc.perform(get("/appointments")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void testGetAppointmentById() throws Exception {
        AppointmentDTO dto = new AppointmentDTO(null, patientId, dentistId,
                LocalDate.now().plusDays(32), LocalTime.of(9, 0));
        AppointmentDTO saved = appointmentService.save(dto);

        mockMvc.perform(get("/appointments/" + saved.getId())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.patientId").value(patientId))
                .andExpect(jsonPath("$.dentistId").value(dentistId));
    }

    @Test
    void testUpdateAppointment() throws Exception {
        AppointmentDTO dto = new AppointmentDTO(null, patientId, dentistId,
                LocalDate.now().plusDays(33), LocalTime.of(9, 0));
        AppointmentDTO saved = appointmentService.save(dto);

        String newDate = LocalDate.now().plusDays(60).format(DATE_FMT);
        String updateJson = String.format(
                "{\"id\": %d, \"patientId\": %d, \"dentistId\": %d, \"date\": \"%s\", \"time\": \"10:00\"}",
                saved.getId(), patientId, dentistId, newDate);

        mockMvc.perform(put("/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.date").value(newDate));
    }

    @Test
    void testDeleteAppointment() throws Exception {
        AppointmentDTO dto = new AppointmentDTO(null, patientId, dentistId,
                LocalDate.now().plusDays(34), LocalTime.of(9, 0));
        AppointmentDTO saved = appointmentService.save(dto);

        mockMvc.perform(delete("/appointments/" + saved.getId()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/appointments/" + saved.getId())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
