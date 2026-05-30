package com.dh.DentalClinic.auth;

import com.dh.DentalClinic.configuration.JwtService;
import com.dh.DentalClinic.entity.Role;
import com.dh.DentalClinic.entity.User;
import com.dh.DentalClinic.exception.ResourceNotFoundException;
import com.dh.DentalClinic.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${admin.secret}")
    private String adminSecret;

    public AuthenticationResponse register(RegisterRequest request) {
        // Encode fuera de @Transactional para no mantener la conexión abierta durante BCrypt (~200ms)
        String encoded = passwordEncoder.encode(request.getPassword());
        var user = User.builder()
                .name(request.getName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(encoded)
                .role(Role.USER)
                .build();

        userRepository.save(user);

        var jwtToken = jwtService.generateToken(Map.of("role", user.getRole().name()), user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // authenticationManager.authenticate() already validated credentials; this second
        // lookup fetches the full entity to build the JWT. ResourceNotFoundException maps
        // to 404 via GlobalExceptionHandler — avoids a naked RuntimeException → 500.
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + request.getEmail()));

        var jwtToken = jwtService.generateToken(Map.of("role", user.getRole().name()), user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse registerAdmin(RegisterRequest request, String adminKey) {
        if (!adminSecret.equals(adminKey)) {
            throw new IllegalArgumentException("Clave de administrador inválida");
        }

        // Encode fuera de @Transactional para no mantener la conexión abierta durante BCrypt (~200ms)
        String encoded = passwordEncoder.encode(request.getPassword());
        var user = User.builder()
                .name(request.getName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(encoded)
                .role(Role.ADMIN)
                .build();

        userRepository.save(user);

        var jwtToken = jwtService.generateToken(Map.of("role", user.getRole().name()), user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
