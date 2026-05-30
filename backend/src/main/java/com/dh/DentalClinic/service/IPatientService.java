package com.dh.DentalClinic.service;

import com.dh.DentalClinic.dto.PatientDTO;

import java.util.List;
import java.util.Optional;

public interface IPatientService {
    PatientDTO save(PatientDTO dto);
    Optional<PatientDTO> findById(Long id);
    PatientDTO update(PatientDTO dto);
    void delete(Long id);
    List<PatientDTO> findAll();
}
