package com.dh.DentalClinic.configuration;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;
    private final CorsConfigurationSource corsConfigurationSource;

    @Value("${spring.h2.console.enabled:false}")
    private boolean h2ConsoleEnabled;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .authorizeHttpRequests(auth -> {
                    if (h2ConsoleEnabled) auth.requestMatchers("/h2-console/**").permitAll();
                    auth
                        .requestMatchers("/auth/login").permitAll()
                        .requestMatchers("/auth/register-admin").hasAuthority("ADMIN")
                        .requestMatchers("/auth/register").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/", "/*.html", "/js/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/odontologos/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/odontologos/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/odontologos/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/odontologos/**").hasAuthority("ADMIN")

                        // Pacientes: recepcionistas (USER) pueden ver, registrar y editar.
                        // Solo ADMIN puede eliminar registros permanentemente.
                        .requestMatchers(HttpMethod.GET,    "/patients/**").authenticated()
                        .requestMatchers(HttpMethod.POST,   "/patients/**").authenticated()
                        .requestMatchers(HttpMethod.PUT,    "/patients/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/patients/**").hasAuthority("ADMIN")

                        // Turnos: recepcionistas pueden crear, editar y cancelar (DELETE).
                        // Solo ADMIN puede hacer eliminaciones administrativas (mismo endpoint,
                        // distinto contexto de uso — la UI muestra "Eliminar" a admins y "Cancelar" a users).
                        .requestMatchers(HttpMethod.GET,    "/appointments/**").authenticated()
                        .requestMatchers(HttpMethod.POST,   "/appointments/**").authenticated()
                        .requestMatchers(HttpMethod.PUT,    "/appointments/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/appointments/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasAuthority("ADMIN")

                        .anyRequest().authenticated();
                })
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Devuelve 401 (no 403) cuando el request no tiene autenticación
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"No autenticado\"}");
                }))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
