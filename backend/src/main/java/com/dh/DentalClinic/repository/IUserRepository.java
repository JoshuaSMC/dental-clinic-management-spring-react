package com.dh.DentalClinic.repository;

import com.dh.DentalClinic.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    long countByRole(com.dh.DentalClinic.entity.Role role);

}
