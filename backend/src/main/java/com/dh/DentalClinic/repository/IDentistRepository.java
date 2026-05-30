package com.dh.DentalClinic.repository;

import com.dh.DentalClinic.entity.Dentist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IDentistRepository extends JpaRepository<Dentist, Long> {

    Optional<Dentist> findByRegistration(Integer registration);

}
