package com.sakurahino.learningservice.controller.user;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.learningservice.service.UserTopicStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/learning/user/topics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class  UserTopicController {

    private final UserTopicStatusService userTopicStatusService;

    @GetMapping
    public SuccessResponse findPublishedTopicsWithStatus() {
        var response = userTopicStatusService.findTopicsWithStatusByUser();
        return new SuccessResponse(response);
    }
}
