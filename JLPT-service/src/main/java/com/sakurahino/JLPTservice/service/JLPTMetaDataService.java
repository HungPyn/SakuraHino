package com.sakurahino.JLPTservice.service;

import com.sakurahino.JLPTservice.module.dto.BaseResponseDTO;
import com.sakurahino.JLPTservice.module.dto.request.AddNewExamRequest;
import com.sakurahino.JLPTservice.module.dto.response.GetAudioAndTextReadingResponse;
import com.sakurahino.JLPTservice.module.dto.response.JLPTMetaDataResponseDTO;
import com.sakurahino.JLPTservice.module.entity.JLPTMetaData;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface JLPTMetaDataService {

    ResponseEntity<BaseResponseDTO<List<JLPTMetaData>>> getAll();

    ResponseEntity<BaseResponseDTO<JLPTMetaDataResponseDTO>> add(AddNewExamRequest addNewExamRequest);

    ResponseEntity<BaseResponseDTO<JLPTMetaData>> delete(Long id);

    ResponseEntity<BaseResponseDTO<JLPTMetaData>> getById(Long id);

    ResponseEntity<BaseResponseDTO<GetAudioAndTextReadingResponse>> getAudioUrl(Long id);


}
