package com.dh.DentalClinic.controller;

import com.dh.DentalClinic.dto.UserDTO;
import com.dh.DentalClinic.entity.Role;
import com.dh.DentalClinic.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<UserDTO>> findAll() {
        List<UserDTO> users = userRepository.findAll().stream()
                .map(u -> new UserDTO(u.getId(), u.getName(), u.getLastName(), u.getEmail(), u.getRole().name()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(target -> {
                    // Prevent self-deletion
                    var auth = SecurityContextHolder.getContext().getAuthentication();
                    if (auth == null) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).<String>body("No autenticado");
                    }
                    String currentEmail = auth.getName();
                    if (target.getEmail().equals(currentEmail)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .<String>body("No podés eliminar tu propia cuenta");
                    }
                    // Prevent deleting the last admin
                    if (target.getRole() == Role.ADMIN && userRepository.countByRole(Role.ADMIN) <= 1) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .<String>body("No es posible eliminar al último administrador del sistema");
                    }
                    userRepository.delete(target);
                    return ResponseEntity.status(HttpStatus.NO_CONTENT).<String>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
