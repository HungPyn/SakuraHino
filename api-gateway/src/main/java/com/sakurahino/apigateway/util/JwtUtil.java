package com.sakurahino.apigateway.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    // Tạo khóa ký (signing key)
    private Key getSignKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Kiểm tra token có hợp lệ không
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    // Trích xuất userId từ claim "userId"
    public String getUserId(String token) {
        Object id = getAllClaims(token).get("userId");
        return id != null ? id.toString() : null;
    }


    // Trích xuất role từ claim "role"
    public String getRole(String token) {
        Object role = getAllClaims(token).get("role");
        return role != null ? role.toString() : null;
    }

    // Lấy toàn bộ claims (dữ liệu) từ JWT
    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
