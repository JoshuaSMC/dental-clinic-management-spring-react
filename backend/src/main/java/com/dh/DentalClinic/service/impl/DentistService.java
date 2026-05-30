package com.dh.DentalClinic.service.impl;

import com.dh.DentalClinic.dto.DentistDTO;
import com.dh.DentalClinic.entity.Dentist;
import com.dh.DentalClinic.exception.ResourceNotFoundException;
import com.dh.DentalClinic.repository.IAppointmentRepository;
import com.dh.DentalClinic.repository.IDentistRepository;
import com.dh.DentalClinic.service.IDentistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DentistService implements IDentistService {

    private final IDentistRepository dentistRepository;
    private final IAppointmentRepository appointmentRepository;

    @Autowired
    public DentistService(IDentistRepository dentistRepository, IAppointmentRepository appointmentRepository) {
        this.dentistRepository = dentistRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    @Transactional
    public DentistDTO save(DentistDTO dto) {
        return toDTO(dentistRepository.save(toEntity(dto)));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DentistDTO> findById(Long id) {
        return dentistRepository.findById(id).map(this::toDTO);
    }

    @Override
    @Transactional
    public DentistDTO update(DentistDTO dto) {
        if (dto.id() == null) {
            throw new IllegalArgumentException("El id del odontólogo es requerido para actualizar");
        }
        Dentist existing = dentistRepository.findById(dto.id())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el odontólogo con id: " + dto.id()));
        // Merge sobre la entidad managed para no pisar campos no enviados
        existing.setName(dto.name());
        existing.setLastName(dto.lastName());
        existing.setRegistration(dto.registration());
        return toDTO(dentistRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Dentist dentist = dentistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se pudo eliminar el odontólogo con id: " + id));
        // Eliminar los turnos vinculados antes de borrar el odontólogo
        // para no violar la FK de appointments.dentist_id
        appointmentRepository.deleteAllByDentist_Id(id);
        dentistRepository.delete(dentist);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DentistDTO> findAll() {
        return dentistRepository.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DentistDTO> findByRegistration(Integer registration) {
        return dentistRepository.findByRegistration(registration).map(this::toDTO);
    }

    // ── Mapping ─────────────────────────────────────────────────────────────

    private DentistDTO toDTO(Dentist dentist) {
        return new DentistDTO(dentist.getId(), dentist.getName(), dentist.getLastName(), dentist.getRegistration());
    }

    private Dentist toEntity(DentistDTO dto) {
        Dentist dentist = new Dentist();
        // Never copy the id from a DTO used in save() — id is DB-generated.
        dentist.setName(dto.name());
        dentist.setLastName(dto.lastName());
        dentist.setRegistration(dto.registration());
        return dentist;
    }
}
