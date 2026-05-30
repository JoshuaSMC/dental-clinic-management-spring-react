package com.dh.DentalClinic.service;

import com.dh.DentalClinic.dto.DentistDTO;
import com.dh.DentalClinic.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class DentistServiceTest {

    @Autowired
    private IDentistService dentistService;

    @Test
    void save() {
        DentistDTO dto = new DentistDTO(null, "Carlos", "Lopez", 10001);
        DentistDTO saved = dentistService.save(dto);

        assertNotNull(saved.id());
        assertEquals("Carlos", saved.name());
        assertEquals("Lopez", saved.lastName());
        assertEquals(10001, saved.registration());
    }

    @Test
    void findById() {
        DentistDTO dto = new DentistDTO(null, "Maria", "Gomez", 10002);
        DentistDTO saved = dentistService.save(dto);

        Optional<DentistDTO> found = dentistService.findById(saved.id());

        assertTrue(found.isPresent());
        assertEquals("Maria", found.get().name());
    }

    @Test
    void findById_notFound() {
        Optional<DentistDTO> found = dentistService.findById(999999L);
        assertFalse(found.isPresent());
    }

    @Test
    void update() {
        DentistDTO dto = new DentistDTO(null, "Pedro", "Ramirez", 10003);
        DentistDTO saved = dentistService.save(dto);

        DentistDTO updated = dentistService.update(
                new DentistDTO(saved.id(), "Pedro Actualizado", "Ramirez", 10003));

        assertEquals("Pedro Actualizado", updated.name());
        assertEquals(saved.id(), updated.id());
    }

    @Test
    void delete() {
        DentistDTO dto = new DentistDTO(null, "Ana", "Torres", 10004);
        DentistDTO saved = dentistService.save(dto);

        dentistService.delete(saved.id());

        assertFalse(dentistService.findById(saved.id()).isPresent());
    }

    @Test
    void delete_throwsWhenNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> dentistService.delete(999999L));
    }

    @Test
    void findByRegistration() {
        DentistDTO dto = new DentistDTO(null, "Sofia", "Blanco", 10005);
        dentistService.save(dto);

        Optional<DentistDTO> found = dentistService.findByRegistration(10005);

        assertTrue(found.isPresent());
        assertEquals("Sofia", found.get().name());
    }
}
