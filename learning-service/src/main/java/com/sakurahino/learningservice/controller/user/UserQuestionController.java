package com.sakurahino.learningservice.controller.user;

import com.sakurahino.common.retresponse.SuccessResponse;
import com.sakurahino.learningservice.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/learning/user/questions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserQuestionController {

    private final QuestionService questionService;


    // lay question theo lesson code
    @GetMapping("/lesson/{lessonCode}")
    public SuccessResponse getQuestionsByLessonCodeUser(@PathVariable String lessonCode) {
        var response = questionService.getQuestionsForUser(lessonCode);
        return new SuccessResponse(response);
    }

    // Lấy question theo topic code (practice)
    @GetMapping("/topic/{topicCode}")
    public SuccessResponse getQuestionsByTopicCodeUser
            (@PathVariable String topicCode, @RequestParam("limit") Integer limit) {
        var response = questionService.getQuestionsPractice(topicCode, limit);
        return new SuccessResponse(response);
    }

    // Lấy câu hỏi để người dùng mới làm test đầu vào
    @GetMapping("/tests/initial")
    public SuccessResponse getQuestionsByTests() {
        var response = questionService.getQuestionsTestForUser();
        return new SuccessResponse(response);
    }
}
