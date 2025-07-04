package com.example.examservice.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration // Đảm bảo Spring có thể quét và đăng ký Bean này
public class FeignClientInterceptor implements RequestInterceptor {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String HEADER_USER_ID = "X-User-Id"; // Thêm hằng số cho X-User-Id
    private static final String HEADER_USER_ROLE = "X-Role"; // Thêm hằng số cho X-User-Role

    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();

            // 1. Chuyển tiếp header Authorization (nếu có)
            String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);
            if (authorizationHeader != null && !authorizationHeader.isEmpty()) {
                template.header(AUTHORIZATION_HEADER, authorizationHeader);
                // System.out.println("FeignClientInterceptor: Forwarding Authorization header."); // Có thể bỏ sau khi debug
            } else {
                // System.out.println("FeignClientInterceptor: No Authorization header found to forward."); // Có thể bỏ sau khi debug
            }

            // 2. Chuyển tiếp header X-User-Id (nếu có và cần thiết)
            String userIdHeader = request.getHeader(HEADER_USER_ID);
            if (userIdHeader != null && !userIdHeader.isEmpty()) {
                template.header(HEADER_USER_ID, userIdHeader);
                // System.out.println("FeignClientInterceptor: Forwarding X-User-Id header: " + userIdHeader); // Có thể bỏ sau khi debug
            }

            // 3. Chuyển tiếp header X-User-Role (RẤT QUAN TRỌNG TRONG TRƯỜNG HỢP NÀY)
            String userRoleHeader = request.getHeader(HEADER_USER_ROLE);
            if (userRoleHeader != null && !userRoleHeader.isEmpty()) {
                template.header(HEADER_USER_ROLE, userRoleHeader);
                // System.out.println("FeignClientInterceptor: Forwarding X-User-Role header: " + userRoleHeader); // Có thể bỏ sau khi debug
            }

            // (Không cần vòng lặp Enumeration<String> headerNames nếu bạn chỉ muốn chuyển tiếp một vài header cụ thể)
        } else {
            // System.out.println("FeignClientInterceptor: No RequestContextHolder attributes found."); // Có thể bỏ sau khi debug
        }
    }
}