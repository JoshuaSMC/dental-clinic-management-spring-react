package com.dh.DentalClinic.service;

import com.dh.DentalClinic.dto.PatientDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class PatientServiceTest {

    @Autowired
    private IPatientService patientService;

    @Test
    void save() {
        PatientDTO dto = new PatientDTO(null, "Ana", "Garcia", "ana.garcia@test.com", null, null, null);
        PatientDTO saved = patientService.save(dto);

        assertNotNull(saved.id());
        assertEquals("Ana", saved.name());
        assertEquals("Garcia", saved.lastName());
    }

    @Test
    void findById() {
        PatientDTO dto = new PatientDTO(null, "Ana", "Garcia", "ana.garcia2@test.com", null, null, null);
        PatientDTO saved = patientService.save(dto);

        Optional<PatientDTO> found = patientService.findById(saved.id());

        assertTrue(found.isPresent());
        assertEquals("Ana", found.get().name());
    }

    @Test
    void findById_notFound() {
        Optional<PatientDTO> found = patientService.findById(999999L);
        assertFalse(found.isPresent());
    }

    @Test
    void update() {
        PatientDTO dto = new PatientDTO(null, "Carlos", "Lopez", "carlos.lopez@test.com", null, null, null);
        PatientDTO saved = patientService.save(dto);

        PatientDTO updated = patientService.update(
                new PatientDTO(saved.id(), "Carlos Actualizado", "Lopez", "carlos.lopez@test.com", null, null, null));

        assertEquals("Carlos Actualizado", updated.name());
    }

    @Test
    void delete() {
        PatientDTO dto = new PatientDTO(null, "Para", "Borrar", "para.borrar@test.com", null, null, null);
        PatientDTO saved = patientService.save(dto);

        patientService.delete(saved.id());

        assertFalse(patientService.findById(saved.id()).isPresent());
    }
}
