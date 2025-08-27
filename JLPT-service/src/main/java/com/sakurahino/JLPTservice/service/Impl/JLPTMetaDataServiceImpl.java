package com.sakurahino.JLPTservice.service.Impl;

import com.sakurahino.JLPTservice.enums.StatusEnum;
import com.sakurahino.JLPTservice.module.dto.BaseResponseDTO;
import com.sakurahino.JLPTservice.module.dto.request.AddNewExamRequest;
import com.sakurahino.JLPTservice.module.entity.JLPTMetaData;
import com.sakurahino.JLPTservice.repository.JLPTMetaDataResponse;
import com.sakurahino.JLPTservice.service.JLPTMetaDataService;
import com.sakurahino.clients.feign.UploadServiceClients;
import com.sakurahino.common.security.AuthHelper;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JLPTMetaDataServiceImpl implements JLPTMetaDataService {
    private final JLPTMetaDataResponse jlptMetaDataResponse;
    private final UploadServiceClients uploadServiceClients;
    private final AuthHelper authHelper;
    @Override
    public ResponseEntity<BaseResponseDTO<List<JLPTMetaData>>> getAll() {
        try {
            List<JLPTMetaData> jlptMetaData =  jlptMetaDataResponse.findAll();
            return ResponseEntity.ok(BaseResponseDTO.<List<JLPTMetaData>>builder()
                    .statusCode("200")
                    .errorMessage("Success")
                    .Data(jlptMetaData)
                    .build());
        } catch (Exception e) {
            throw new IllegalArgumentException(e);
        }
    }

    @Override
    public ResponseEntity<BaseResponseDTO<JLPTMetaData>> add(AddNewExamRequest addNewExamRequest) {
        try {
            StatusEnum statusEnum = StatusEnum.valueOf(addNewExamRequest.getStatus().toUpperCase());
            var response = uploadServiceClients.uploadExcel(addNewExamRequest.getFile());
            JLPTMetaData jlptMetaData = JLPTMetaData.builder()
                    .examName(addNewExamRequest.getExamName())
                    .downloadUrl(response.getUrlExcelFile())
                    .audioUrl(addNewExamRequest.getAudioUrl())
                    .examTime(addNewExamRequest.getExamTime())
                    .status(statusEnum)
                    .createAt(ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")))
                    .build();
            return ResponseEntity.ok(BaseResponseDTO.<JLPTMetaData>builder()
                    .statusCode("200")
                    .errorMessage("Success")
                    .Data(jlptMetaDataResponse.save(jlptMetaData))
                    .build());
        }catch (Exception e){
            throw new IllegalArgumentException(e);
        }

    }

    @Override
    public ResponseEntity<BaseResponseDTO<JLPTMetaData>> delete(Long id) {
        Optional<JLPTMetaData> jlptMetaData = jlptMetaDataResponse.findById(id);
        if (jlptMetaData.isPresent()){
            JLPTMetaData jlptMetaData1 = jlptMetaData.get();
            jlptMetaData1.setStatus(StatusEnum.LOCKED);
            jlptMetaDataResponse.save(jlptMetaData1);
            return ResponseEntity.ok(BaseResponseDTO.<JLPTMetaData>builder()
                    .statusCode("200")
                    .errorMessage("Success")
                    .build());
        }else {
            throw new NotFoundException("Not found");
        }
    }

    @Override
    public ResponseEntity<BaseResponseDTO<JLPTMetaData>> getById(Long id) {
        try {
          Optional<JLPTMetaData> jlptMetaData =  jlptMetaDataResponse.findById(id);
          JLPTMetaData jlptMetaData1 = jlptMetaData.orElseThrow(() ->
                  new RuntimeException("Exam not found with id " + id));
            return ResponseEntity.ok(BaseResponseDTO.<JLPTMetaData>builder()
                    .statusCode("200")
                    .errorMessage("Success")
                    .Data(jlptMetaData1)
                    .build());
        } catch (Exception e) {
            throw new IllegalArgumentException(e);
        }
    }

    @Override
    public ResponseEntity<BaseResponseDTO<String>> getAudioUrl(Long id) {
        Optional<JLPTMetaData> jlptMetaData = jlptMetaDataResponse.findById(id);
        if (jlptMetaData.isPresent()){
            return ResponseEntity.ok(BaseResponseDTO.<String>builder()
                    .statusCode("200")
                    .errorMessage("Success")
                    .Data(jlptMetaData.get().getAudioUrl())
                    .build());
        }
        return ResponseEntity.ok(BaseResponseDTO.<String>builder()
                .statusCode("400")
                .errorMessage("Not Found")
                .Data(jlptMetaData.get().getAudioUrl())
                .build());
    }

}
