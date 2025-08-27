package com.sakurahino.JLPTservice.repository;

import com.sakurahino.JLPTservice.module.entity.JLPTMetaData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JLPTMetaDataResponse extends JpaRepository<JLPTMetaData,Long > {
    @Query("""
    SELECT DISTINCT m FROM JLPTMetaData m
    LEFT JOIN FETCH m.userStatus u
         WITH u.userId = :userId
    WHERE m.status = 'PUBLIC'
""")
    List<JLPTMetaData> findPublishedExamsWithUserStatus(@Param("userId") String userId);
}
