package com.dh.DentalClinic.controller;

import com.dh.DentalClinic.dto.DentistDTO;
import com.dh.DentalClinic.exception.ResourceNotFoundException;
import com.dh.DentalClinic.service.IDentistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/odontologos")
public class DentistController {

    private final IDentistService dentistService;

    @Autowired
    public DentistController(IDentistService dentistService) {
        this.dentistService = dentistService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<DentistDTO> findById(@PathVariable Long id) {
        return dentistService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DentistDTO> save(@Valid @RequestBody DentistDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dentistService.save(dto));
    }

    @PutMapping
    public ResponseEntity<DentistDTO> update(@Valid @RequestBody DentistDTO dto) {
        return ResponseEntity.ok(dentistService.update(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        dentistService.delete(id);
        return ResponseEntity.ok("Se eliminó el odontólogo con id " + id);
    }

    @GetMapping
    public ResponseEntity<List<DentistDTO>> findAll() {
        return ResponseEntity.ok(dentistService.findAll());
    }

    @GetMapping("/registration/{registration}")
    public ResponseEntity<DentistDTO> findByRegistration(@PathVariable Integer registration) {
        return dentistService.findByRegistration(registration)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la matrícula " + registration));
    }
}
