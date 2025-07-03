package com.example.examservice.service.impl;

import com.example.examservice.dto.exam.ExamQuestionRequestDto;
import com.example.examservice.dto.exam.ExamQuestionResponseDto;
import com.example.examservice.dto.choiceExam.QuestionChoiceRequestDto;
import com.example.examservice.dto.choiceExam.QuestionChoiceResponseDto;
import com.example.examservice.entity.ExamQuestion;
import com.example.examservice.entity.enums.QuestionType;
import com.example.examservice.repositories.ExamQuestionRepository;
import com.example.examservice.repositories.QuestionChoiceRepository;
import com.example.examservice.service.ExamQuestionService;
import com.example.examservice.service.QuestionChoiceService;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.ex.ResourceException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ExamQuestionServiceImpl implements ExamQuestionService {
    private final ExamQuestionRepository examQuestionRepository;
    private final QuestionChoiceService questionChoiceService;


    @Override
    public List<ExamQuestionResponseDto> getAllExamQuestionByToppicId(Integer toppicId) {

        //sau bổ sung kiểm tra toppic tồn tại trước khi lấy ra----------------------------------------------------------

        List<ExamQuestion> examQuestions = examQuestionRepository.findExamQuestionsByToppicId(toppicId);
        System.out.println("exams là ákjdhasd:  "+ examQuestions);
        List<ExamQuestionResponseDto> responseDtos = examQuestions.stream().map(examQuestion -> {

                    ExamQuestionResponseDto exam = ExamQuestionResponseDto.builder()
                            .id(examQuestion.getId())
                            .toppicId(examQuestion.getToppicId())
                            .audioUrlQuestions(examQuestion.getAudioUrlQuestions())
                            .questionType(examQuestion.getQuestionType())
                            .promptTextTemplate(examQuestion.getPromptTextTemplate())
                            .targetWordNative(examQuestion.getTargetWordNative())
                            .targetLanguageCode(examQuestion.getTargetLanguageCode())
                            .optionsLanguageCode(examQuestion.getOptionsLanguageCode())
                            .build();
                    List<QuestionChoiceResponseDto> choiceDtos = questionChoiceService.getChoicesByIdExamQuestion(examQuestion.getId());
                    exam.setQuestionChoices(choiceDtos);
                    return exam;
                }

        ).collect(Collectors.toList());

        return responseDtos;
    }

    @Override
    public ExamQuestionResponseDto getExamQuestionById(Integer id) {
        Optional<ExamQuestion> questionOptional = examQuestionRepository.findById(id);
        if(questionOptional.isEmpty()){
            throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(),"exam không tồn tại");
        }
        ExamQuestion examQuestion = questionOptional.get();

        List<QuestionChoiceResponseDto> choiceDtos = questionChoiceService.getChoicesByIdExamQuestion(examQuestion.getId());
        ExamQuestionResponseDto responseDto = ExamQuestionResponseDto.builder()
                .id(examQuestion.getId())
                .toppicId(examQuestion.getToppicId())
                .audioUrlQuestions(examQuestion.getAudioUrlQuestions())
                .questionType(examQuestion.getQuestionType())
                .promptTextTemplate(examQuestion.getPromptTextTemplate())
                .targetWordNative(examQuestion.getTargetWordNative())
                .targetLanguageCode(examQuestion.getTargetLanguageCode())
                .optionsLanguageCode(examQuestion.getOptionsLanguageCode())
                .questionChoices(choiceDtos)
                .build();
        return responseDto;
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Optional<ExamQuestion> questionOptional = examQuestionRepository.findById(id);
        if(questionOptional.isEmpty()){
            throw new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(),"exam không tồn tại");
        }
        examQuestionRepository.deleteById(questionOptional.get().getId());
    }

    @Override
    @Transactional
    public void create(ExamQuestionRequestDto examQuestionRequestDto) {
        //sau bổ sung kiểm tra toppic tồn tại không trươcs khi thêm--------------------------------------
//        ExamQuestion examQuestion = examQuestionRepository.findById(examQuestionRequestDto.getToppicId()).orElseThrow(
//                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Toppic không tồn tại"));


        ExamQuestion examQuestion = new ExamQuestion();

        examQuestion.setToppicId(examQuestionRequestDto.getToppicId());
        examQuestion.setQuestionType(QuestionType.valueOf(examQuestionRequestDto.getQuestionType()));
        examQuestion.setPromptTextTemplate(examQuestionRequestDto.getPromptTextTemplate());
        examQuestion.setTargetWordNative(examQuestionRequestDto.getTargetWordNative());
        examQuestion.setTargetLanguageCode(examQuestionRequestDto.getTargetLanguageCode());
        examQuestion.setOptionsLanguageCode(examQuestionRequestDto.getOptionsLanguageCode());
        examQuestion.setAudioUrlQuestions(examQuestionRequestDto.getAudioUrlQuestions());

        if ((examQuestion.getAudioUrlQuestions() == null)
                && examQuestion.getQuestionType() == QuestionType.AUDIO_CHOICE) {
            throw new ResourceException(ExceptionCode.KHONG_CO_DU_LIEU_TRUYEN_VAO.getStatus(), "Chưa thêm âm thanh cho câu hỏi dạng nghe");
        }
        //lưu câu hỏi
        examQuestionRepository.save(examQuestion);


        //lưu choices
        List<QuestionChoiceRequestDto> choiceDtos = null;
        Integer lessonQuetionId = examQuestion.getId();
        if (examQuestionRequestDto.getQuestionChoices() != null && !examQuestionRequestDto.getQuestionChoices().isEmpty()) {

            choiceDtos = examQuestionRequestDto.getQuestionChoices().stream().
                    map(questionChoiceRequestDto -> {
                                if ((questionChoiceRequestDto.getImageFile() == null || questionChoiceRequestDto.getImageFile().isEmpty())
                                        && examQuestion.getQuestionType() == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE) {
                                    throw new ResourceException(ExceptionCode.KHONG_CO_DU_LIEU_TRUYEN_VAO.getStatus(), "Chưa thêm đủ file ảnh cho các lựa chọn dạng hình ảnh");
                                }
                                if ((questionChoiceRequestDto.getTextBlock() == null)
                                        && examQuestion.getQuestionType() == QuestionType.WORD_ORDER) {
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
    @Transactional
    public void update(Integer id, ExamQuestionRequestDto examQuestionRequestDto) {

        ExamQuestion examQuestion = examQuestionRepository.findById(id).orElseThrow(()
                -> new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "exam không tồn tại"));

        //sau bổ sung kiểm tra toppic tồn tại không trươcs khi thêm--------------------------------------
            // tìm toppic xem có tồn tại exam không

        examQuestion.setToppicId(examQuestionRequestDto.getToppicId());
        examQuestion.setQuestionType(QuestionType.valueOf(examQuestionRequestDto.getQuestionType()));
        examQuestion.setPromptTextTemplate(examQuestionRequestDto.getPromptTextTemplate());
        examQuestion.setTargetWordNative(examQuestionRequestDto.getTargetWordNative());
        examQuestion.setTargetLanguageCode(examQuestionRequestDto.getTargetLanguageCode());
        examQuestion.setOptionsLanguageCode(examQuestionRequestDto.getOptionsLanguageCode());
        examQuestion.setAudioUrlQuestions(examQuestionRequestDto.getAudioUrlQuestions());


        if ((examQuestion.getAudioUrlQuestions() == null)
                && examQuestion.getQuestionType() == QuestionType.AUDIO_CHOICE) {
            throw new ResourceException(ExceptionCode.KHONG_CO_DU_LIEU_TRUYEN_VAO.getStatus(), "Chưa thêm âm thanh cho câu hỏi dạng nghe");
        }
        //lưu câu hỏi
        examQuestionRepository.save(examQuestion);

        //lưu choices
        List<QuestionChoiceRequestDto> choiceDtos = null;
        Integer lessonQuetionId = examQuestion.getId();
        if (examQuestionRequestDto.getQuestionChoices() != null && !examQuestionRequestDto.getQuestionChoices().isEmpty()) {

            choiceDtos = examQuestionRequestDto.getQuestionChoices().stream().
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
