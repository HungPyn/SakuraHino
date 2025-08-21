package com.sakurahino.learningservice.service;

import com.sakurahino.learningservice.dto.topic.TopicWithStatusDTO;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.enums.ProgressStatus;

import java.util.List;

public interface UserTopicStatusService {

    // hàm này để mở topic chuyển trạng thái về UNLOCKED khi cp nhập topic sang PUBLISHED nếu nó  giữa
    void unlockNewlyPublishedTopicForUsers(Integer topicId);


    List<TopicWithStatusDTO> findTopicsWithStatusByUser();

    void updateTopicStatusAndUnlockNext(String userId, Topic currentTopic, ProgressStatus newStatus);

    // hàm này là dùng để unlocked topic người dùng mới khi làm bài test
    void createTopicForUserAfterTest(Integer correctQuestion);

}
