package com.sakurahino.learningservice.controller.admin;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.learningservice.service.LearningStaticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/learning/admin/statics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class LearningStaticsController {

    private final LearningStaticsService learningStaticsService;

    @GetMapping("/total-lesson")
    public SuccessResponse getTotalLessonStatics() {
        var response = learningStaticsService.getTotalLessonStatics();
        return new SuccessResponse(response);
    }

    @GetMapping("/lesson-public")
    public SuccessResponse getTotalLessonStaticsByPublic() {
        var response = learningStaticsService.getTotalLessonByStatus();
        return new SuccessResponse(response);
    }

    @GetMapping("/lesson-stats/{year}")
    public SuccessResponse getTotalLessonStatsByYear(@PathVariable(name = "year") int year) {
        var response = learningStaticsService.getLessonStatsByYear(year);
        return new SuccessResponse(response);
    }

}
