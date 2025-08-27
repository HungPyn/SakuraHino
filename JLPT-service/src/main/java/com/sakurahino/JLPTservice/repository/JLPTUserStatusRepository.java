package com.sakurahino.JLPTservice.repository;

import com.sakurahino.JLPTservice.module.entity.JLPTUserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JLPTUserStatusRepository extends JpaRepository<JLPTUserStatus,Long > {
    public JLPTUserStatus findByUserIdAndMetaDataId(String userId, Long metaDataId);
}
