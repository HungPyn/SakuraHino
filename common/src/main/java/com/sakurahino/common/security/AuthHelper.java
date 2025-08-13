package com.sakurahino.common.security;

import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@RequiredArgsConstructor
public class AuthHelper {

    private static final String USER_ID_HEADER = "X-User-Id";
    private static final String ROLE_HEADER = "X-Role";

    private HttpServletRequest getRequest() {
        RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
        if (!(attributes instanceof ServletRequestAttributes servletRequestAttributes)) {
            throw new AppException(ExceptionCode.UNAUTHORIZED);
        }
        return servletRequestAttributes.getRequest();
    }

    public String getUserId() {
        String userId = getRequest().getHeader(USER_ID_HEADER);
        if (userId == null || userId.isBlank()) {
            throw new AppException(ExceptionCode.UNAUTHORIZED);
        }
        return userId;
    }

    public String getRole() {
        String role = getRequest().getHeader(ROLE_HEADER);
        if (role == null || role.isBlank()) {
            throw new AppException(ExceptionCode.UNAUTHORIZED);
        }
        return role;
    }

    public boolean hasRole(String expectedRole) {
        return expectedRole.equalsIgnoreCase(getRole());
    }

    public boolean isAdmin() {
        return hasRole("ADMIN");
    }

    public boolean isUser() {
        return hasRole("USER");
    }
}
