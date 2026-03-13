package com.example.travel.core.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/v1/auth/**").permitAll()
                                                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                                                // Temporary: Allow Admin and CTV to manage catalog (will refine as we
                                                // add more endpoints)
                                                .requestMatchers(org.springframework.http.HttpMethod.POST,
                                                                "/api/v1/hotels/**", "/api/v1/tours/**")
                                                .hasAnyRole("ADMIN", "CTV")
                                                .requestMatchers(org.springframework.http.HttpMethod.PUT,
                                                                "/api/v1/hotels/**", "/api/v1/tours/**")
                                                .hasAnyRole("ADMIN", "CTV")
                                                .requestMatchers(org.springframework.http.HttpMethod.DELETE,
                                                                "/api/v1/hotels/**", "/api/v1/tours/**")
                                                .hasAnyRole("ADMIN", "CTV")
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
