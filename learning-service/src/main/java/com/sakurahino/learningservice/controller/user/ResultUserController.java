    package com.sakurahino.learningservice.controller.user;

    import com.sakurahino.common.retresponse.SuccessResponse;
    import com.sakurahino.learningservice.dto.result.LessonResultRequestDTO;
    import com.sakurahino.learningservice.dto.result.PracticeResultRequestDTO;
    import com.sakurahino.learningservice.service.LessonResultService;
    import com.sakurahino.learningservice.service.PracticeResultService;
    import com.sakurahino.learningservice.service.UserTopicStatusService;
    import jakarta.validation.Valid;
    import lombok.RequiredArgsConstructor;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/learning/user/results")
    @RequiredArgsConstructor
    @PreAuthorize("hasRole('USER')")
    public class ResultUserController {

        private final LessonResultService lessonResultService;
        private final PracticeResultService practiceResultService;
        private final UserTopicStatusService userTopicStatusService;

        @PostMapping("/lesson")
        public SuccessResponse lessonResultCreate(@RequestBody @Valid LessonResultRequestDTO dto) {
            var response = lessonResultService.create(dto);
            return new SuccessResponse(response);
        }

        @PostMapping("/practice")
        public SuccessResponse practiceResultCreate(@RequestBody @Valid PracticeResultRequestDTO dto) {
            var response = practiceResultService.create(dto);
            return new SuccessResponse(response);
        }

        @PostMapping("/tests/initial/{correctQuestion}")
        public SuccessResponse getQuestionsByTests(@PathVariable("correctQuestion") Integer correctQuestion) {
          userTopicStatusService.createTopicForUserAfterTest(correctQuestion);
            return new SuccessResponse();
        }
    }
