package com.sakurahino.authservice.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.sakurahino.ampqclient.RabbitMQMessageProducer;
import com.sakurahino.authservice.dto.LoginRequestDTO;
import com.sakurahino.authservice.dto.RegisterRequestDTO;
import com.sakurahino.authservice.dto.ResetPasswordDTO;
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
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.sakurahino.clients.rabitmqModel.user.RegisterSuccessDTO;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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
    private final RabbitMQMessageProducer rabbitMQProducer;

    @PostMapping("/register")
    public SuccessResponse register(@Valid @RequestBody RegisterRequestDTO dto) {
        authService.register(dto);
        return new SuccessResponse("Đăng ký thành công");
    }

    @PostMapping("/registerAndLogin")
    public SuccessResponse registerAndLogin(@Valid @RequestBody RegisterRequestDTO dto) {
        LoginRequestDTO loginDto = new LoginRequestDTO(dto.getUsername(), dto.getPassword());
        authService.register(dto);
        return login(loginDto);
    }

    @PostMapping("/login")
    public SuccessResponse login( @Valid @RequestBody LoginRequestDTO dto) {
        return new SuccessResponse(authService.login(dto));
    }

    // Xử lý controller về mật khẩu
    @GetMapping("/{username}")
    public SuccessResponse getEmailByUsername(@PathVariable("username") String username) {
        return new SuccessResponse(authService.getEmailByUsername(username));
    }

    @PostMapping("/verify-code")
    public SuccessResponse verifyCode(@RequestBody @Valid ResetPasswordDTO.ForgotPasswordRequest dto){
        authService.sendResetCode(dto);
        return new SuccessResponse("Gửi mã code thành công");
    }

    @PostMapping("/check-code")
    public SuccessResponse checkCode(@RequestBody @Valid ResetPasswordDTO.VerifyCodeRequest dto) {
        var result = authService.checkCode(dto);
        return new SuccessResponse(result);
        }
    @PostMapping("reset-password")
    public SuccessResponse resetPassword(@RequestBody @Valid ResetPasswordDTO.ResetPasswordRequest dto) {
        authService.resetPassword(dto);
        return new SuccessResponse("Đổi mật khẩu thành công");
    }

    // này đăng nhập bằng google nhé
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
            user.setDayCreation( ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant());

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
    @CrossOrigin(origins = "http://localhost:3000") // frontend URL
    @GetMapping("/download-excel")
    public ResponseEntity<Resource> downloadExcel(@RequestParam String url) {
        RestTemplate restTemplate = new RestTemplate();
        byte[] fileBytes = restTemplate.getForObject(url, byte[].class);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=test.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new ByteArrayResource(fileBytes));
    }
}