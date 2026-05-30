package com.dh.DentalClinic.controller;

import com.dh.DentalClinic.dto.DentistDTO;
import com.dh.DentalClinic.service.IDentistService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class DentistControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IDentistService dentistService;

    @Test
    void testGetDentistById() throws Exception {
        DentistDTO saved = dentistService.save(new DentistDTO(null, "Joshua", "McLeish", 12345));

        mockMvc.perform(get("/odontologos/" + saved.id())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Joshua"))
                .andExpect(jsonPath("$.lastName").value("McLeish"))
                .andExpect(jsonPath("$.registration").value(12345));
    }

    @Test
    void testPostDentist() throws Exception {
        String json = "{\"registration\": 12346, \"name\": \"Joshua\", \"lastName\": \"McLeish\"}";
        mockMvc.perform(post("/odontologos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Joshua"))
                .andExpect(jsonPath("$.lastName").value("McLeish"))
                .andExpect(jsonPath("$.registration").value(12346));
    }

    @Test
    void testUpdateDentist() throws Exception {
        DentistDTO saved = dentistService.save(new DentistDTO(null, "Original", "Apellido", 12347));

        String updateJson = String.format(
                "{\"id\": %d, \"name\": \"Actualizado\", \"lastName\": \"Apellido\", \"registration\": 12347}",
                saved.id());

        mockMvc.perform(put("/odontologos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Actualizado"))
                .andExpect(jsonPath("$.id").value(saved.id()));
    }

    @Test
    void testGetAllDentists() throws Exception {
        mockMvc.perform(get("/odontologos")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
