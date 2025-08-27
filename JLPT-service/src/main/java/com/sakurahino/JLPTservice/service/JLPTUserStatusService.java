package com.sakurahino.JLPTservice.service;

import com.sakurahino.JLPTservice.module.dto.BaseResponseDTO;
import com.sakurahino.JLPTservice.module.dto.request.UpdateResultJLPTExamRequest;
import com.sakurahino.JLPTservice.module.dto.response.GetByUserIdResponse;
import com.sakurahino.JLPTservice.module.dto.response.UpdateResultJLPTExamResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface JLPTUserStatusService {
    ResponseEntity<BaseResponseDTO<List<GetByUserIdResponse>>> get();

    ResponseEntity<BaseResponseDTO<UpdateResultJLPTExamResponse>> updateResultExam(UpdateResultJLPTExamRequest updateResultJLPTExamRequest);

    ResponseEntity<BaseResponseDTO<UpdateResultJLPTExamResponse>> result(Long id);
}
