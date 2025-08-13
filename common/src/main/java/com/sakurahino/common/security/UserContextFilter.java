package com.sakurahino.common.security;

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
import java.util.List;

@Component
public class UserContextFilter extends OncePerRequestFilter {

    private static final String HEADER_USER_ID = "X-User-Id";
    private static final String HEADER_ROLE = "X-Role"; // eg: ROLE_ADMIN or ROLE_USER

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String userId = request.getHeader(HEADER_USER_ID);
            String role = request.getHeader(HEADER_ROLE);

            if (userId != null && role != null) {
                AuthContext.set(userId, role);

                // Add ROLE_ prefix if needed
                String formattedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                        new SimpleGrantedAuthority(formattedRole)
                );

                // Set Authentication to SecurityContextHolder
                var auth = new UsernamePasswordAuthenticationToken(userId, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
                System.out.println("✅ Set Authentication in SecurityContext: userId=" + userId + ", authorities=" + authorities);
                System.out.println("⛳ Current Auth: " + SecurityContextHolder.getContext().getAuthentication());

            }

            filterChain.doFilter(request, response);
        } finally {
            AuthContext.clear();
        }
    }
}
