package com.sakurahino.topicservice.service.impl;

import com.sakurahino.topicservice.dto.TopicRequest;
import com.sakurahino.topicservice.dto.TopicResponse;
import com.sakurahino.topicservice.entity.Topic;
import com.sakurahino.topicservice.mapper.TopicServiceMapper;
import com.sakurahino.topicservice.repository.LevelRepository;
import com.sakurahino.topicservice.repository.TopicRepository;
import com.sakurahino.topicservice.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class TopicServiceImpl  implements TopicService {

    private final TopicRepository topicRepository;
    private final LevelRepository levelRepository;
    private final TopicServiceMapper topicServiceMapper;

    @Override
    public List<TopicResponse> getAll(Integer levelId, String role) {

        List<Topic> topicList;
        if (role.equals("ADMIN")) {
            topicList = topicRepository.findAllByLevel_IdOrderByCreateAtAsc(levelId);
        }else {
            topicList = topicRepository.findAllByLevel_IdOrderByCreateAtDesc(levelId);
        }

        return topicList.stream().map(topicServiceMapper::maptoTopicResponse).toList();
    }

    @Override
    public TopicResponse create(TopicRequest dto) {
        return null;
    }

    @Override
    public TopicResponse update(TopicRequest dto) {
        return null;
    }

    @Override
    public void delete(Integer id) {

    }

}
