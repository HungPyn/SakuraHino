package com.sakurahino.userservice.service;

import com.sakurahino.clients.rabitmqModel.user.RegisterSuccessDTO;
import com.sakurahino.userservice.dto.*;

import com.sakurahino.common.dto.PaginatedResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    void handleRegisterSuccess(RegisterSuccessDTO dto);

    void markUserOnline(String userId);

    boolean isUserOnline(String userId);

    //admin
    PaginatedResponse<ResponseUserDTO> getAll( int page, int size);
    ResponseUserDTO findByIdForAdmin(String userId);
    void deleteUser(String userId);
    ResponseUserDTO updateForAdmin(String userId,RequestUserDTO dto);


    //user
    PublicUserResponseDTO updateForUser (UpdateProfileRequestDTO dto, MultipartFile file);
    PublicUserResponseDTO findByIdForUser();
    CheckedResponseDTO checkUser();

    // xử lý người dùng không đăng nhập và chuyển freeze về flase nếu không có rs long streak
    void checkAndResetStreak();
}
