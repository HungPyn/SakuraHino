package com.sakurahino.JLPTservice.service.Impl;

import com.sakurahino.JLPTservice.enums.StatusEnum;
import com.sakurahino.JLPTservice.module.dto.BaseResponseDTO;
import com.sakurahino.JLPTservice.module.dto.request.AddNewExamRequest;
import com.sakurahino.JLPTservice.module.dto.response.GetAudioAndTextReadingResponse;
import com.sakurahino.JLPTservice.module.dto.response.JLPTMetaDataResponseDTO;
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
    public ResponseEntity<BaseResponseDTO<JLPTMetaDataResponseDTO>> add(AddNewExamRequest request) {
        try {
            StatusEnum statusEnum = StatusEnum.valueOf(request.getStatus().toUpperCase());

            // Nếu id tồn tại, lấy entity cũ, ngược lại tạo mới
            JLPTMetaData jlptMetaData = request.getId() != null
                    ? jlptMetaDataResponse.findById(request.getId())
                    .orElseThrow(() -> new IllegalArgumentException("JLPTMetaData not found"))
                    : new JLPTMetaData();

            // Upload file nếu có
            String downloadUrl = request.getFile() != null
                    ? uploadServiceClients.uploadExcel(request.getFile()).getUrlExcelFile()
                    : jlptMetaData.getDownloadUrl();

            // Set các trường
            jlptMetaData.setExamName(request.getExamName());
            jlptMetaData.setTextReading(request.getTextReading());
            jlptMetaData.setAudioUrl(request.getAudioUrl());
            jlptMetaData.setExamTime(request.getExamTime());
            jlptMetaData.setStatus(statusEnum);
            jlptMetaData.setDownloadUrl(downloadUrl);

            if (request.getId() == null) {
                jlptMetaData.setCreateAt(ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")));
            } else {
                jlptMetaData.setModifyAt(ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")));
            }

            JLPTMetaData saved = jlptMetaDataResponse.save(jlptMetaData);

            // Map entity sang DTO để trả API
            JLPTMetaDataResponseDTO dto = JLPTMetaDataResponseDTO.builder()
                    .id(saved.getId())
                    .examName(saved.getExamName())
                    .downloadUrl(saved.getDownloadUrl())
                    .audioUrl(saved.getAudioUrl())
                    .examTime(saved.getExamTime())
                    .textReading(saved.getTextReading())
                    .status(saved.getStatus().name())
                    .build();

            return ResponseEntity.ok(BaseResponseDTO.<JLPTMetaDataResponseDTO>builder()
                    .statusCode("200")
                    .errorMessage("Success")
                    .Data(dto)
                    .build());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(BaseResponseDTO.<JLPTMetaDataResponseDTO>builder()
                    .statusCode("400")
                    .errorMessage(e.getMessage())
                    .Data(null)
                    .build());
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
    public ResponseEntity<BaseResponseDTO<GetAudioAndTextReadingResponse>> getAudioUrl(Long id) {
        Optional<JLPTMetaData> jlptMetaDataOpt = jlptMetaDataResponse.findById(id);

        if (jlptMetaDataOpt.isPresent()) {
            JLPTMetaData jlptMetaData = jlptMetaDataOpt.get();
            GetAudioAndTextReadingResponse response = GetAudioAndTextReadingResponse.builder()
                    .textReading(jlptMetaData.getTextReading())
                    .audioUrl(jlptMetaData.getAudioUrl())
                    .build();

            return ResponseEntity.ok(BaseResponseDTO.<GetAudioAndTextReadingResponse>builder()
                    .statusCode("200")
                    .errorMessage("Success")
                    .Data(response)
                    .build());
        } else {
            return ResponseEntity.ok(BaseResponseDTO.<GetAudioAndTextReadingResponse>builder()
                    .statusCode("400")
                    .errorMessage("Not Found")
                    .Data(null) // hoặc bỏ hẳn Data
                    .build());
        }
    }



}
