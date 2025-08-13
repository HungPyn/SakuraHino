package com.sakurahino.apigateway.config;

import com.sakurahino.apigateway.util.JwtUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import reactor.util.annotation.NonNull;

import java.util.List;

@Component
public class AuthenticationFilter implements WebFilter {

    private final JwtUtil jwtUtil;

    public AuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // Các endpoint công khai không yêu cầu token
    private static final List<String> PUBLIC_API_PATHS = List.of(
            "/api/auth/**",
            "/auth/register",       // path thực tế trong auth-service
            "/auth/login"
    );

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    public @NonNull Mono<Void> filter(@NonNull ServerWebExchange exchange, @NonNull WebFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        ServerHttpRequest request = exchange.getRequest(); // Lấy request ở đây

        // --- ĐÂY LÀ PHẦN BẠN CẦN THÊM VÀO HOẶC ĐẢM BẢO NÓ CÓ TRONG CODE CỦA BẠN ---
        // Luôn cho phép các yêu cầu OPTIONS đi qua mà không cần xác thực.
        // Đây phải là điều kiện đầu tiên được kiểm tra trong filter.
        if (request.getMethod() == HttpMethod.OPTIONS) {
            System.out.println("Allowing OPTIONS request for path: " + path);
            return chain.filter(exchange); // Cho phép yêu cầu đi tiếp đến các filter khác (bao gồm CORS filter)
        }
        // ----------------------

        // Bỏ qua xác thực nếu là public API
        if (isPublicApi(path)) {
            return chain.filter(exchange);
        }

        // Lấy Authorization header
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.toLowerCase().startsWith("bearer ")) {
            return unauthorized(exchange, "Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7); // Bỏ "Bearer "

        // Kiểm tra token
        if (!jwtUtil.validateToken(token)) {
            return unauthorized(exchange, "Invalid or expired token");
        }

        // Trích xuất thông tin người dùng
        String userId = jwtUtil.getUserId(token);
        String role = jwtUtil.getRole(token);
        System.out.println("Filtering path: " + path);
        if (userId == null || role == null) {
            return unauthorized(exchange, "Token missing required claims");
        }

        // Log để debug (chỉ nên bật ở môi trường dev)
        System.out.println("Authenticated - userId: " + userId + ", role: " + role);

        // Thêm thông tin vào header
        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                .header("X-User-Id", userId.toString())
                .header("X-Role", role)
                .build();

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    private boolean isPublicApi(String path) {
        return PUBLIC_API_PATHS.stream().anyMatch(publicPath -> pathMatcher.match(publicPath, path));
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        System.out.println(" Unauthorized: " + message);
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}
