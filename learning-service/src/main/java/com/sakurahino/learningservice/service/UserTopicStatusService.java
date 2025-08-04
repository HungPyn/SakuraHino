package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.lesson.LessonWithStatusDTO;
import com.sakurahino.learningservice.dto.topic.TopicWithStatusDTO;
import com.sakurahino.learningservice.entity.Topic;

import java.util.List;

public interface UserTopicStatusService {

    // hàm này để mở topic chuyển trạng thái về UNLOCKED khi cp nhập topic sang PUBLISHED nếu nó  giữa
    void unlockNewlyPublishedTopicForUsers(Integer topicId);


    List<TopicWithStatusDTO> findTopicsWithStatusByUser();
}
