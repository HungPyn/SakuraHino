package com.sakurahino.authservice.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.sakurahino.ampqclient.RabbitMQMessageProducer;
import com.sakurahino.authservice.dto.LoginRequestDTO;
import com.sakurahino.authservice.dto.RegisterRequestDTO;
import com.sakurahino.authservice.entity.User;
import com.sakurahino.authservice.repository.PasswordRepository;
import com.sakurahino.authservice.repository.UserRepository;
import com.sakurahino.authservice.security.JwtGoogleService;
import com.sakurahino.authservice.security.JwtUtil;
import com.sakurahino.authservice.service.AuthService;
import com.sakurahino.authservice.service.impl.GoogleAuthService;
import com.sakurahino.clients.commons.RabbitKey;
import com.sakurahino.clients.enums.Role;
import com.sakurahino.common.retresponse.SuccessResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sakurahino.clients.rabitmqModel.user.RegisterSuccessDTO;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final GoogleAuthService googleAuthService;
    private final JwtGoogleService jwtGoogleService;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordRepository passwordRepository;
    private final JwtUtil jwtUtil;
    private final RabbitMQMessageProducer rabbitMQProducer;

    @PostMapping("/register")
    public SuccessResponse register(@Valid @RequestBody RegisterRequestDTO dto) {
        authService.register(dto);
        return new SuccessResponse("Đăng ký thành công");
    }

    @PostMapping("/login")
    public SuccessResponse login( @Valid @RequestBody LoginRequestDTO dto) {
        return new SuccessResponse(authService.login(dto));
    }

    @PostMapping("/verify-code")
    public SuccessResponse verifyCode(){
        return new SuccessResponse();
    }

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogle(@RequestBody Map<String, String> payload) {
        String idToken = payload.get("idToken");
        if (idToken == null) {
            return ResponseEntity.badRequest().body("ID token is missing.");
        }

        GoogleIdToken.Payload googlePayload = googleAuthService.verifyGoogleIdToken(idToken);
        if (googlePayload == null) {
            return ResponseEntity.status(401).body("Invalid Google ID token.");
        }

        String email = googlePayload.getEmail();
        String name = "New User";

        try {
            Object nameObject = googlePayload.get("name");
            if (nameObject instanceof String) {
                name = (String) nameObject;
            }
        } catch (Exception e) {
            log.error("Error parsing 'name' field from token: " + e.getMessage());
        }

        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            log.info("User exists, logging in: " + user.getEmail());
        } else {
            user = new User();
            user.setId(UUID.randomUUID().toString());
            user.setName(name);
            user.setEmail(email);
            user.setUsername(email.split("@")[0]);
            user.setRole(Role.USER);
            user.setDayCreation(Instant.now());

            userRepository.save(user);

            // Lỗi 4: Sửa lại cách gửi message RabbitMQ
            RegisterSuccessDTO registerSuccessDTO = new RegisterSuccessDTO();
            registerSuccessDTO.setId(user.getId());
            registerSuccessDTO.setName(user.getName());
            registerSuccessDTO.setEmail(user.getEmail());
            registerSuccessDTO.setUsername(user.getUsername());
            registerSuccessDTO.setRole(user.getRole());
            registerSuccessDTO.setDayCreation(user.getDayCreation());
            rabbitMQProducer.publish(
                    registerSuccessDTO,
                    RabbitKey.EXCHANGE_AUTH,
                    RabbitKey.ROUTING_REGISTER_SUCCESS
            );
            log.info("New user created and registered: " + user.getEmail());
        }

        // Tạo JWT token của riêng bạn
        String appToken = jwtGoogleService.generateToken(user.getId(), String.valueOf(user.getRole()));

        return ResponseEntity.ok(Map.of(
                "appToken", appToken,
                "message", "Login successful",
                "user", Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "name", user.getName()
                )
        ));
    }
}