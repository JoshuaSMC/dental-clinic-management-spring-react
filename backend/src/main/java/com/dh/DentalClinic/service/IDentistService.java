package com.dh.DentalClinic.service;

import com.dh.DentalClinic.dto.DentistDTO;

import java.util.List;
import java.util.Optional;

public interface IDentistService {
    DentistDTO save(DentistDTO dto);
    Optional<DentistDTO> findById(Long id);
    DentistDTO update(DentistDTO dto);
    void delete(Long id);
    List<DentistDTO> findAll();
    Optional<DentistDTO> findByRegistration(Integer registration);
}
