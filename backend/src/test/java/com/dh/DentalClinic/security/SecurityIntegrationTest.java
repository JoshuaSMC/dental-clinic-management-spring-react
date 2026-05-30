package com.dh.DentalClinic.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Verifica que el sistema de roles funciona correctamente:
 * - Requests sin token → 401
 * - USER intentando endpoints solo-ADMIN → 403
 * - ADMIN puede acceder a todo lo que le corresponde
 * - USER puede acceder a endpoints permitidos para su rol
 */
@SpringBootTest
@AutoConfigureMockMvc   // con filtros activos para probar seguridad real
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    // ── Sin autenticación ────────────────────────────────────────────────────

    @Test
    @DisplayName("Sin token: GET /appointments → 401")
    void sinToken_appointments_retorna401() throws Exception {
        mockMvc.perform(get("/appointments").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Sin token: GET /patients → 401")
    void sinToken_patients_retorna401() throws Exception {
        mockMvc.perform(get("/patients").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Sin token: GET /odontologos → 401")
    void sinToken_odontologos_retorna401() throws Exception {
        mockMvc.perform(get("/odontologos").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Sin token: GET /api/users → 401")
    void sinToken_users_retorna401() throws Exception {
        mockMvc.perform(get("/api/users").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    // ── Rol USER — acceso negado a endpoints de ADMIN ────────────────────────

    @Test
    @WithMockUser(authorities = "USER")
    @DisplayName("Rol USER: GET /api/users (solo ADMIN) → 403")
    void rolUser_getUsers_retorna403() throws Exception {
        mockMvc.perform(get("/api/users").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "USER")
    @DisplayName("Rol USER: DELETE /api/users/1 (solo ADMIN) → 403")
    void rolUser_deleteUser_retorna403() throws Exception {
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "USER")
    @DisplayName("Rol USER: DELETE /patients/1 (solo ADMIN) → 403")
    void rolUser_deletePatient_retorna403() throws Exception {
        mockMvc.perform(delete("/patients/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "USER")
    @DisplayName("Rol USER: DELETE /odontologos/1 (solo ADMIN) → 403")
    void rolUser_deleteDentist_retorna403() throws Exception {
        mockMvc.perform(delete("/odontologos/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "USER")
    @DisplayName("Rol USER: DELETE /appointments/1 (recepcionista puede cancelar) → 200")
    void rolUser_deleteAppointment_pasaSeguridadComoRecepcionista() throws Exception {
        // DELETE /appointments es authenticated — recepcionista puede cancelar turnos.
        // DataInitializer crea 5 turnos al arrancar, por lo que el id=1 existe y
        // el delete tiene éxito (200). La capa de seguridad no devuelve 403.
        mockMvc.perform(delete("/appointments/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "USER")
    @DisplayName("Rol USER: PUT /patients/1 (recepcionista puede editar) → 200")
    void rolUser_putPatient_pasaSeguridadComoRecepcionista() throws Exception {
        // PUT /patients es authenticated — recepcionista puede editar datos de pacientes.
        // Enviamos un body válido (DataInitializer crea la paciente Ana Torres con id=1).
        // La capa de seguridad no devuelve 403.
        // El endpoint de update es PUT /patients (el id va en el body, no en la URL)
        mockMvc.perform(put("/patients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":1,\"name\":\"Ana\",\"lastName\":\"Torres\",\"email\":\"ana.torres@mail.com\"}"))
                .andExpect(status().isOk());
    }

    // ── Rol USER — acceso permitido ──────────────────────────────────────────

    @Test
    @WithMockUser(authorities = "USER")
    @DisplayName("Rol USER: GET /appointments → 200")
    void rolUser_getAppointments_retorna200() throws Exception {
        mockMvc.perform(get("/appointments").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "USER")
    @DisplayName("Rol USER: GET /patients → 200")
    void rolUser_getPatients_retorna200() throws Exception {
        mockMvc.perform(get("/patients").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "USER")
    @DisplayName("Rol USER: GET /odontologos → 200")
    void rolUser_getOdontologos_retorna200() throws Exception {
        mockMvc.perform(get("/odontologos").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    // ── Rol ADMIN — acceso completo ──────────────────────────────────────────

    @Test
    @WithMockUser(authorities = "ADMIN")
    @DisplayName("Rol ADMIN: GET /api/users → 200")
    void rolAdmin_getUsers_retorna200() throws Exception {
        mockMvc.perform(get("/api/users").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    @DisplayName("Rol ADMIN: GET /appointments → 200")
    void rolAdmin_getAppointments_retorna200() throws Exception {
        mockMvc.perform(get("/appointments").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
