package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.UserTopicStatus;
import com.sakurahino.learningservice.enums.ProgressStatus;
import com.sakurahino.learningservice.repository.custom.UserStatusTopicRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserTopicStatusRepository extends JpaRepository<UserTopicStatus, Integer>, UserStatusTopicRepositoryCustom {

    Optional<UserTopicStatus> findByUserIdAndTopicId(String userId, Integer id);



    // Dùng để cho chỗ unlocked lesson nếu là first lesson mà topic đó đã unlocked
    @Query("SELECT uts.userId FROM UserTopicStatus uts " +
            "WHERE uts.topic.id = :topicId " +
            "AND uts.progressStatus = :status")
    List<String> findUnlockedUserIdsByTopic(@Param("topicId") Integer topicId,
                                            @Param("status") ProgressStatus status);

    boolean existsByUserIdAndTopicId(String userId, Integer topicId);
}

