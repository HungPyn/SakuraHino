package com.sakurahino.learningservice.repository.custom.impl;

import com.sakurahino.learningservice.dto.lesson.LessonWithStatusDTO;
import com.sakurahino.learningservice.entity.UserLessonStatus;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.ProgressStatus;
import com.sakurahino.learningservice.repository.custom.UserStatusLessonRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
public class UserStatusLessonRepositoryCustomImpl implements UserStatusLessonRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Integer> findExistingLessonIdsForUser(String userId, List<Integer> lessonIds) {
        String jpql = "SELECT uls.lesson.id FROM UserLessonStatus uls WHERE uls.userId = :userId AND uls.lesson.id IN :lessonIds";
        return em.createQuery(jpql, Integer.class)
                .setParameter("userId", userId)
                .setParameter("lessonIds", lessonIds)
                .getResultList();
    }

    @Override
    public List<String> findUserIdToUnlockLesson(int currentPosition, int lessonId, int topicId) {
        String jpql = """
        SELECT DISTINCT uls.userId
        FROM UserLessonStatus uls
        JOIN uls.lesson l
        WHERE l.position > :position
          AND l.topic.id = :topicId
          AND uls.progressStatus = :status
          AND uls.userId NOT IN (
              SELECT uls2.userId
              FROM UserLessonStatus uls2
              WHERE uls2.lesson.id = :lessonId
          )
    """;

        return em.createQuery(jpql, String.class)
                .setParameter("position", currentPosition)
                .setParameter("topicId", topicId)
                .setParameter("status", ProgressStatus.UNLOCKED)
                .setParameter("lessonId", lessonId)
                .getResultList();
    }

    @Override
    public List<String> findUserIdsToUnlockLessonByPassedPreviousLesson(Integer newLessonId) {

        String jpql = """
        SELECT DISTINCT uls.userId
        FROM UserLessonStatus uls
        JOIN uls.lesson l
        WHERE uls.progressStatus = :passedStatus
          AND l.position = (
              SELECT MAX(l2.position)
              FROM UserLessonStatus uls2
              JOIN uls2.lesson l2
              WHERE uls2.userId = uls.userId
                AND uls2.progressStatus = :passedStatus
                AND l2.topic.id = l.topic.id
          )
          AND uls.userId NOT IN (
              SELECT uls3.userId
              FROM UserLessonStatus uls3
              JOIN uls3.lesson l3
              WHERE l3.id = :newLessonId
          )
    """;

        return em.createQuery(jpql, String.class)
                .setParameter("newLessonId", newLessonId)
                .setParameter("passedStatus", ProgressStatus.PASSED)
                .getResultList();
    }

    @Override
    @Transactional
    public void batchInsertUserStatusLesson(List<UserLessonStatus> data, int batchSize) {
        if (data == null || data.isEmpty()) return;

        int total = data.size();
        for (int start = 0; start < total; start += batchSize) {
            int end = Math.min(start + batchSize, total);
            List<UserLessonStatus> batch = data.subList(start, end);

            StringBuilder sql = new StringBuilder();
            sql.append("INSERT INTO user_lesson_status (user_id, lesson_id, progress_status, completed_at) VALUES ");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS")
                    .withZone(ZoneId.of("Asia/Ho_Chi_Minh")); // múi giờ VN
            for (int i = 0; i < batch.size(); i++) {
                UserLessonStatus item = batch.get(i);
                String completedAt = item.getCompletedAt() != null
                        ? "'" + formatter.format(item.getCompletedAt()) + "'"  // bọc trong ''
                        : "NULL"; // nếu null thì để NULL
                sql.append(String.format("('%s', %d, '%s', %s)",
                        item.getUserId(),
                        item.getLesson().getId(),
                        item.getProgressStatus().name(),
                        completedAt));

                if (i < batch.size() - 1) {
                    sql.append(", ");
                }
            }

            em.createNativeQuery(sql.toString()).executeUpdate();
        }
    }


    //user
    @Override
    public List<LessonWithStatusDTO> findAllPublishedLessonsWithStatusByUser(String userId) {
        String jsql = """
        SELECT new com.sakurahino.learningservice.dto.lesson.LessonWithStatusDTO(
            l.code,
            l.lessonName,
            t.code,
            l.position,
            COALESCE(uls.progressStatus, :lockedStatus)
        )
        FROM Lesson l
        JOIN l.topic t
        LEFT JOIN UserLessonStatus uls
            ON uls.lesson.code = l.code AND uls.userId = :userId
        WHERE l.status = :publishedStatus
          AND EXISTS (
              SELECT 1
              FROM LessonQuestion q
              WHERE q.lesson = l
          )
        ORDER BY l.position ASC
    """;

        return em.createQuery(jsql, LessonWithStatusDTO.class)
                .setParameter("userId", userId)
                .setParameter("lockedStatus", ProgressStatus.LOCKED)
                .setParameter("publishedStatus", LearningStatus.PUBLISHED)
                .getResultList();
    }



    public boolean areAllLessonsPassed(String userId, String topicCode) {
        String jpql = """
        SELECT CASE
                 WHEN COUNT(ls) = SUM(CASE WHEN uls.progressStatus = :passed THEN 1 ELSE 0 END)
                 THEN TRUE ELSE FALSE
               END
        FROM Lesson ls
        LEFT JOIN UserLessonStatus uls 
               ON uls.lesson.id = ls.id 
              AND uls.userId = :userId
        WHERE ls.topic.code = :topicCode
          AND ls.status = :published
    """;

        return Boolean.TRUE.equals(
                em.createQuery(jpql, Boolean.class)
                        .setParameter("userId", userId)
                        .setParameter("topicCode", topicCode)
                        .setParameter("passed", ProgressStatus.PASSED)
                        .setParameter("published", LearningStatus.PUBLISHED) // nếu có trạng thái publish cho lesson
                        .getSingleResult()
        );
    }
}
