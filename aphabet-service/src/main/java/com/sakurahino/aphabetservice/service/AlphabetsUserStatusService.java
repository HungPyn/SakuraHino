package com.sakurahino.aphabetservice.service;

import com.sakurahino.aphabetservice.module.dto.BaseResponeDTO;
import com.sakurahino.aphabetservice.module.dto.response.user.GetByUserResponseDTO;
import com.sakurahino.aphabetservice.module.dto.response.user.GetByUserResponseListDTO;
import com.sakurahino.aphabetservice.module.entity.AlphabetsUserStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

public interface AlphabetsUserStatusService {
    ResponseEntity<BaseResponeDTO<GetByUserResponseListDTO>> getAllCharacterByUserId();

    ResponseEntity<BaseResponeDTO<String>> updateResult(Long alphabetId);

    ResponseEntity<BaseResponeDTO<String>> updateOldResult(Long alphabetId);
}
