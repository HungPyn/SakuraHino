package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.UserTopicStatus;
import com.sakurahino.learningservice.repository.custom.UserStatusTopicRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserTopicStatusRepository extends JpaRepository<UserTopicStatus, Integer>, UserStatusTopicRepositoryCustom {

}

