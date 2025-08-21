package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.enums.LearningStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {

    // admin
    Page<Topic> findAllByOrderByCreateAtDesc(Pageable pageable);

    boolean existsByCode(String code);

    @Query("SELECT MAX(t.position) FROM Topic t")
    Integer findMaxPosition();

    @Query("SELECT t FROM Topic t " +
            "WHERE (:tuKhoa IS NULL OR t.name LIKE CONCAT('%', :tuKhoa, '%')) " +
            "  AND (:levelId IS NULL OR t.level.id = :levelId) " +
            "  AND (:status IS NULL OR t.status = :status) " +
            "  AND (:startDate IS NULL OR t.createAt >= :startDate) " +
            "  AND (:endDate IS NULL OR t.createAt < :endDate)")
    Page<Topic> findByFilters(
            @Param("tuKhoa") String tuKhoa,
            @Param("levelId") Integer levelId,
            @Param("status") LearningStatus status,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            Pageable pageable
    );

    Topic findByCode(String code);

    @Query("SELECT t FROM Topic t " +
            "WHERE t.status = :status " +
            "AND t.position > :currentPosition " +
            "ORDER BY t.position ASC")
    List<Topic> findNextPublishedTopic(
            @Param("status") LearningStatus status,
            @Param("currentPosition") Integer currentPosition
    );

    // Lấy 2 topic đầu đã published theo position ASC
    @Query("SELECT t FROM Topic t WHERE t.status = :status ORDER BY t.position ASC")
    List<Topic> findFirstPublishedTopics(
            @Param("status") LearningStatus status,
            Pageable pageable
    );

    // Kiểm tra có topic nào trùng tên hay không (dùng cho tạo mới)
    boolean existsByName(String name);

    // Kiểm tra có topic nào trùng tên nhưng khác ID (dùng cho update)
    boolean existsByNameAndIdNot(String name, Integer id);
}
