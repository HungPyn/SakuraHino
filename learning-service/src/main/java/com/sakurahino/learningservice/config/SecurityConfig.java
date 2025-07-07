package com.sakurahino.learningservice.config;


import com.sakurahino.common.security.UserContextFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final UserContextFilter userContextFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/topic/admin/**").hasRole("ADMIN")
                        .requestMatchers("/topic/**").hasAnyRole("USER", "ADMIN") // Bao gồm cả GET /topic?levelId=...
                        .requestMatchers("/topic").hasAnyRole("USER", "ADMIN")     // Đảm bảo path gốc cũng match
                        .anyRequest().authenticated()
                )
                .addFilterBefore(userContextFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

}
