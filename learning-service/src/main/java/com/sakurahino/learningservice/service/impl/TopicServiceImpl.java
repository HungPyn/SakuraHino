package com.sakurahino.learningservice.service.impl;

import com.sakurahino.clients.feign.UploadServiceClients;
import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.util.FileUtils;
import com.sakurahino.learningservice.dto.LessonResponse;
import com.sakurahino.learningservice.dto.TopicRequest;
import com.sakurahino.learningservice.dto.TopicResponse;
import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.mapper.LessonMapper;
import com.sakurahino.learningservice.mapper.TopicServiceMapper;
import com.sakurahino.learningservice.repository.LessonRepository;
import com.sakurahino.learningservice.repository.TopicRepository;
import com.sakurahino.learningservice.service.TopicService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final UploadServiceClients uploadServiceClients;
    private final TopicServiceMapper topicServiceMapper;
    private final LessonRepository lessonRepository;
    private final LessonMapper lessonMapper;

    @Override
    public PaginatedResponse<TopicResponse> getAllForUser(int page, int size, String userIdString) {
        UUID userId = UUID.fromString(userIdString);
        System.out.println("user id là :--------- "+userId);

        Pageable pageable = PageRequest.of(page, size);
        Page<Topic> topicPage;

        topicPage = topicRepository.findAll(pageable);

        List<TopicResponse> responseList = topicPage.getContent().stream()
                .map(topicServiceMapper::maptoTopicResponse)
                .toList();
        //tim lesson
        responseList.forEach(topicResponse -> {
            List<LessonResponse> lessonResponses =
                    lessonRepository.findLessonsWithUserCompletionStatusByTopicIdAndUserId(topicResponse.getId(),userId);

//            List<LessonResponse> lessonResponses = lessonMapper.mapLessonListToResponseList(lessons);

            boolean allComplete = true;
            for (LessonResponse lessonResponse : lessonResponses) {
                if (!lessonResponse.getComplete()) {
                    allComplete = false;
                    break; // không cần kiểm tra tiếp
                }
            }
            topicResponse.setComplete(allComplete);
            topicResponse.setLessons(lessonResponses);
        });

//        if (!responseList.isEmpty()) {
//            responseList.get(0).setComplete(true); // Set true cho topic đầu tiên của trang hiện tại
//        }

        return new PaginatedResponse<>(
                responseList,                          // items
                topicPage.getNumber(),                 // page
                (int) topicPage.getTotalElements(),    // totalItems (cast từ long → int)
                topicPage.getTotalPages(),             // totalPages
                topicPage.hasNext()                    // hasNext
        );
    }

    @Override
    public PaginatedResponse<TopicResponse> getAllForAdmin(int page, int size) {
        // Có thể giống như getAllForUser nếu logic phân biệt quyền nằm ở controller
        Pageable pageable = PageRequest.of(page, size);
        Page<Topic> topicPage;
        topicPage = topicRepository.findTopicsByOrderByCreateAtDesc(pageable);


        List<TopicResponse> responseList = topicPage.getContent().stream()
                .map(topicServiceMapper::maptoTopicResponse)
                .toList();

        return new PaginatedResponse<>(
                responseList,                          // items
                topicPage.getNumber(),                 // page
                (int) topicPage.getTotalElements(),    // totalItems (cast từ long → int)
                topicPage.getTotalPages(),             // totalPages
                topicPage.hasNext()                    // hasNext
        );
    }


    @Override
    @Transactional
    public TopicResponse create(TopicRequest dto, MultipartFile file) {
        log.info("Bắt đầu tạo chủ đề: {}", dto.getName());

        String urlImage = uploadServiceClients.uploadFile(file).getUrlImage();
        var response = uploadServiceClients.uploadFile(file);
        log.info("Upload response từ Feign: {}", response);
        log.info("urlImage = {}", response.getUrlImage());
        log.debug("Ảnh đã upload thành công, url: {}", urlImage);


        Topic topic = new Topic();
        topic.setUrlImage(urlImage);
        topic.setCreateAt(Instant.now());
        topic.setName(dto.getName());

        topicRepository.save(topic);
        log.info("Chủ đề đã được tạo thành công với id = {}", topic.getId());

        return topicServiceMapper.maptoTopicResponse(topic);
    }

    @Override
    @Transactional
    public TopicResponse update(Integer id, TopicRequest dto, MultipartFile file) {
        log.info("Bắt đầu cập nhật chủ đề: {}", id);
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Chủ đề không tồn tại: {}", id);
                    return new AppException(ExceptionCode.CHU_DE_KHONG_TON_TAI);
                });


        if (file != null && !file.isEmpty()) {
            String oldUrl = topic.getUrlImage();
            String oldObjectName = FileUtils.extractObjectName(oldUrl);
            log.debug("Xóa ảnh cũ: {}", oldObjectName);
            uploadServiceClients.deleteFile(oldObjectName);

            String newUrlImage = uploadServiceClients.uploadFile(file).getUrlImage();
            topic.setUrlImage(newUrlImage);
            log.debug("Upload ảnh mới thành công: {}", newUrlImage);
        }

        topic.setName(dto.getName());

        topicRepository.save(topic);
        log.info("Cập nhật chủ đề thành công: {}", id);

        return topicServiceMapper.maptoTopicResponse(topic);
    }

    @Override
    public TopicResponse getById(Integer id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Không tìm thấy chủ đề để xóa: {}", id);
                    return new AppException(ExceptionCode.CHU_DE_KHONG_TON_TAI);
                });
        return topicServiceMapper.maptoTopicResponse(topic);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        log.info("Bắt đầu xóa chủ đề: {}", id);

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Không tìm thấy chủ đề để xóa: {}", id);
                    return new AppException(ExceptionCode.CHU_DE_KHONG_TON_TAI);
                });

        String objectName = FileUtils.extractObjectName(topic.getUrlImage());
        uploadServiceClients.deleteFile(objectName);
        log.debug("Đã xóa ảnh khỏi firebase: {}", objectName);

        topicRepository.delete(topic);
        log.info("Đã xóa chủ đề thành công: {}", id);
    }
}
