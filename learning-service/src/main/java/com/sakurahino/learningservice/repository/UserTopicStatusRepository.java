package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.UserTopicStatus;
import com.sakurahino.learningservice.repository.custom.UserStatusTopicRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.OptionalDouble;


@Repository
public interface UserTopicStatusRepository extends JpaRepository<UserTopicStatus, Integer>, UserStatusTopicRepositoryCustom {

    Optional<UserTopicStatus> findByUserIdAndTopicId(String userId, Integer id);
}

