package com.sakurahino.toppicservice.repositorys;

import com.sakurahino.toppicservice.entity.Toppic;
import com.sakurahino.toppicservice.entity.dto.ToppicResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ToppicRepository extends JpaRepository<Toppic, Integer> {

    List<Toppic> findTopicsByLevelId(Integer idLevel);
}