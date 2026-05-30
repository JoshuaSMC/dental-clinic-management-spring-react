package com.dh.DentalClinic.controller;

import com.dh.DentalClinic.dto.AppointmentDTO;
import com.dh.DentalClinic.service.IAppointmentService;
import com.dh.DentalClinic.validation.ValidationGroups;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final IAppointmentService appointmentService;

    @Autowired
    public AppointmentController(IAppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<AppointmentDTO>> findAll() {
        return ResponseEntity.ok(appointmentService.findAll());
    }

    @PostMapping
    public ResponseEntity<AppointmentDTO> save(@Validated(ValidationGroups.OnCreate.class) @RequestBody AppointmentDTO appointmentDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.save(appointmentDTO));
    }

    @PutMapping
    public ResponseEntity<AppointmentDTO> update(@Validated(ValidationGroups.OnUpdate.class) @RequestBody AppointmentDTO appointmentDTO) {
        return ResponseEntity.ok(appointmentService.update(appointmentDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        appointmentService.delete(id);
        return ResponseEntity.ok("Se eliminó el turno con id " + id);
    }
}
