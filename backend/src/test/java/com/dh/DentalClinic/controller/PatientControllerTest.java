package com.dh.DentalClinic.controller;

import com.dh.DentalClinic.dto.PatientDTO;
import com.dh.DentalClinic.service.IPatientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class PatientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IPatientService patientService;

    @Test
    void testSavePatient() throws Exception {
        String json = "{\"name\": \"Luis\", \"lastName\": \"Fernandez\", \"email\": \"luis.f@test.com\"}";
        mockMvc.perform(post("/patients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Luis"))
                .andExpect(jsonPath("$.lastName").value("Fernandez"));
    }

    @Test
    void testGetPatientById() throws Exception {
        PatientDTO saved = patientService.save(
                new PatientDTO(null, "Sofia", "Martinez", "sofia.m@test.com", null, null, null));

        mockMvc.perform(get("/patients/" + saved.id())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Sofia"))
                .andExpect(jsonPath("$.lastName").value("Martinez"));
    }

    @Test
    void testGetPatientById_notFound() throws Exception {
        mockMvc.perform(get("/patients/999999")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetAllPatients() throws Exception {
        mockMvc.perform(get("/patients")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void testDeletePatient() throws Exception {
        PatientDTO saved = patientService.save(
                new PatientDTO(null, "Ricardo", "Alvarez", "ricardo.a@test.com", null, null, null));

        mockMvc.perform(delete("/patients/" + saved.id()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/patients/" + saved.id())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
