package com.sakurahino.userservice.config;

import com.sakurahino.userservice.security.UserContextFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {


    private final UserContextFilter userContextFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/users/admin/**").hasAuthority("ADMIN")
                        .requestMatchers("/users/profile/**").hasAnyAuthority("USER", "ADMIN")
                        .anyRequest().permitAll()
                )
                .addFilterBefore(userContextFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
