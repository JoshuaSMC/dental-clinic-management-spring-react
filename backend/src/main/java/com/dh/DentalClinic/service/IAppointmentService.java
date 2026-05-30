package com.dh.DentalClinic.service;

import com.dh.DentalClinic.dto.AppointmentDTO;
import com.dh.DentalClinic.exception.ResourceNotFoundException;

import java.util.List;

public interface IAppointmentService {
    AppointmentDTO save(AppointmentDTO appointmentDTO);
    AppointmentDTO findById(Long id);
    AppointmentDTO update(AppointmentDTO appointmentDTO);
    void delete(Long id);
    List<AppointmentDTO> findAll();
}
