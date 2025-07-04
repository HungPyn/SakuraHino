package com.sakurahino.topicservice.service.impl;

import com.sakurahino.clients.feign.UploadServiceClients;
import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.util.FileUtils;
import com.sakurahino.topicservice.dto.TopicRequest;
import com.sakurahino.topicservice.dto.TopicResponse;
import com.sakurahino.topicservice.entity.Level;
import com.sakurahino.topicservice.entity.Topic;
import com.sakurahino.topicservice.mapper.TopicServiceMapper;
import com.sakurahino.topicservice.repository.LevelRepository;
import com.sakurahino.topicservice.repository.TopicRepository;
import com.sakurahino.topicservice.service.TopicService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final LevelRepository levelRepository;
    private final UploadServiceClients uploadServiceClients;
    private final TopicServiceMapper topicServiceMapper;

    @Override
    public PaginatedResponse<TopicResponse> getAllForUser(Integer levelId, int page, int size) {
        return null;
    }

    @Override
    public PaginatedResponse<TopicResponse> getAllForAdmin(Integer levelId, int page, int size) {
        return null;
    }

    @Override
    @Transactional
    public TopicResponse create(TopicRequest dto, MultipartFile file) {
        log.info("Bắt đầu tạo chủ đề: {}", dto.getName());

        String urlImage = uploadServiceClients.uploadFile(file).getUrlImage();
        log.debug("Ảnh đã upload thành công, url: {}", urlImage);

        Level level = levelRepository.findById(dto.getLevelId())
                .orElseThrow(() -> {
                    log.warn("Level không tồn tại: {}", dto.getLevelId());
                    return new AppException(ExceptionCode.LEVEL_KHONG_TON_TAI);
                });

        Topic topic = new Topic();
        topic.setLevel(level);
        topic.setUrlImage(urlImage);
        topic.setCreateAt(Instant.now());
        topic.setName(dto.getName());

        topicRepository.save(topic);
        log.info("Chủ đề đã được tạo thành công với id = {}", topic.getId());

        return topicServiceMapper.maptoTopicResponse(topic);
    }

    @Override
    @Transactional
    public TopicResponse update(String id, TopicRequest dto, MultipartFile file) {
        log.info("Bắt đầu cập nhật chủ đề: {}", id);

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Chủ đề không tồn tại: {}", id);
                    return new AppException(ExceptionCode.CHU_DE_KHONG_TON_TAI);
                });

        Level level = levelRepository.findById(dto.getLevelId())
                .orElseThrow(() -> {
                    log.warn("Level không tồn tại: {}", dto.getLevelId());
                    return new AppException(ExceptionCode.LEVEL_KHONG_TON_TAI);
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
        topic.setLevel(level);

        topicRepository.save(topic);
        log.info("Cập nhật chủ đề thành công: {}", id);

        return topicServiceMapper.maptoTopicResponse(topic);
    }

    @Override
    public TopicResponse getById(String id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Không tìm thấy chủ đề để xóa: {}", id);
                    return new AppException(ExceptionCode.CHU_DE_KHONG_TON_TAI);
                });
        return topicServiceMapper.maptoTopicResponse(topic);
    }

    @Override
    @Transactional
    public void delete(String id) {
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
