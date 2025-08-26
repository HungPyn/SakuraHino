package com.sakurahino.learningservice.service.impl;

import com.sakurahino.clients.feign.UploadServiceClients;
import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.util.FileUtils;
import com.sakurahino.learningservice.dto.topic.StatusResponseDTO;
import com.sakurahino.learningservice.dto.topic.TopicRequestDTO;
import com.sakurahino.learningservice.dto.topic.TopicResponseDTO;
import com.sakurahino.learningservice.entity.Level;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.mapper.TopicServiceMapper;
import com.sakurahino.learningservice.repository.LevelRepository;
import com.sakurahino.learningservice.repository.TopicRepository;
import com.sakurahino.learningservice.service.TopicService;
import com.sakurahino.learningservice.service.UserTopicStatusService;
import com.sakurahino.common.util.TimeUtils;
import com.sakurahino.learningservice.utils.valid.ValidUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final UploadServiceClients uploadServiceClients;
    private final TopicServiceMapper topicServiceMapper;
    private final LevelRepository levelRepository;
    private final UserTopicStatusService userTopicStatusService;

    // cái này để lấy ra status cho front dùng
    @Override
    public List<StatusResponseDTO> getStatus() {
        List<StatusResponseDTO> statusResponseDTOList = new ArrayList<>();
        for (LearningStatus status : LearningStatus.values()) {
            statusResponseDTOList.add(new StatusResponseDTO(status));
        }
        return statusResponseDTOList;
    }

    @Override
    public PaginatedResponse<TopicResponseDTO> findByFilters(int page, int size, String tuKhoa, Integer levelId, ZonedDateTime startDdate, ZonedDateTime endDate, String status) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Topic> topicPage;
        LearningStatus learningStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                learningStatus = LearningStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Tùy chọn: bạn có thể xử lý lỗi ở đây, ví dụ như log lại
                // System.err.println("Giá trị status không hợp lệ: " + status);
            }
        }
        topicPage = topicRepository.findByFilters(tuKhoa,levelId,learningStatus,startDdate,endDate,pageable);
        List<TopicResponseDTO> responseList = topicPage.getContent().stream()
                .map(topicServiceMapper::mapToTopicResponse)
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
    public PaginatedResponse<TopicResponseDTO> getAllForAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Topic> topicPage;
        topicPage = topicRepository.findAllByOrderByCreateAtDesc(pageable);


        List<TopicResponseDTO> responseList = topicPage.getContent().stream()
                .map(topicServiceMapper::mapToTopicResponse)
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
    public TopicResponseDTO create(TopicRequestDTO dto, MultipartFile file) {
        log.info("Bắt đầu tạo chủ đề: {}", dto.getName());
        Level level = levelRepository.findById(dto.getLevelId())
                .orElseThrow(() -> new AppException(ExceptionCode.LEVEL_KHONG_TON_TAI));
        if (topicRepository.existsByNameIgnoreCase(ValidUtils.normalizeForCompare(dto.getName()))){
            throw new AppException(ExceptionCode.TOPIC_NAME_FOUND);
        }
        if (file.isEmpty()) {
            throw new AppException(ExceptionCode.FILE_NOT_NULL);
        }
        var response = uploadServiceClients.uploadFile(file);
        log.info("Upload response từ Feign: {}", response);
        log.info("urlImage = {}", response.getUrlImage());
        log.debug("Ảnh đã upload thành công, url: {}", response.getUrlImage());

        Integer maxPosition =topicRepository.findMaxPosition();
        int newPosition =(maxPosition ==null) ? 1 : maxPosition + 1;

        String code;
        do {
            code = RandomStringUtils.randomNumeric(6);
        } while (topicRepository.existsByCode(code));
        ZonedDateTime createAt = TimeUtils.nowVn();
        Topic topic = new Topic();
        topic.setUrlImage(response.getUrlImage());
        topic.setCreateAt(createAt);
        topic.setName(dto.getName());
        topic.setLevel(level);
        topic.setPosition(newPosition);
        topic.setMaxLesson(dto.getMaxLesson());
        topic.setStatus(dto.getStatus());
        topic.setCode(code);

        topicRepository.save(topic);
        log.info("Chủ đề đã được tạo thành công với id = {}", topic.getId());

        if (topic.getStatus()== LearningStatus.PUBLISHED){
            userTopicStatusService.unlockNewlyPublishedTopicForUsers(topic.getId());
        }
        return topicServiceMapper.mapToTopicResponse(topic);

    }

    @Override
    @Transactional
    public TopicResponseDTO update(Integer id, TopicRequestDTO dto, MultipartFile file) {
        log.info("Bắt đầu cập nhập chủ đề: {}", id);
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Chủ đề không tồn tại: {}", id);
                    return new AppException(ExceptionCode.CHU_DE_KHONG_TON_TAI);
                });
        if (topicRepository.existsByNameIgnoreCaseAndIdNot(ValidUtils.normalizeForCompare(dto.getName()),topic.getId())) {
            throw new AppException(ExceptionCode.TOPIC_NAME_FOUND);
        }
        if (file != null && !file.isEmpty()) {
            try {
                // Upload file mới
                String newUrlImage = uploadServiceClients.uploadFile(file).getUrlImage();

                // Log giá trị URL trả về
                log.info("URL ảnh mới trả về từ upload-service: {}", newUrlImage);

                // Nếu đã có ảnh cũ, xóa ảnh cũ
                String oldUrl = topic.getUrlImage();
                System.out.println(oldUrl);
                if (oldUrl != null && !oldUrl.isEmpty() && !oldUrl.equals(newUrlImage)) {
                    String oldObjectName = FileUtils.extractObjectName(oldUrl);
                    System.out.println("objectName = " + oldObjectName);
                    log.debug("Xóa ảnh cũ: {}", oldObjectName);
                    try {
                        uploadServiceClients.deleteFile(oldObjectName);
                    } catch (Exception e) {
                        log.warn("Xóa ảnh cũ thất bại: {}", e.getMessage());
                    }
                }

                topic.setUrlImage(newUrlImage);
                log.debug("Upload ảnh mới thành công: {}", newUrlImage);

            } catch (Exception e) {
                log.error("Upload ảnh thất bại: {}", e.getMessage());
            }
        }
        ZonedDateTime updateAt = TimeUtils.nowVn();
        topic.setName(dto.getName());
        topic.setUpdateAt(updateAt);
        topic.setMaxLesson(dto.getMaxLesson());
        topic.setStatus(dto.getStatus());

        topicRepository.save(topic);
        log.info("Cập nhập chủ đề thành công: {}", id);
        if (topic.getStatus().equals(LearningStatus.PUBLISHED)) {
            userTopicStatusService.unlockNewlyPublishedTopicForUsers(topic.getId());
            log.info("Cập nhập unlock thành công cho các user");
        }
        return topicServiceMapper.mapToTopicResponse(topic);
    }

    @Override
    public TopicResponseDTO getById(Integer id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Không tìm thấy chủ đề để xóa: {}", id);
                    return new AppException(ExceptionCode.CHU_DE_KHONG_TON_TAI);
                });
        return topicServiceMapper.mapToTopicResponse(topic);
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
        topic.setStatus(LearningStatus.DELETED);
        topicRepository.save(topic);
    }
}
