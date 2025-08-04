package com.sakurahino.learningservice.repository;

import com.sakurahino.learningservice.entity.UserLessonStatus;
import com.sakurahino.learningservice.repository.custom.UserStatusLessonRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserStatusLessonRepository  extends JpaRepository<UserLessonStatus, Integer>, UserStatusLessonRepositoryCustom {
}
