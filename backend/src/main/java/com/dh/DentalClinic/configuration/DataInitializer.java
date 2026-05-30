package com.dh.DentalClinic.configuration;

import com.dh.DentalClinic.entity.*;
import com.dh.DentalClinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final IUserRepository userRepository;
    private final IDentistRepository dentistRepository;
    private final IPatientRepository patientRepository;
    private final IAppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.secret}")
    private String adminSecret;

    /** Separate from adminSecret so leaking the register-admin key doesn't also
     *  expose the seeded admin login password. Override with ADMIN_INITIAL_PASSWORD. */
    @Value("${admin.initial-password:Admin@Dental2025!}")
    private String adminInitialPassword;

    @Override
    public void run(String... args) {
        seedAdmin();
        if (dentistRepository.count() == 0 && patientRepository.count() == 0) {
            List<Dentist> dentists = seedDentists();
            List<Patient> patients = seedPatients();
            seedAppointments(dentists, patients);
        }
    }

    private void seedAdmin() {
        if (userRepository.findByEmail("admin@dental.com").isEmpty()) {
            userRepository.save(User.builder()
                    .name("Admin")
                    .lastName("DentalClinic")
                    .email("admin@dental.com")
                    .password(passwordEncoder.encode(adminInitialPassword))
                    .role(Role.ADMIN)
                    .build());
        }
    }

    private List<Dentist> seedDentists() {
        Dentist d1 = new Dentist(); d1.setName("Martín");   d1.setLastName("González");  d1.setRegistration(99001);
        Dentist d2 = new Dentist(); d2.setName("Sofía");    d2.setLastName("Ramírez");   d2.setRegistration(99002);
        Dentist d3 = new Dentist(); d3.setName("Lucas");    d3.setLastName("Fernández"); d3.setRegistration(99003);
        Dentist d4 = new Dentist(); d4.setName("Valentina");d4.setLastName("López");     d4.setRegistration(99004);
        Dentist d5 = new Dentist(); d5.setName("Diego");    d5.setLastName("Herrera");   d5.setRegistration(99005);
        return dentistRepository.saveAll(List.of(d1, d2, d3, d4, d5));
    }

    private List<Patient> seedPatients() {
        Address a1 = new Address(); a1.setStreet("Corrientes"); a1.setNumber(1234); a1.setLocation("CABA");       a1.setProvince("Buenos Aires");
        Address a2 = new Address(); a2.setStreet("Santa Fe");   a2.setNumber(560);  a2.setLocation("Rosario");    a2.setProvince("Santa Fe");
        Address a3 = new Address(); a3.setStreet("San Martín"); a3.setNumber(890);  a3.setLocation("Córdoba");    a3.setProvince("Córdoba");
        Address a4 = new Address(); a4.setStreet("Rivadavia");  a4.setNumber(2200); a4.setLocation("Mendoza");    a4.setProvince("Mendoza");
        Address a5 = new Address(); a5.setStreet("Belgrano");   a5.setNumber(310);  a5.setLocation("Mar del Plata");a5.setProvince("Buenos Aires");

        Patient p1 = new Patient(); p1.setName("Ana");      p1.setLastName("Torres");    p1.setEmail("ana.torres@mail.com");    p1.setCardIdentity(30111222L); p1.setAdmissionDate(LocalDate.of(2025, 1, 10)); p1.setAddress(a1);
        Patient p2 = new Patient(); p2.setName("Carlos");   p2.setLastName("Mendez");    p2.setEmail("carlos.m@mail.com");      p2.setCardIdentity(28333444L); p2.setAdmissionDate(LocalDate.of(2025, 2, 14)); p2.setAddress(a2);
        Patient p3 = new Patient(); p3.setName("Lucía");    p3.setLastName("Sánchez");   p3.setEmail("lucia.s@mail.com");       p3.setCardIdentity(35555666L); p3.setAdmissionDate(LocalDate.of(2025, 3, 5));  p3.setAddress(a3);
        Patient p4 = new Patient(); p4.setName("Tomás");    p4.setLastName("Díaz");      p4.setEmail("tomas.d@mail.com");       p4.setCardIdentity(40777888L); p4.setAdmissionDate(LocalDate.of(2025, 4, 20)); p4.setAddress(a4);
        Patient p5 = new Patient(); p5.setName("Florencia");p5.setLastName("Morales");   p5.setEmail("flor.morales@mail.com");  p5.setCardIdentity(32999000L); p5.setAdmissionDate(LocalDate.of(2025, 5, 3));  p5.setAddress(a5);

        return patientRepository.saveAll(List.of(p1, p2, p3, p4, p5));
    }

    private void seedAppointments(List<Dentist> dentists, List<Patient> patients) {
        LocalDate base = LocalDate.now().plusDays(1);

        Appointment a1 = new Appointment(); a1.setDentist(dentists.get(0)); a1.setPatient(patients.get(0)); a1.setDate(base);             a1.setTime(LocalTime.of(9,  0));
        Appointment a2 = new Appointment(); a2.setDentist(dentists.get(1)); a2.setPatient(patients.get(1)); a2.setDate(base.plusDays(2));  a2.setTime(LocalTime.of(10, 30));
        Appointment a3 = new Appointment(); a3.setDentist(dentists.get(2)); a3.setPatient(patients.get(2)); a3.setDate(base.plusDays(5));  a3.setTime(LocalTime.of(14, 0));
        Appointment a4 = new Appointment(); a4.setDentist(dentists.get(3)); a4.setPatient(patients.get(3)); a4.setDate(base.plusDays(7));  a4.setTime(LocalTime.of(11, 15));
        Appointment a5 = new Appointment(); a5.setDentist(dentists.get(4)); a5.setPatient(patients.get(4)); a5.setDate(base.plusDays(10)); a5.setTime(LocalTime.of(16, 0));

        appointmentRepository.saveAll(List.of(a1, a2, a3, a4, a5));
    }
}
