package com.dh.DentalClinic.controller;

import com.dh.DentalClinic.repository.IUserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IUserRepository userRepository;

    private static final List<String> TEST_EMAILS = List.of(
            "juan.perez@test.com",
            "admin.test@test.com",
            "admin.wrong@test.com"
    );

    @AfterEach
    void tearDown() {
        TEST_EMAILS.forEach(email ->
                userRepository.findByEmail(email).ifPresent(userRepository::delete));
    }

    @Test
    void testRegister_success() throws Exception {
        String body = "{\"name\":\"Juan\",\"lastName\":\"Perez\",\"email\":\"juan.perez@test.com\",\"password\":\"password123\"}";
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void testRegister_invalidEmail_returns400() throws Exception {
        String body = "{\"name\":\"Juan\",\"lastName\":\"Perez\",\"email\":\"not-an-email\",\"password\":\"password123\"}";
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterAdmin_correctKey_returns201() throws Exception {
        String body = "{\"name\":\"Admin\",\"lastName\":\"User\",\"email\":\"admin.test@test.com\",\"password\":\"adminpass1\"}";
        mockMvc.perform(post("/auth/register-admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Admin-Key", "dental-admin-2026")
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void testRegisterAdmin_wrongKey_returns400() throws Exception {
        String body = "{\"name\":\"Admin\",\"lastName\":\"User\",\"email\":\"admin.wrong@test.com\",\"password\":\"adminpass1\"}";
        mockMvc.perform(post("/auth/register-admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Admin-Key", "wrong-key")
                        .content(body))
                .andExpect(status().isBadRequest());
    }
}
