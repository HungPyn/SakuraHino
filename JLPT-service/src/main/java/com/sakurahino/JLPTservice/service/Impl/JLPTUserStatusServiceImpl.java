package com.sakurahino.JLPTservice.service.Impl;

import com.sakurahino.JLPTservice.module.dto.BaseResponseDTO;
import com.sakurahino.JLPTservice.module.dto.request.UpdateResultJLPTExamRequest;
import com.sakurahino.JLPTservice.module.dto.response.GetByUserIdResponse;
import com.sakurahino.JLPTservice.module.dto.response.UpdateResultJLPTExamResponse;
import com.sakurahino.JLPTservice.module.entity.JLPTMetaData;
import com.sakurahino.JLPTservice.module.entity.JLPTUserStatus;
import com.sakurahino.JLPTservice.repository.JLPTMetaDataResponse;
import com.sakurahino.JLPTservice.repository.JLPTUserStatusRepository;
import com.sakurahino.JLPTservice.service.JLPTUserStatusService;
import com.sakurahino.common.security.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JLPTUserStatusServiceImpl implements JLPTUserStatusService {
    private final JLPTMetaDataResponse jlptMetaDataResponse;
    private final JLPTUserStatusRepository jlptUserStatusRepository;
    private final AuthHelper authHelper;
    @Override
    public ResponseEntity<BaseResponseDTO<List<GetByUserIdResponse>>> get() {
        String userId = authHelper.getUserId();
        List<JLPTMetaData> exams = jlptMetaDataResponse.findPublishedExamsWithUserStatus(userId);

        List<GetByUserIdResponse> result = exams.stream().map(exam -> {
            JLPTUserStatus statusForUser = exam.getUserStatus().stream()
                    .findFirst()
                    .orElse(null);

            return GetByUserIdResponse.builder()
                    .id(exam.getId())
                    .examName(exam.getExamName())
                    .score(statusForUser == null ? null : statusForUser.getScore())
                    .part1(statusForUser == null ? null : statusForUser.getPart1())
                    .part2(statusForUser == null ? null : statusForUser.getPart2())
                    .part3(statusForUser == null ? null : statusForUser.getPart3())
                    .downloadUrl(exam.getDownloadUrl())
                    .audioUrl(exam.getAudioUrl())
                    .examTime(exam.getExamTime())
                    .status(exam.getStatus())
                    .build();
        }).toList();

        return ResponseEntity.ok(
                BaseResponseDTO.<List<GetByUserIdResponse>>builder()
                        .statusCode("200")
                        .errorMessage("Success")
                        .Data(result)
                        .build()
        );
    }

    @Override
    public ResponseEntity<BaseResponseDTO<UpdateResultJLPTExamResponse>> updateResultExam(UpdateResultJLPTExamRequest request) {
        JLPTUserStatus jlptUserStatus = jlptUserStatusRepository.findByUserIdAndMetaDataId(authHelper.getUserId(), request.getExamId());
        JLPTUserStatus savedStatus;

        if (jlptUserStatus != null) {
            jlptUserStatus.setPart1(request.getPart1());
            jlptUserStatus.setPart2(request.getPart2());
            jlptUserStatus.setPart3(request.getPart3());
            jlptUserStatus.setScore(request.getScore());
            jlptUserStatus.setDayModified(ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")));
            savedStatus = jlptUserStatusRepository.save(jlptUserStatus);
        } else {
            Optional<JLPTMetaData> metaData = jlptMetaDataResponse.findById(request.getExamId());
            JLPTMetaData metaDataEntity = metaData.orElseThrow(() ->
                    new RuntimeException("Exam not found with id " + request.getExamId()));
            JLPTUserStatus newStatus = JLPTUserStatus.builder()
                    .userId(authHelper.getUserId())
                    .metaData(metaDataEntity)
                    .dayCreated(ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")))
                    .part1(request.getPart1())
                    .part2(request.getPart2())
                    .part3(request.getPart3())
                    .score(request.getScore())
                    .build();
            savedStatus = jlptUserStatusRepository.save(newStatus);
        }

        return ResponseEntity.ok(
                BaseResponseDTO.<UpdateResultJLPTExamResponse>builder()
                        .statusCode("200")
                        .errorMessage("Success")
                        .Data(UpdateResultJLPTExamResponse.builder()
                                .examName(savedStatus.getMetaData().getExamName())
                                .part1(savedStatus.getPart1())
                                .part2(savedStatus.getPart2())
                                .part3(savedStatus.getPart3())
                                .score(savedStatus.getScore())
                                .build())
                        .build()
        );
    }

    @Override
    public ResponseEntity<BaseResponseDTO<UpdateResultJLPTExamResponse>> result(Long id) {
        JLPTUserStatus userStatus = jlptUserStatusRepository.findByUserIdAndMetaDataId(authHelper.getUserId(), id);

        if (userStatus == null) {
            return ResponseEntity.ok(
                    BaseResponseDTO.<UpdateResultJLPTExamResponse>builder()
                            .statusCode("200")
                            .errorMessage("User has not taken this exam yet")
                            .Data(null)
                            .build()
            );
        }

        return ResponseEntity.ok(
                BaseResponseDTO.<UpdateResultJLPTExamResponse>builder()
                        .statusCode("200")
                        .errorMessage("Success")
                        .Data(UpdateResultJLPTExamResponse.builder()
                                .examName(userStatus.getMetaData().getExamName())
                                .part1(userStatus.getPart1())
                                .part2(userStatus.getPart2())
                                .part3(userStatus.getPart3())
                                .score(userStatus.getScore())
                                .build())
                        .build()
        );
    }



}
