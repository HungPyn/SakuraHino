package com.sakurahino.learningservice.repository.custom;

import com.sakurahino.learningservice.dto.topic.TopicWithStatusDTO;
import com.sakurahino.learningservice.entity.UserTopicStatus;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface UserStatusTopicRepositoryCustom {

    List<String> findUserIdsToUnlockTopic(@Param("position")int currentPosition, @Param("topicId") Integer topicId);

    // lấy user để cho creat topic dùng
    List<String> findUserIdsToUnlockTopicByPassedPreviousTopic(@Param("Integer newTopicPosition") Integer newTopicPosition);
   void batchInsertUserStatusTopic(List<UserTopicStatus> userStatusTopics,int batchSize);

    // user
    List<TopicWithStatusDTO> findPublishedTopicsWithStatus(@Param("userId") String userId);
}
