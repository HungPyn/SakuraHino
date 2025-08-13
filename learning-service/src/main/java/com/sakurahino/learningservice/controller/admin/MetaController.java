package com.sakurahino.learningservice.controller.admin;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.learningservice.service.LevelService;
import com.sakurahino.learningservice.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/learning/admin/meta")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class MetaController {

    private  final TopicService topicService;
    private final LevelService levelService;

    @GetMapping("/status")
    public SuccessResponse getStatusForAdmin(){
        return new SuccessResponse(topicService.getStatus());
    }

    @GetMapping("/level")
    public SuccessResponse getLevelForAdmin(){
        var result = levelService.getAll();
        return new SuccessResponse(result);
    }
}
