package com.example.resultservice.service.impl;

import com.example.resultservice.clients.LessonServiceClient;
import com.example.resultservice.dto.ResultRequestDto;
import com.example.resultservice.dto.ResultResponseDto;
import com.example.resultservice.dto.ResultResponseExamDto;
import com.example.resultservice.dto.ResultResponseLessonDto;
import com.example.resultservice.entity.Result;
import com.example.resultservice.repository.ResultRepository;
import com.example.resultservice.service.ResultService;

import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.ex.ResourceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {
    private final ResultRepository resultRepository;

    private final LessonServiceClient lessonServiceClient;

    @Override
    public ResultResponseExamDto getResultExamByUser(Integer toppicId, UUID userId) {
        if (toppicId == null || userId == null) {
            throw new ResourceException(ExceptionCode.KHONG_CO_DU_LIEU_TRUYEN_VAO.getStatus(), "thiếu toppic: " + toppicId + "hoặc userId: " + userId);
        }
        Optional<Result> resultExamOptional = resultRepository.findResultByToppicIdAndUserId(toppicId, userId);
        if (resultExamOptional.isEmpty()) {
            throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Không tìm thấy kết quả bài kiểm tra");
        }
        Result examResult = resultExamOptional.get();

        ResultResponseExamDto examDto = ResultResponseExamDto.builder()
                .id(examResult.getId())
                .userId(examResult.getUserId())
                .toppicId(examResult.getToppicId())
                .startDatetime(examResult.getStartDatetime())
                .endDatetime(examResult.getEndDatetime())
                .studyTime(examResult.getStudyTime())
                .correctAnswers(examResult.getCorrectAnswers())
                .totalQuestions(examResult.getTotalQuestions())
                .scorePercent(examResult.getScorePercent())
                .isComplete(examResult.getIsComplete())
                .build();

        if(examDto.getScorePercent().intValue()<100){
            examDto.setIsComplete(false);
        }

        return examDto;

    }

    @Override
    public ResultResponseLessonDto getResuleLessonByUser(Integer LessonId, UUID userId) {
        if (LessonId == null || userId == null) {
            throw new ResourceException(ExceptionCode.KHONG_CO_DU_LIEU_TRUYEN_VAO.getStatus(), "thiếu toppic: " + LessonId + "hoặc userId: " + userId);
        }
        Optional<Result> resultExamOptional = resultRepository.findResultByLessonIdAndUserId(LessonId, userId);
        if (resultExamOptional.isEmpty()) {
            throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Không tìm thấy kết quả bài học");
        }
        Result examResult = resultExamOptional.get();

        ResultResponseLessonDto lessonDto = ResultResponseLessonDto.builder()
                .id(examResult.getId())
                .userId(examResult.getUserId())
                .lessonId(examResult.getLessonId())
                .startDatetime(examResult.getStartDatetime())
                .endDatetime(examResult.getEndDatetime())
                .studyTime(examResult.getStudyTime())
                .correctAnswers(examResult.getCorrectAnswers())
                .totalQuestions(examResult.getTotalQuestions())
                .scorePercent(examResult.getScorePercent())
                .isComplete(examResult.getIsComplete())
                .build();


        if(lessonDto.getScorePercent().intValue()<100){
            lessonDto.setIsComplete(false);
        }

        return lessonDto;
    }

    @Override
    public void deleteResult(Integer id) {
        Result resultOptional = resultRepository.findById(id)
                .orElseThrow(() -> new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Kết quả không tồn tại"));
        resultRepository.deleteById(resultOptional.getId());
    }

    @Override
    public ResultResponseDto saveResult(ResultRequestDto resultRequestDto) {
        Integer toppicId = resultRequestDto.getToppicId();
        Integer lessonId = resultRequestDto.getLessonId();
        UUID userId = resultRequestDto.getUserId();

        if ((toppicId == null && lessonId == null) || (toppicId != null && lessonId != null)) {
            throw new ResourceException(ExceptionCode.KHONG_CO_DU_LIEU_TRUYEN_VAO.getStatus(), "Chỉ truyền lên toppic hoặc lesson");
        }

        //  Bổ sung kiểm tra user tồn tại không (nếu có userServiceClient)
        // if (userServiceClient != null && !userServiceClient.isUser(userId)) {
        //    throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "User không tồn tại (id): " + userId);
        // }

        Optional<Result> existingResultOptional;

        if (toppicId != null) {
            // Sau bổ sung kiểm tra toppic tồn tại không (nếu có topicServiceClient)
            // if (!topicServiceClient.isTopic(toppicId)) {
            //     throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Topic không tồn tại (id): " + toppicId);
            // }
            existingResultOptional = resultRepository.findResultByToppicIdAndUserId( toppicId,userId);
        } else {
            if (!lessonServiceClient.isLesson(lessonId)) {
                throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Lesson không tồn tại (id): " + lessonId);
            }
            existingResultOptional = resultRepository.findResultByLessonIdAndUserId( lessonId,userId);
        }

        Result resultToSave; // Biến để giữ đối tượng Result cuối cùng cần lưu

        if (existingResultOptional.isPresent()) {
            Result existingResult = existingResultOptional.get();
            // So sánh điểm số: Chỉ cập nhật nếu điểm mới cao hơn
            if (resultRequestDto.getScorePercent().compareTo(existingResult.getScorePercent()) > 0) {
                resultToSave = existingResult;
                // Cập nhật các thuộc tính của entity
                resultToSave.setUserId(userId);
                resultToSave.setToppicId(toppicId);
                resultToSave.setLessonId(lessonId);
                resultToSave.setStartDatetime(resultRequestDto.getStartDatetime());
                resultToSave.setEndDatetime(resultRequestDto.getEndDatetime());
                resultToSave.setStudyTime(resultRequestDto.getStudyTime());
                resultToSave.setCorrectAnswers(resultRequestDto.getCorrectAnswers());
                resultToSave.setTotalQuestions(resultRequestDto.getTotalQuestions());
                resultToSave.setScorePercent(resultRequestDto.getScorePercent());

                if (resultRequestDto.getScorePercent() != null && resultRequestDto.getScorePercent().intValue() >= 100) {
                    resultToSave.setIsComplete(true);
                } else {
                    resultToSave.setIsComplete(false); // Đảm bảo gán false nếu không đủ điều kiện
                }

            } else {
                return ResultResponseDto.builder()
                        .id(existingResult.getId())
                        .userId(existingResult.getUserId())
                        .toppicId(existingResult.getToppicId())
                        .lessonId(existingResult.getLessonId())
                        .startDatetime(existingResult.getStartDatetime())
                        .endDatetime(existingResult.getEndDatetime())
                        .studyTime(existingResult.getStudyTime())
                        .correctAnswers(existingResult.getCorrectAnswers())
                        .totalQuestions(existingResult.getTotalQuestions())
                        .scorePercent(existingResult.getScorePercent())
                        .isComplete(existingResult.getIsComplete())
                        .build();
            }
        } else {
            Boolean isCompleteForNewResult = false; // Mặc định là false
            if (resultRequestDto.getScorePercent() != null && resultRequestDto.getScorePercent().intValue() >= 100) {
                isCompleteForNewResult = true;
            }
            // KHÔNG tìm thấy bản ghi cũ tạo mới
            resultToSave = Result.builder()
                    .userId(userId)
                    .toppicId(toppicId)
                    .lessonId(lessonId)
                    .startDatetime(resultRequestDto.getStartDatetime())
                    .endDatetime(resultRequestDto.getEndDatetime())
                    .studyTime(resultRequestDto.getStudyTime())
                    .correctAnswers(resultRequestDto.getCorrectAnswers())
                    .totalQuestions(resultRequestDto.getTotalQuestions())
                    .scorePercent(resultRequestDto.getScorePercent())
                    .isComplete(isCompleteForNewResult)
                    .isComplete(isCompleteForNewResult)
                    .build();
        }

        Result savedResult = resultRepository.save(resultToSave);


        return ResultResponseDto.builder()
                .id(savedResult.getId())
                .userId(savedResult.getUserId())
                .toppicId(savedResult.getToppicId())
                .lessonId(savedResult.getLessonId())
                .startDatetime(savedResult.getStartDatetime())
                .endDatetime(savedResult.getEndDatetime())
                .studyTime(savedResult.getStudyTime())
                .correctAnswers(savedResult.getCorrectAnswers())
                .totalQuestions(savedResult.getTotalQuestions())
                .scorePercent(savedResult.getScorePercent())
                .isComplete(savedResult.getIsComplete())
                .build();
    }

    @Override
    public ResultResponseExamDto getResultExamByUserForFeign(Integer toppicId, UUID userId) {
        if (toppicId == null || userId == null) {
            ResultResponseExamDto examDto = new ResultResponseExamDto();
            return examDto;
        }

        Optional<Result> resultExamOptional = resultRepository.findResultByToppicIdAndUserId(toppicId, userId);
        if (resultExamOptional.isEmpty()) {
            ResultResponseExamDto examDto = new ResultResponseExamDto();
            return examDto;
        }
        Result examResult = resultExamOptional.get();

        ResultResponseExamDto examDto = ResultResponseExamDto.builder()
                .id(examResult.getId())
                .userId(examResult.getUserId())
                .toppicId(examResult.getToppicId())
                .startDatetime(examResult.getStartDatetime())
                .endDatetime(examResult.getEndDatetime())
                .studyTime(examResult.getStudyTime())
                .correctAnswers(examResult.getCorrectAnswers())
                .totalQuestions(examResult.getTotalQuestions())
                .scorePercent(examResult.getScorePercent())
                .isComplete(examResult.getIsComplete())
                .build();

        if(examDto.getScorePercent().intValue()<100){
            examDto.setIsComplete(false);
        }

        return examDto;

    }

    @Override
    public ResultResponseLessonDto getResuleLessonByUserForFeign(Integer LessonId, UUID userId) {
        if (LessonId == null || userId == null) {
            ResultResponseLessonDto lessonDto = new ResultResponseLessonDto();
            return lessonDto;
                }
        Optional<Result> resultExamOptional = resultRepository.findResultByLessonIdAndUserId(LessonId, userId);
        if (resultExamOptional.isEmpty()) {
            ResultResponseLessonDto lessonDto = new ResultResponseLessonDto();
            return lessonDto;        }
        Result examResult = resultExamOptional.get();

        ResultResponseLessonDto lessonDto = ResultResponseLessonDto.builder()
                .id(examResult.getId())
                .userId(examResult.getUserId())
                .lessonId(examResult.getLessonId())
                .startDatetime(examResult.getStartDatetime())
                .endDatetime(examResult.getEndDatetime())
                .studyTime(examResult.getStudyTime())
                .correctAnswers(examResult.getCorrectAnswers())
                .totalQuestions(examResult.getTotalQuestions())
                .scorePercent(examResult.getScorePercent())
                .isComplete(examResult.getIsComplete())
                .build();


        if(lessonDto.getScorePercent().intValue()<100){
            lessonDto.setIsComplete(false);
        }

        return lessonDto;
    }

}



