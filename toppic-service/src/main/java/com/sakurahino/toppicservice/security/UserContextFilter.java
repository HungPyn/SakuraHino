package com.sakurahino.toppicservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component

public class UserContextFilter extends OncePerRequestFilter {
    private static final String HEADER_USER_ID = "X-User-Id";
    private static final String HEADER_ROLE = "X-User-Role"; // ← Đổi lại cho đúng với gateway

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String userId = request.getHeader(HEADER_USER_ID);
            String role = request.getHeader(HEADER_ROLE);
            System.out.println("🧪 Header X-User-Id: " + userId);
            System.out.println("🧪 Header X-User-Role: " + role);

            if (userId != null && role != null) {
                AuthContext.set(userId, role);

                // 👇 Gán Authentication cho Spring Security
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority(role))
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);

            }

            filterChain.doFilter(request, response);
        } finally {
            AuthContext.clear();

        }
    }
}
