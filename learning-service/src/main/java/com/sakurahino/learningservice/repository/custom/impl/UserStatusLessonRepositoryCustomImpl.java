package com.sakurahino.learningservice.repository.custom.impl;

import com.sakurahino.learningservice.dto.lesson.LessonWithStatusDTO;
import com.sakurahino.learningservice.entity.UserLessonStatus;
import com.sakurahino.learningservice.enums.ProgressStatus;
import com.sakurahino.learningservice.repository.custom.UserStatusLessonRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public class UserStatusLessonRepositoryCustomImpl implements UserStatusLessonRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<String> findUserIdToUnlockLesson(int currentPosition, int lessonId) {
        String jpql = """
                    SELECT DISTINCT uls.userId
                    FROM UserLessonStatus uls
                    JOIN uls.lesson l
                    WHERE l.position > :position
                      AND uls.progressStatus = :status
                      AND uls.userId NOT IN (
                          SELECT uls2.userId
                          FROM UserLessonStatus uls2
                          WHERE uls2.lesson.id = :lessonId
                      )
                """;

        return em.createQuery(jpql, String.class)
                .setParameter("position", currentPosition)
                .setParameter("status", ProgressStatus.UNLOCKED)
                .setParameter("lessonId", lessonId)
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

            for (int i = 0; i < batch.size(); i++) {
                UserLessonStatus item = batch.get(i);
                sql.append(String.format("('%s', %d, '%s', '%s')",
                        item.getUserId(),
                        item.getLesson().getId(),
                        item.getProgressStatus().name(),
                        Instant.now()));

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
            COALESCE(uls.progressStatus, com.sakurahino.learningservice.enums.ProgressStatus.LOCKED)
        )
        FROM Lesson l
        JOIN l.topic t
        LEFT JOIN UserLessonStatus uls
            ON uls.lesson.code = l.code AND uls.userId = :userId
        WHERE l.status = com.sakurahino.learningservice.enums.LearningStatus.PUBLISHED
        ORDER BY t.code, l.position
    """;

        return em.createQuery(jsql, LessonWithStatusDTO.class)
                .setParameter("userId", userId)
                .getResultList();
    }



}
