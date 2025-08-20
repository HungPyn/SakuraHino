package com.sakurahino.userservice.service.impl;

import com.sakurahino.ampqclient.RabbitMQMessageProducer;
import com.sakurahino.clients.commons.RabbitKey;
import com.sakurahino.clients.enums.Role;
import com.sakurahino.clients.feign.UploadServiceClients;
import com.sakurahino.clients.rabitmqModel.user.RegisterSuccessDTO;
import com.sakurahino.clients.rabitmqModel.user.UserStatusMessageDTO;
import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.security.AuthHelper;
import com.sakurahino.common.util.FileUtils;
import com.sakurahino.userservice.dto.*;
import com.sakurahino.userservice.entity.User;
import com.sakurahino.clients.enums.UserStatus;
import com.sakurahino.userservice.enums.UserType;
import com.sakurahino.userservice.mapper.UserServiceMapper;
import com.sakurahino.userservice.repository.UserRepository;
import com.sakurahino.userservice.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl  implements UserService {

    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserServiceMapper userServiceMapper;
    private final AuthHelper authHelper;
    private final RabbitMQMessageProducer rabbitMQProducer;
    private final UploadServiceClients uploadServiceClients;
    private static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    // xử lý bất đồng bộ ừ auth-service sang
    @Override
    public void handleRegisterSuccess(RegisterSuccessDTO dto) {
        log.info("Handle register success for userId: {}", dto.getId());

        if (userRepository.existsByEmail(dto.getEmail())) {
            log.warn("User with email {} already exists, skipping...", dto.getEmail());
            return;
        }

        User user = new User();
        user.setId(dto.getId());
        user.setName(dto.getName());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setDayCreation(dto.getDayCreation());
        user.setRole(dto.getRole());
        user.setStatus(dto.getStatus());
        user.setUserType(UserType.FREE);

        userRepository.save(user);
        log.info("User saved successfully with ID: {}", user.getId());
    }

    @Override
    public void markUserOnline(String userId) {
        log.debug("Marking user {} as online", userId);
        redisTemplate.opsForValue().set("user:online:" + userId, "online", Duration.ofMinutes(5));
    }

    @Override
    public boolean isUserOnline(String userId) {
        boolean isOnline = Boolean.TRUE.equals(redisTemplate.hasKey("user:online:" + userId));
        log.debug("Checking online status for user {}: {}", userId, isOnline);
        return isOnline;
    }

    //admin
    @Override
    public PaginatedResponse<ResponseUserDTO> getAll(int page, int size) {
        log.info("Fetching all users: page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<User> topicPage = userRepository.findAllByRoleOrderByDayCreationDesc(Role.USER,pageable);

        List<ResponseUserDTO> responseList = topicPage.getContent().stream()
                .map(userServiceMapper::toResponseUserDTO)
                .toList();

        log.debug("Fetched {} users", responseList.size());
        return new PaginatedResponse<>(responseList, topicPage.getNumber(),
                (int) topicPage.getTotalElements(), topicPage.getTotalPages(), topicPage.hasNext());
    }

    @Override
    public ResponseUserDTO findByIdForAdmin(String userId) {
        log.info("Admin fetch user detail for ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));
        return userServiceMapper.toResponseUserDTO(user);
    }

    @Override
    public void deleteUser(String userId) {
        log.info("Deleting user with ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));
        user.setStatus(UserStatus.DELETED);
        userRepository.save(user);
        log.info("User status set to DELETED for ID: {}", userId);

        // gửi cập nhậ trạng thái sang bên auth-service
        UserStatusMessageDTO userStatusMessageDTO = new UserStatusMessageDTO();
        userStatusMessageDTO.setUserId(userId);
        userStatusMessageDTO.setStatus(user.getStatus());

        log.info("[RabbitMQ] Sending user status delete to auth-service: userId={}, status={}, exchange={}, routingKey={}",
                userId, user.getStatus(), RabbitKey.EXCHANGE_USER, RabbitKey.ROUTING_USER_UPDATE);

        rabbitMQProducer.publish(
                userStatusMessageDTO,
                RabbitKey.EXCHANGE_USER,
                RabbitKey.ROUTING_USER_UPDATE
        );
    }

    @Override
    public ResponseUserDTO updateForAdmin(String userId, RequestUserDTO dto) {
        log.info("Admin updating user ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));
        if (!user.getEmail().equals(dto.getEmail()) &&
                userRepository.existsByEmail(dto.getEmail())) {
            throw new AppException(ExceptionCode.EMAIL_TON_TAI);
        }
        Instant updateDay = ZonedDateTime.now(VN_ZONE).toInstant();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setStatus(dto.getStatus());
        user.setUpdatedDay(updateDay);

        // gửi cập nhậ trạng thái sang bên auth-service
        UserStatusMessageDTO userStatusMessageDTO = new UserStatusMessageDTO();
        userStatusMessageDTO.setUserId(userId);
        userStatusMessageDTO.setStatus(dto.getStatus());

        log.info("[RabbitMQ] Sending user status update to auth-service: userId={}, status={}, exchange={}, routingKey={}",
                userId, dto.getStatus(), RabbitKey.EXCHANGE_USER, RabbitKey.ROUTING_USER_UPDATE);

        rabbitMQProducer.publish(
                userStatusMessageDTO,
                RabbitKey.EXCHANGE_USER,
                RabbitKey.ROUTING_USER_UPDATE
        );

        userRepository.save(user);
        log.info("User updated successfully by admin: {}", userId);

        return userServiceMapper.toResponseUserDTO(user);
    }

    //user
    @Override
    @Transactional
    public PublicUserResponseDTO updateForUser(UpdateProfileRequestDTO dto, MultipartFile file) {
        String userId = authHelper.getUserId();
        log.info("User {} updating their profile", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));

        if (!user.getEmail().equals(dto.getEmail()) &&
                userRepository.existsByEmail(dto.getEmail())) {
            throw new AppException(ExceptionCode.EMAIL_TON_TAI);
        }
        if (file != null && !file.isEmpty()) {
            log.debug("User {} is updating avatar", userId);
            String oldUrl = user.getAvatarUrl();
            if (oldUrl != null && !oldUrl.isEmpty()) {
                String oldObjectName = FileUtils.extractObjectName(file.getOriginalFilename());
                uploadServiceClients.deleteFile(oldUrl);
                log.debug("Old avatar deleted: {}", oldObjectName);
            }

            String newUrlAvatar = uploadServiceClients.uploadFile(file).getUrlImage();
            log.debug("New avatar uploaded: {}", newUrlAvatar);
            user.setAvatarUrl(newUrlAvatar);
        }
        Instant updateDay = ZonedDateTime.now(VN_ZONE).toInstant();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setUpdatedDay(updateDay);
        userRepository.save(user);
        log.info("User {} profile updated successfully", userId);

        return userServiceMapper.toPublicUserResponseDTO(user);
    }

    @Override
    public PublicUserResponseDTO findByIdForUser() {
        String userId = authHelper.getUserId();
        log.info("Fetching profile for user ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));
        return userServiceMapper.toPublicUserResponseDTO(user);
    }

    @Override
    public CheckedResponseDTO checkUser() {
        String userId = authHelper.getUserId();
        log.info("checking user ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ExceptionCode.TAI_KHOAN_KHONG_TON_TAI));
        return userServiceMapper.toCheckedResponseDTO(user);
    }

    @Override
    @Scheduled(cron = "0 5 0 * * *", zone = "Asia/Ho_Chi_Minh")
    public void checkAndResetStreak() {
        log.info("=== Bắt đầu kiểm tra streak và freeze của người dùng ===");

        ZonedDateTime yesterdayVn = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")).minusDays(1);
        Instant yesterday = yesterdayVn.toInstant();

        // 1. Reset streak nếu không có freeze
        int resetCount = userRepository.resetStreakForInactiveUsers(yesterday);
        log.info("Đã reset streak cho {} người dùng không hoạt động và không có freeze", resetCount);

        // 2. Sử dụng freeze nếu có và bỏ lỡ ngày
        int freezeCount = userRepository.useFreezeForInactiveUsers(yesterday);
        log.info("Đã sử dụng freeze cho {} người dùng bỏ lỡ ngày", freezeCount);

        log.info("=== Hoàn thành kiểm tra streak và freeze ===");
    }

}
