package com.sakurahino.learningservice.repository.custom.impl;

import com.sakurahino.learningservice.dto.topic.TopicWithStatusDTO;
import com.sakurahino.learningservice.entity.UserTopicStatus;
import com.sakurahino.learningservice.enums.ProgressStatus;
import com.sakurahino.learningservice.repository.custom.UserStatusTopicRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
public class UserStatusTopicRepositoryCustomImpl implements UserStatusTopicRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    // kiem tra xem da co ban ghi hay chua la lay tat ca user du dieu kien
    @Override
    public List<String> findUserIdsToUnlockTopic(@Param("position") int currentPosition, @Param("topicId") Integer topicId) {
        String jpql = """
                    SELECT DISTINCT ust.userId
                    FROM UserTopicStatus ust
                    JOIN ust.topic t
                    WHERE t.position > :position
                      AND ust.progressStatus = :status
                      AND ust.userId NOT IN (
                          SELECT ust2.userId
                          FROM UserTopicStatus ust2
                          WHERE ust2.topic.id = :topicId
                      )
                """;

        return em.createQuery(jpql, String.class)
                .setParameter("position", currentPosition)
                .setParameter("status", ProgressStatus.UNLOCKED)
                .setParameter("topicId", topicId)
                .getResultList();
    }

    // insert hang loat voi moi lan 1k ban ghi
    @Override
    @Transactional
    public void batchInsertUserStatusTopic(List<UserTopicStatus> data, int batchSize) {
        if (data == null || data.isEmpty()) return;

        int total = data.size();
        for (int start = 0; start < total; start += batchSize) {
            int end = Math.min(start + batchSize, total);
            List<UserTopicStatus> batch = data.subList(start, end);

            StringBuilder sql = new StringBuilder();
            sql.append("INSERT INTO user_topic_status (user_id, topic_id, progress_status, completed_at) VALUES ");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS")
                    .withZone(ZoneId.of("Asia/Ho_Chi_Minh")); // múi giờ VN
            for (int i = 0; i < batch.size(); i++) {
                UserTopicStatus item = batch.get(i);

                String completedAt = item.getCompletedAt() != null
                        ? "'" + formatter.format(item.getCompletedAt()) + "'"  // bọc trong ''
                        : "NULL"; // nếu null thì để NULL
                sql.append(String.format("('%s', %d, '%s',%s)",
                        item.getUserId(),
                        item.getTopic().getId(),
                        item.getProgressStatus().name(),
                        completedAt));
                if (i < batch.size() - 1) {
                    sql.append(", ");
                }
            }

            em.createNativeQuery(sql.toString()).executeUpdate();
        }
    }


    // lấy toàn bộ topic với user đó kể cả chưa làm v ở trang thái published
    @Override
    public List<TopicWithStatusDTO> findPublishedTopicsWithStatus(String userId) {
        String jsql = """
                    SELECT new com.sakurahino.learningservice.dto.topic.TopicWithStatusDTO(
                        t.code,
                        t.name,
                        t.position,
                        COALESCE(uts.progressStatus, com.sakurahino.learningservice.enums.ProgressStatus.LOCKED)
                        ,t.urlImage
                    )
                    FROM Topic t
                    LEFT JOIN UserTopicStatus uts
                      ON t.id = uts.topic.id AND uts.userId = :userId
                    WHERE t.status = com.sakurahino.learningservice.enums.LearningStatus.PUBLISHED
                    ORDER BY t.position ASC
                """;
        return em.createQuery(jsql, TopicWithStatusDTO.class)
                .setParameter("userId", userId)
                .getResultList();
    }


}
