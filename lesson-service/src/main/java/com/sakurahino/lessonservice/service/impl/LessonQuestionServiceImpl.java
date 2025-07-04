package com.sakurahino.lessonservice.service.impl;


import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.ex.ResourceException;
import com.sakurahino.lessonservice.clients.UploadServiceClient;
import com.sakurahino.lessonservice.dto.LessonQuestionResponse.LessonQuestionRequestDto;
import com.sakurahino.lessonservice.dto.LessonQuestionResponse.LessonQuestionResponseDto;
import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceRequestDto;
import com.sakurahino.lessonservice.dto.questionChoice.QuestionChoiceResponseDto;
import com.sakurahino.lessonservice.entity.Lesson;
import com.sakurahino.lessonservice.entity.LessonQuestion;
import com.sakurahino.lessonservice.entity.enums.QuestionType;
import com.sakurahino.lessonservice.repository.LessonQuestionRepository;
import com.sakurahino.lessonservice.repository.LessonRepository;
import com.sakurahino.lessonservice.service.LessonQuestionService;
import com.sakurahino.lessonservice.service.QuestionChoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonQuestionServiceImpl implements LessonQuestionService {
    private final LessonQuestionRepository lessonQuestionRepository;
    private final QuestionChoiceService questionChoiceService;
    private final LessonRepository lessonRepository;
    private final UploadServiceClient uploadServiceClient;

    @Override
    public List<LessonQuestionResponseDto> getAllQuestionByLessonId(Integer lessonId) {
        List<LessonQuestion> lessonQuestions = lessonQuestionRepository.findByLesson_Id(lessonId);

        List<LessonQuestionResponseDto> responseDtos = lessonQuestions.stream().map(lessonQuestion -> {
            LessonQuestionResponseDto responseDto = LessonQuestionResponseDto.builder()
                    .id(lessonQuestion.getId())
                    .LessonId(lessonQuestion.getLesson().getId())
                    .audioUrlQuestions(lessonQuestion.getAudioUrlQuestions())
                    .questionType(lessonQuestion.getQuestionType())
                    .promptTextTemplate(lessonQuestion.getPromptTextTemplate())
                    .targetWordNative(lessonQuestion.getTargetWordNative())
                    .targetLanguageCode(lessonQuestion.getTargetLanguageCode())
                    .optionsLanguageCode(lessonQuestion.getOptionsLanguageCode())
                    .build();
            List<QuestionChoiceResponseDto> questionChoiceResponseDtos =
                    questionChoiceService.getAllChoiceByIdLessonQuestion(lessonQuestion.getId());
            responseDto.setQuestionChoices(questionChoiceResponseDtos);
            return responseDto;
        }).collect(Collectors.toList());

        return responseDtos;
    }


    @Override
    public LessonQuestionResponseDto getQuestionById(Integer id) {
        Optional<LessonQuestion> questionOptional = lessonQuestionRepository.findById(id);
        if (questionOptional.isEmpty()) {
            throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Question không tồn tại");
        }
        List<QuestionChoiceResponseDto> choiceResponseDtos = questionChoiceService.getAllChoiceByIdLessonQuestion(questionOptional.get().getId());

        LessonQuestionResponseDto questionResponseDto = LessonQuestionResponseDto.builder()
                .id(questionOptional.get().getId())
                .LessonId(questionOptional.get().getLesson().getId())
                .audioUrlQuestions(questionOptional.get().getAudioUrlQuestions())
                .questionType(questionOptional.get().getQuestionType())
                .promptTextTemplate(questionOptional.get().getPromptTextTemplate())
                .targetWordNative(questionOptional.get().getTargetWordNative())
                .targetLanguageCode(questionOptional.get().getTargetLanguageCode())
                .optionsLanguageCode(questionOptional.get().getOptionsLanguageCode())
                .build();
        questionResponseDto.setQuestionChoices(choiceResponseDtos);

        return questionResponseDto;
    }

    @Override
    @Transactional
    public void create(LessonQuestionRequestDto lessonQuestionRequestDto) {
        Lesson lesson = lessonRepository.findById(lessonQuestionRequestDto.getLessonId()).orElseThrow(
                () -> new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Lesson không tồn tại"));
        LessonQuestion lessonQuestion = new LessonQuestion();

        lessonQuestion.setLesson(lesson);
        lessonQuestion.setQuestionType(QuestionType.valueOf(lessonQuestionRequestDto.getQuestionType()));
        lessonQuestion.setPromptTextTemplate(lessonQuestionRequestDto.getPromptTextTemplate());
        lessonQuestion.setTargetWordNative(lessonQuestionRequestDto.getTargetWordNative());
        lessonQuestion.setTargetLanguageCode(lessonQuestionRequestDto.getTargetLanguageCode());
        lessonQuestion.setOptionsLanguageCode(lessonQuestionRequestDto.getOptionsLanguageCode());
        lessonQuestion.setAudioUrlQuestions(lessonQuestionRequestDto.getAudioUrlQuestions());
//
//        uploadServiceClient.textToSpeech(lessonQuestionRequestDto.getAudioUrlQuestions());
//
//        if ((lessonQuestion.getAudioUrlQuestions() == null)
//                && lessonQuestion.getQuestionType() == QuestionType.AUDIO_CHOICE) {
//            throw new ResourceException(ExceptionCode.KHONG_CO_DU_LIEU_TRUYEN_VAO.getStatus(), "Chưa thêm âm thanh cho câu hỏi dạng nghe");
//        }
//
        //lưu câu hỏi
        lessonQuestionRepository.save(lessonQuestion);


        //lưu choices
        List<QuestionChoiceRequestDto> choiceDtos = null;
        Integer lessonQuetionId = lessonQuestion.getId();
        if (lessonQuestionRequestDto.getQuestionChoices() != null && !lessonQuestionRequestDto.getQuestionChoices().isEmpty()) {

            choiceDtos = lessonQuestionRequestDto.getQuestionChoices().stream().
                    map(questionChoiceRequestDto -> {
                                if ((questionChoiceRequestDto.getImageFile() == null || questionChoiceRequestDto.getImageFile().isEmpty())
                                        && lessonQuestion.getQuestionType() == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE) {
                                    throw new ResourceException(ExceptionCode.KHONG_CO_DU_LIEU_TRUYEN_VAO.getStatus(), "Chưa thêm đủ file ảnh cho các lựa chọn dạng hình ảnh");
                                }
                                if ((questionChoiceRequestDto.getTextBlock() == null)
                                        && lessonQuestion.getQuestionType() == QuestionType.WORD_ORDER) {
                                    throw new ResourceException(ExceptionCode.KHONG_CO_DU_LIEU_TRUYEN_VAO.getStatus(), "Chưa thêm đáp án cho câu dạng xắp xếp");
                                }

                                QuestionChoiceRequestDto choice = new QuestionChoiceRequestDto();
                                choice.setTextForeign(questionChoiceRequestDto.getTextForeign());
                                choice.setTextRomaji(questionChoiceRequestDto.getTextRomaji());
                                choice.setImageFile(questionChoiceRequestDto.getImageFile());
                                choice.setAudioUrlForeign(questionChoiceRequestDto.getAudioUrlForeign());
                                choice.setIsCorrect(questionChoiceRequestDto.getIsCorrect());
                                choice.setTextBlock(questionChoiceRequestDto.getTextBlock());
                                choice.setMeaning(questionChoiceRequestDto.getMeaning());
                                return choice;
                            }
                    ).collect(Collectors.toList());
        }
        questionChoiceService.saveChoices(choiceDtos, lessonQuetionId);
    }

    @Override
    public void delete(Integer id) {
        lessonQuestionRepository.findById(id).orElseThrow(() ->
                new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Lesson không tồn tại"));
        lessonQuestionRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void update(Integer id, LessonQuestionRequestDto lessonQuestionRequestDto) {
        LessonQuestion lessonQuestion = lessonQuestionRepository.findById(id).orElseThrow(()
                -> new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "question không tồn tại"));

        Lesson lesson = lessonRepository.findById(lessonQuestionRequestDto.getLessonId()).orElseThrow(
                () -> new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Lesson không tồn tại"));

        lessonQuestion.setLesson(lesson);
        lessonQuestion.setQuestionType(QuestionType.valueOf(lessonQuestionRequestDto.getQuestionType()));
        lessonQuestion.setPromptTextTemplate(lessonQuestionRequestDto.getPromptTextTemplate());
        lessonQuestion.setTargetWordNative(lessonQuestionRequestDto.getTargetWordNative());
        lessonQuestion.setTargetLanguageCode(lessonQuestionRequestDto.getTargetLanguageCode());
        lessonQuestion.setOptionsLanguageCode(lessonQuestionRequestDto.getOptionsLanguageCode());
        lessonQuestion.setAudioUrlQuestions(lessonQuestionRequestDto.getAudioUrlQuestions());


        if ((lessonQuestion.getAudioUrlQuestions() == null)
                && lessonQuestion.getQuestionType() == QuestionType.AUDIO_CHOICE) {
            throw new ResourceException(ExceptionCode.KHONG_CO_DU_LIEU_TRUYEN_VAO.getStatus(), "Chưa thêm âm thanh cho câu hỏi dạng nghe");
        }
        //lưu câu hỏi
        lessonQuestionRepository.save(lessonQuestion);

        //lưu choices
        List<QuestionChoiceRequestDto> choiceDtos = null;
        Integer lessonQuetionId = lessonQuestion.getId();
        if (lessonQuestionRequestDto.getQuestionChoices() != null && !lessonQuestionRequestDto.getQuestionChoices().isEmpty()) {

            choiceDtos = lessonQuestionRequestDto.getQuestionChoices().stream().
                    map(questionChoiceRequestDto -> {
                                if (questionChoiceRequestDto.getId() == null) {
                                    throw new ResourceException(ExceptionCode.KHONG_CO_DU_LIEU_TRUYEN_VAO.getStatus(), "id choice đang trống không thể update");
                                }

                                QuestionChoiceRequestDto choice = new QuestionChoiceRequestDto();
                                choice.setId(questionChoiceRequestDto.getId());
                                choice.setTextForeign(questionChoiceRequestDto.getTextForeign());
                                choice.setTextRomaji(questionChoiceRequestDto.getTextRomaji());
                                choice.setImageFile(questionChoiceRequestDto.getImageFile());
                                choice.setAudioUrlForeign(questionChoiceRequestDto.getAudioUrlForeign());
                                choice.setIsCorrect(questionChoiceRequestDto.getIsCorrect());
                                choice.setTextBlock(questionChoiceRequestDto.getTextBlock());
                                choice.setMeaning(questionChoiceRequestDto.getMeaning());
                                return choice;
                            }
                    ).collect(Collectors.toList());


        }
        questionChoiceService.saveChoices(choiceDtos, lessonQuetionId);
    }

}
