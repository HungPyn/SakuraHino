package com.sakurahino.authservice.security;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
@Service
public class JwtGoogleService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String userId, String role) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(expiration);
        return Jwts.builder()
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiry))
                .claim("userId", userId)
                .claim("role", role)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

}
