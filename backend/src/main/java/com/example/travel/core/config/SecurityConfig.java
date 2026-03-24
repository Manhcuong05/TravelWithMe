package com.example.travel.core.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(AbstractHttpConfigurer::disable)
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers("/ws-chat/**").permitAll()
                                                .requestMatchers("/api/chat/**").permitAll()
                                                .requestMatchers("/uploads/**").permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.POST,
                                                                "/api/upload")
                                                .hasAnyRole("ADMIN", "CTV")
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/search/**", "/api/flights/**",
                                                                "/api/hotels/**", "/api/pois/**",
                                                                "/api/tours/**", "/api/reviews/**", "/api/rooms/**")
                                                .permitAll()
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                .requestMatchers(org.springframework.http.HttpMethod.POST,
                                                                "/api/hotels/**", "/api/tours/**",
                                                                "/api/flights/**", "/api/pois/**", "/api/rooms/**")
                                                .hasAnyRole("ADMIN", "CTV")
                                                .requestMatchers(org.springframework.http.HttpMethod.PUT,
                                                                "/api/hotels/**", "/api/tours/**",
                                                                "/api/flights/**", "/api/pois/**", "/api/rooms/**")
                                                .hasAnyRole("ADMIN", "CTV")
                                                .requestMatchers(org.springframework.http.HttpMethod.DELETE,
                                                                "/api/hotels/**", "/api/tours/**",
                                                                "/api/flights/**", "/api/pois/**", "/api/rooms/**")
                                                .hasAnyRole("ADMIN", "CTV")
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
                org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
                configuration.setAllowedOrigins(java.util.List.of("http://localhost:4200", "http://localhost:3000"));
                configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type", "X-Requested-With"));
                configuration.setAllowCredentials(true);
                org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
