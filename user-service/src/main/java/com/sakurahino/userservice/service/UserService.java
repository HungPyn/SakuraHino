package com.sakurahino.userservice.service;

import com.sakurahino.clients.rabitmqModel.RegisterSuccessDTO;
import com.sakurahino.userservice.dto.PublicUserResponseDTO;
import com.sakurahino.userservice.dto.RequestUserDTO;
import com.sakurahino.userservice.dto.ResponseUserDTO;

import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.userservice.dto.UpdateProfileRequestDTO;
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
}
