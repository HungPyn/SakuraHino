package com.example.examservice.service.impl;

import com.example.examservice.clients.LessonServiceClient;
import com.example.examservice.dto.ExamQuestionRequestDto;
import com.example.examservice.dto.ExamQuestionResponseDto;
import com.example.examservice.dto.QuestionChoiceRequestDto;
import com.example.examservice.dto.QuestionChoiceResponseDto;
import com.example.examservice.entity.ExamQuestion;
import com.example.examservice.entity.enums.QuestionType;
import com.example.examservice.repositories.ExamQuestionRepository;
import com.example.examservice.service.ExamQuestionService;
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

    private final LessonServiceClient lessonServiceClient;

    @Override
    public List<ExamQuestionResponseDto> getAllExamQuestionByToppicId(Integer toppicId) {

        //sau bổ sung kiểm tra toppic tồn tại trước khi lấy ra----------------------------------------------------------

        List<ExamQuestion> examQuestions = examQuestionRepository.findExamQuestionsByToppicId(toppicId);

        System.out.println("exams là ákjdhasd:  "+ examQuestions);

        List<ExamQuestionResponseDto> responseDtos = examQuestions.stream().map(examQuestion -> {
                    if (examQuestion.getId() == null) {
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa có idExam");
                    }
                    List<QuestionChoiceResponseDto> responseChoice = lessonServiceClient.getChoicesByExamId(examQuestion.getId());

                    return ExamQuestionResponseDto.builder()
                            .id(examQuestion.getId())
                            .toppicId(examQuestion.getToppicId())
                            .audioUrlQuestions(examQuestion.getAudioUrlQuestions())
                            .questionType(examQuestion.getQuestionType())
                            .promptTextTemplate(examQuestion.getPromptTextTemplate())
                            .targetWordNative(examQuestion.getTargetWordNative())
                            .targetLanguageCode(examQuestion.getTargetLanguageCode())
                            .optionsLanguageCode(examQuestion.getOptionsLanguageCode())
                            .questionChoices(responseChoice)
                            .build();
                }

        ).collect(Collectors.toList());

        return responseDtos;
    }

    @Override
    public ExamQuestionResponseDto getExamQuestionById(Integer id) {
        Optional<ExamQuestion> questionOptional = examQuestionRepository.findById(id);
        if(questionOptional.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"exam không tồn tại");
        }
        ExamQuestion examQuestion = questionOptional.get();

        List<QuestionChoiceResponseDto> choiceDtos = lessonServiceClient.getChoicesByExamId(examQuestion.getId());
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
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"exam không tồn tại");
        }
        examQuestionRepository.deleteById(questionOptional.get().getId());
        lessonServiceClient.deleteChoiceByExamId(questionOptional.get().getId());
    }

    @Override
    @Transactional
    public void create(ExamQuestionRequestDto examQuestionRequestDto) {
        //sau bổ sung kiểm tra toppic tồn tại không trươcs khi thêm--------------------------------------

        ExamQuestion examQuestion = new ExamQuestion();

        examQuestion.setToppicId(examQuestionRequestDto.getToppicId());
        examQuestion.setQuestionType(QuestionType.valueOf(examQuestionRequestDto.getQuestionType()));
        examQuestion.setPromptTextTemplate(examQuestionRequestDto.getPromptTextTemplate());
        examQuestion.setTargetWordNative(examQuestionRequestDto.getTargetWordNative());
        examQuestion.setTargetLanguageCode(examQuestionRequestDto.getTargetLanguageCode());
        examQuestion.setOptionsLanguageCode(examQuestionRequestDto.getOptionsLanguageCode());
        examQuestion.setAudioUrlQuestions(examQuestionRequestDto.getAudioUrlQuestions());

        //lưu câu hỏi
        examQuestionRepository.save(examQuestion);


        //lưu choices
        List<QuestionChoiceRequestDto> choiceDtos = null;
        Integer examId = examQuestion.getId();
        if (examQuestionRequestDto.getQuestionChoices() != null && !examQuestionRequestDto.getQuestionChoices().isEmpty()) {

            choiceDtos = examQuestionRequestDto.getQuestionChoices().stream().
                    map(questionChoiceRequestDto -> {
                                if ((questionChoiceRequestDto.getImageFile() == null || questionChoiceRequestDto.getImageFile().isEmpty())
                                        && examQuestion.getQuestionType() == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE) {
                                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa thêm file ảnh cho câu hỏi dạng hình ảnh");
                                }

                                QuestionChoiceRequestDto choice = new QuestionChoiceRequestDto();
                                choice.setExamQuestionId(questionChoiceRequestDto.getExamQuestionId());
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

        lessonServiceClient.saveChoicesExam(choiceDtos, examId);
    }


    @Override
    @Transactional
    public void update(Integer id, ExamQuestionRequestDto examQuestionRequestDto) {
        //sau bổ sung kiểm tra toppic tồn tại không trươcs khi thêm, sửa--------------------------------------

        Optional<ExamQuestion> examQuestionOptional = examQuestionRepository.findById(id);
        if(examQuestionOptional.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"exam không tồn tại id: "+id);
        }

        ExamQuestion examQuestion = examQuestionOptional.get();

        examQuestion.setToppicId(examQuestionRequestDto.getToppicId());
        examQuestion.setQuestionType(QuestionType.valueOf(examQuestionRequestDto.getQuestionType()));
        examQuestion.setPromptTextTemplate(examQuestionRequestDto.getPromptTextTemplate());
        examQuestion.setTargetWordNative(examQuestionRequestDto.getTargetWordNative());
        examQuestion.setTargetLanguageCode(examQuestionRequestDto.getTargetLanguageCode());
        examQuestion.setOptionsLanguageCode(examQuestionRequestDto.getOptionsLanguageCode());
        examQuestion.setAudioUrlQuestions(examQuestionRequestDto.getAudioUrlQuestions());

        //lưu câu hỏi
        examQuestionRepository.save(examQuestion);


        //lưu choices
        List<QuestionChoiceRequestDto> choiceDtos = null;
        Integer examId = examQuestion.getId();
        if (examQuestionRequestDto.getQuestionChoices() != null && !examQuestionRequestDto.getQuestionChoices().isEmpty()) {

            choiceDtos = examQuestionRequestDto.getQuestionChoices().stream().
                    map(questionChoiceRequestDto -> {
                                if ((questionChoiceRequestDto.getImageFile() == null || questionChoiceRequestDto.getImageFile().isEmpty())
                                        && examQuestion.getQuestionType() == QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE) {
                                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa thêm file ảnh cho câu hỏi dạng hình ảnh");
                                }

                                QuestionChoiceRequestDto choice = new QuestionChoiceRequestDto();
                                choice.setExamQuestionId(questionChoiceRequestDto.getExamQuestionId());
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
        lessonServiceClient.saveChoicesExam(choiceDtos, examId);
    }
}
