package com.sakurahino.learningservice.service.impl;

import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.ex.ResourceException;
import com.sakurahino.learningservice.dto.lesson.LessonRequestDTO;
import com.sakurahino.learningservice.dto.lesson.LessonResponseDTO;
import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.mapper.LessonMapper;
import com.sakurahino.learningservice.repository.LessonRepository;
import com.sakurahino.learningservice.repository.TopicRepository;
import com.sakurahino.learningservice.service.LessonService;
import com.sakurahino.learningservice.service.UserLessonStatusService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class LessonServiceImpl implements LessonService {
    private final LessonRepository lessonRepository;
    private final TopicRepository topicRepository;
    private final UserLessonStatusService userLessonStatusService;
    private final LessonMapper lessonMapper;

    @Override
    public PaginatedResponse<LessonResponseDTO> getLessonByTopicIdAdmin(Integer topicId, int page, int size) {
       Pageable pageable = PageRequest.of(page, size);
       Page<Lesson> lessonPage;
       lessonPage = lessonRepository.findAllByTopic_IdOrderByCreatedAtDesc(topicId,pageable);
        List<LessonResponseDTO> responseList = lessonPage.getContent().stream()
                .map(lessonMapper::mapToLessonResponse).toList();
        return new PaginatedResponse<>(
                responseList,
                lessonPage.getNumber(),
                (int) lessonPage.getTotalElements(),
                lessonPage.getTotalPages(),
                lessonPage.hasNext()
        );
    }

    @Override
    public PaginatedResponse<LessonResponseDTO> findByFilters(String tuKhoa, Integer topicId, String status, Instant startDate, Instant endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Lesson> lessonPage;
        LearningStatus learningStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                learningStatus = LearningStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Tùy chọn: bạn có thể xử lý lỗi ở đây, ví dụ như log lại
                // System.err.println("Giá trị status không hợp lệ: " + status);
            }
        }
        lessonPage = lessonRepository.findByFilters(tuKhoa,topicId,learningStatus,startDate,endDate,pageable);
        List<LessonResponseDTO> responseList = lessonPage.getContent().stream()
                .map(lessonMapper::mapToLessonResponse).toList();
        return new PaginatedResponse<>(
                responseList,
                lessonPage.getNumber(),
                (int) lessonPage.getTotalElements(),
                lessonPage.getTotalPages(),
                lessonPage.hasNext()
        );
    }

    @Override
    public LessonResponseDTO getLessonById(Integer id) {
        Lesson lesson = lessonRepository.findById(id).orElseThrow(()->
                new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Lesson không tồn tại"));
        return  lessonMapper.mapToLessonResponse(lesson);
    }

    @Override
    public LessonResponseDTO create(LessonRequestDTO lessonRequest) {
        log.info("Bắt đầu tạo bài học mới cho topicId = {}", lessonRequest.getTopicId());

        Topic topic = topicRepository.findById(lessonRequest.getTopicId())
                .orElseThrow(() -> {
                    log.error("Không tìm thấy chủ đề với id = {}", lessonRequest.getTopicId());
                    return new AppException(ExceptionCode.CHU_DE_KHONG_TON_TAI);
                });

        log.info("Chủ đề tìm thấy: name = {}, maxLesson = {}, status = {}",
                topic.getName(), topic.getMaxLesson(), topic.getStatus());

        long publishedLessonCount = lessonRepository.countByTopicIdAndStatus(
                topic.getId(),
                LearningStatus.PUBLISHED
        );
        log.debug("Số lượng bài học PUBLISHED hiện tại của topic {} = {}", topic.getId(), publishedLessonCount);

        if (lessonRequest.getStatus() == LearningStatus.PUBLISHED &&
                publishedLessonCount >= topic.getMaxLesson()) {
            log.warn("Không thể cập nhập bài học PUBLISHED. Đã đạt giới hạn {} bài public cho topic {}",
                    topic.getMaxLesson(), topic.getId());
            throw new AppException(ExceptionCode.MAX_PUBLIC_LESSON_REACHED);
        }

        if (lessonRepository.existsByLessonNameAndTopicId(lessonRequest.getLessonName(), topic.getId())) {
            log.warn("Bài học với tên '{}' đã tồn tại trong topic {}", lessonRequest.getLessonName(), topic.getId());
            throw new AppException(ExceptionCode.LESSON_DA_TON_TAI);
        }

        Integer maxPosition = lessonRepository.findMaxPositionByTopicId(topic.getId());
        int newPosition = (maxPosition == null) ? 1 : maxPosition + 1;
        log.debug("Max position hiện tại = {}, position mới sẽ là {}", maxPosition, newPosition);

        String code;
        do {
            code = RandomStringUtils.randomNumeric(6);
        } while (lessonRepository.existsByCode(code));
        log.debug("Code mới được tạo: {}", code);

        Lesson lesson = new Lesson();
        lesson.setTopic(topic);
        lesson.setCreatedAt(Instant.now());
        lesson.setLessonName(lessonRequest.getLessonName());
        lesson.setStatus(lessonRequest.getStatus());
        lesson.setPosition(newPosition);
        lesson.setMaxQuestions(lessonRequest.getMaxQuestions());
        lesson.setCode(code);

        lessonRepository.save(lesson);
        log.info("Bài học mới đã được tạo thành công với id = {}, name = {}", lesson.getId(), lesson.getLessonName());

        return lessonMapper.mapToLessonResponse(lesson);
    }


    @Override
    public LessonResponseDTO update(Integer id, LessonRequestDTO lessonRequest) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new AppException(ExceptionCode.LESSON_KHONG_TON_TAI));

        Topic topic = lesson.getTopic();
        boolean isChangingToPublished = lesson.getStatus() != LearningStatus.PUBLISHED
                && lessonRequest.getStatus() == LearningStatus.PUBLISHED;

        if (isChangingToPublished) {
            long publishedCount = lessonRepository.countByTopicIdAndStatus(topic.getId(), LearningStatus.PUBLISHED);
            if (publishedCount >= topic.getMaxLesson()) {
                log.warn("[LESSON_UPDATE] Vượt quá số lượng bài học PUBLISHED cho topicId={}", topic.getId());
                throw new AppException(ExceptionCode.MAX_PUBLIC_LESSON_REACHED);
            }
        }

        if (!lesson.getLessonName().equals(lessonRequest.getLessonName()) &&
                lessonRepository.existsByLessonNameAndTopicId(lessonRequest.getLessonName(), topic.getId())) {
            log.warn("[LESSON_UPDATE] Tên bài học '{}' đã tồn tại trong topicId={}", lessonRequest.getLessonName(), topic.getId());
            throw new AppException(ExceptionCode.LESSON_DA_TON_TAI);
        }

        lesson.setLessonName(lessonRequest.getLessonName());
        lesson.setStatus(lessonRequest.getStatus());
        lesson.setUpdateAt(Instant.now());
        lesson.setMaxQuestions(lessonRequest.getMaxQuestions());
        lessonRepository.save(lesson);

        log.info("[LESSON_UPDATE] Cập nhật thành công lessonId={}, name='{}', status={}",
                lesson.getId(), lesson.getLessonName(), lesson.getStatus());

        if (isChangingToPublished) {
            log.info("Bài học [{} - {}] được chuyển sang trạng thái PUBLIC. Bắt đầu mở khóa cho người dùng.", lesson.getId(), lesson.getLessonName());

            userLessonStatusService.unlockNewlyPublishedLessonForUsers(lesson.getId());

            log.info("Đã gọi xong hàm unlockNewlyPublishedLessonForUsers cho bài học [{}]", lesson.getId());
        }

        return lessonMapper.mapToLessonResponse(lesson);
    }


    @Override
    public void delete(Integer id) {
        Lesson lesson = lessonRepository.findById(id).orElseThrow(() -> {
            log.warn("Không tìm thấy bài học với id = {}", id);
            return new AppException(ExceptionCode.LESSON_KHONG_TON_TAI);
        });

        lesson.setStatus(LearningStatus.DELETED);
        lessonRepository.save(lesson);

        log.info("Đã đặt trạng thái DELETED cho bài học id = {}, tên = {}", lesson.getId(), lesson.getLessonName());
    }
}
