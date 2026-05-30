package com.dh.DentalClinic.service.impl;

import com.dh.DentalClinic.dto.AppointmentDTO;
import com.dh.DentalClinic.entity.Appointment;
import com.dh.DentalClinic.entity.Dentist;
import com.dh.DentalClinic.entity.Patient;
import com.dh.DentalClinic.exception.ResourceNotFoundException;
import com.dh.DentalClinic.repository.IAppointmentRepository;
import com.dh.DentalClinic.repository.IDentistRepository;
import com.dh.DentalClinic.repository.IPatientRepository;
import com.dh.DentalClinic.service.IAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService implements IAppointmentService {

    private final IAppointmentRepository appointmentRepository;
    private final IDentistRepository dentistRepository;
    private final IPatientRepository patientRepository;

    @Autowired
    public AppointmentService(IAppointmentRepository appointmentRepository,
                              IDentistRepository dentistRepository,
                              IPatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.dentistRepository = dentistRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    @Transactional
    public AppointmentDTO save(AppointmentDTO appointmentDTO) {
        Dentist dentist = dentistRepository.findById(appointmentDTO.getDentistId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontro el odontologo con id: " + appointmentDTO.getDentistId()));
        Patient patient = patientRepository.findById(appointmentDTO.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontro el paciente con id: " + appointmentDTO.getPatientId()));

        if (appointmentRepository.existsByDentist_IdAndDateAndTime(dentist.getId(), appointmentDTO.getDate(), appointmentDTO.getTime())) {
            throw new IllegalArgumentException("El odontólogo ya tiene un turno asignado en esa fecha y hora");
        }

        Appointment appointment = new Appointment();
        appointment.setDentist(dentist);
        appointment.setPatient(patient);
        appointment.setDate(appointmentDTO.getDate());
        appointment.setTime(appointmentDTO.getTime());

        return toDTO(appointmentRepository.save(appointment));
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentDTO findById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se pudo encontrar el turno con id: " + id));
        return toDTO(appointment);
    }

    @Override
    @Transactional
    public AppointmentDTO update(AppointmentDTO appointmentDTO) {
        if (appointmentDTO.getId() == null) {
            throw new IllegalArgumentException("El id del turno es requerido para actualizar");
        }
        Appointment appointment = appointmentRepository.findById(appointmentDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontro el turno con id: " + appointmentDTO.getId()));

        Dentist dentist = dentistRepository.findById(appointmentDTO.getDentistId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontro el odontologo con id: " + appointmentDTO.getDentistId()));
        Patient patient = patientRepository.findById(appointmentDTO.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontro el paciente con id: " + appointmentDTO.getPatientId()));

        if (appointmentRepository.existsByDentist_IdAndDateAndTimeAndIdNot(dentist.getId(), appointmentDTO.getDate(), appointmentDTO.getTime(), appointmentDTO.getId())) {
            throw new IllegalArgumentException("El odontólogo ya tiene un turno asignado en esa fecha y hora");
        }

        appointment.setDentist(dentist);
        appointment.setPatient(patient);
        appointment.setDate(appointmentDTO.getDate());
        appointment.setTime(appointmentDTO.getTime());

        return toDTO(appointmentRepository.save(appointment));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado con el id: " + id));
        appointmentRepository.delete(appointment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDTO> findAll() {
        return appointmentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private AppointmentDTO toDTO(Appointment appointment) {
        return new AppointmentDTO(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getDentist().getId(),
                appointment.getDate(),
                appointment.getTime()
        );
    }
}
