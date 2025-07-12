package com.sakurahino.learningservice.service.impl;

import com.sakurahino.clients.feign.UploadServiceClients;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.ex.ResourceException;
import com.sakurahino.learningservice.dto.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.LessonQuestionResponse;
import com.sakurahino.learningservice.dto.QuestionChoiceResponse;
import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.entity.QuestionChoice;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.enums.QuestionType;
import com.sakurahino.learningservice.mapper.ChoiceMapper;
import com.sakurahino.learningservice.mapper.LessonQuestionMapper;
import com.sakurahino.learningservice.repository.LessonQuestionRepository;
import com.sakurahino.learningservice.repository.QuestionChoiceRepository;
import com.sakurahino.learningservice.repository.TopicRepository;
import com.sakurahino.learningservice.service.QuestionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionServiceImpl implements QuestionService {
    private final QuestionChoiceRepository questionChoiceRepository;
    private final UploadServiceClients uploadServiceClients;
    private final LessonQuestionRepository lessonQuestionRepository;

    private final LessonQuestionMapper lessonQuestionMapper;
    private final ChoiceMapper choiceMapper;
    private final TopicRepository topicRepository;

    @Override
    public List<LessonQuestionResponse> getQuestionsByTopicId(UUID userId, Integer topicId) {
        //bổ sung sử lí userId lấy complete theo người người dùng

        //--------------------------------------------------------
        List<LessonQuestion> lessonQuestions = lessonQuestionRepository.findLessonQuestionsByTopic_Id(topicId);
        List<LessonQuestionResponse> lessonQuestionResponses =
                lessonQuestions.stream().map(lessonQuestion -> {
                    LessonQuestionResponse response = lessonQuestionMapper.mapQuestionResponse(lessonQuestion);

                    if (lessonQuestion.getChoices() != null && !lessonQuestion.getChoices().isEmpty()) {
                        List<QuestionChoiceResponse> choiceResponses = choiceMapper.mapChoiceListToResponseList(lessonQuestion.getChoices());
                        response.setChoices(choiceResponses);
                    } else {
                        response.setChoices(List.of());
                    }
                    return response;
                }).collect(Collectors.toList());
        return lessonQuestionResponses;
    }

    @Override
    public List<LessonQuestionResponse> getQuestionsByTopicIdAdmin(Integer topicId) {
        List<LessonQuestion> lessonQuestions = lessonQuestionRepository.findLessonQuestionsByTopic_IdOrderByIdDesc(topicId);
        List<LessonQuestionResponse> lessonQuestionResponses =
                lessonQuestions.stream().map(lessonQuestion -> {
                    LessonQuestionResponse response = lessonQuestionMapper.mapQuestionResponse(lessonQuestion);
                    if (lessonQuestion.getChoices() != null && !lessonQuestion.getChoices().isEmpty()) {
                        List<QuestionChoiceResponse> choiceResponses = choiceMapper.mapChoiceListToResponseList(lessonQuestion.getChoices());
                        response.setChoices(choiceResponses);
                    } else {
                        response.setChoices(List.of());
                    }
                    return response;
                }).collect(Collectors.toList());
        return lessonQuestionResponses;
    }

    @Override
    public LessonQuestionResponse getQuestionById(Integer id) {
        LessonQuestion lessonQuestion = lessonQuestionRepository.findById(id).orElseThrow(() -> new ResourceException
                (ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Không tìm thấy câu hỏi này (id): " + id));
        LessonQuestionResponse questionResponse = lessonQuestionMapper.mapQuestionResponse(lessonQuestion);
        return questionResponse;
    }

    @Override
    @Transactional
    public void deleteQuestion(Integer id) {
        lessonQuestionRepository.findById(id).orElseThrow(() -> new ResourceException
                (ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Không tìm thấy câu hỏi này (id): " + id));
        lessonQuestionRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void createQuestion(LessonQuestionRequest questionRequest) {
        Topic topic = topicRepository.findById(questionRequest.getTopicId()).orElseThrow(() -> new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(),
                "Topic không tồn tại (id)" + questionRequest.getTopicId()));

        if (questionRequest.getQuestionType().equalsIgnoreCase(QuestionType.AUDIO_CHOICE.toString())) {
            if (questionRequest.getTextAudioQuestion() == null || questionRequest.getTextAudioQuestion().isEmpty()) {
                throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(),
                        "không được để trổng text cho âm thanh câu hỏi dạng audio");
            }
        }
        //xu li cau hoi

        LessonQuestion lessonQuestion = lessonQuestionMapper.mapEntityFromeRequest(questionRequest);
        //xử lí audio cho câu hỏi
        String audioUrl = questionRequest.getTextAudioQuestion();
        if (questionRequest.getTextAudioQuestion() != null && !questionRequest.getTextAudioQuestion().isEmpty()) {
            log.info("Bắt đầu chuyển text thành url");
            var url = uploadServiceClients.upLoadText(questionRequest.getTextAudioQuestion());
            log.info("url audio là" + url);
            audioUrl = url.getUrlImage();
        }
        lessonQuestion.setAudioUrlQuestions(audioUrl);

        //xu li list choice
        List<QuestionChoice> questionChoices = questionRequest.getChoiceRequests().stream().map(
                questionChoiceRequest -> {
                    if (questionRequest.getQuestionType().equalsIgnoreCase(QuestionType.WORD_ORDER.toString())) {
                        if (questionChoiceRequest.getTextBlock() == null || questionChoiceRequest.getTextBlock().isEmpty()) {
                            throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(),
                                    "không được để trổng câu trả lời cho câu xắp xếp");
                        }
                    }
                    if (questionRequest.getQuestionType().equalsIgnoreCase(QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE.toString())) {
                        if (questionChoiceRequest.getImageFile() == null || questionChoiceRequest.getImageFile().isEmpty()) {
                            throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(),
                                    "không được để trống file ảnh cho câu hỏi dạng ảnh");
                        }
                    }

                    // xu li audio
                    String urlAudioChoice = questionChoiceRequest.getTextAudioChoice();

                    if (questionChoiceRequest.getTextAudioChoice() != null && !questionChoiceRequest.getTextAudioChoice().isEmpty()) {
                        log.info("Bắt đầu chuyển text thành url");
                        var url = uploadServiceClients.upLoadText(questionChoiceRequest.getTextAudioChoice());
                        log.info("url audio là" + url);
                        urlAudioChoice = url.getUrlImage();
                    }

                    //xu li hinh anh
                    String urlImage = null;
                    if (questionChoiceRequest.getImageFile() != null && !questionChoiceRequest.getImageFile().isEmpty()) {
                        log.info("Bắt đầu chuyển ảnh thành url");
                        var url = uploadServiceClients.uploadFile(questionChoiceRequest.getImageFile());
                        log.info("url ảnh là" + url);
                        urlImage = url.getUrlImage();
                    }

                    QuestionChoice questionChoice = choiceMapper.mapRequestToChoice(questionChoiceRequest);
                    questionChoice.setAudioUrlForeign(urlAudioChoice);
                    questionChoice.setImageUrl(urlImage);
                    questionChoice.setLessonQuestion(lessonQuestion);

                    return questionChoice;
                }
        ).collect(Collectors.toList());


        lessonQuestion.setTopic(topic);

        lessonQuestion.setChoices(questionChoices);

        lessonQuestionRepository.save(lessonQuestion);
    }

    @Override
    @Transactional
    public void updateQuestion(Integer id, LessonQuestionRequest questionRequest) {
        Topic topic = topicRepository.findById(questionRequest.getTopicId()).orElseThrow(() -> new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(),
                "Topic không tồn tại (id)" + questionRequest.getTopicId()));


      LessonQuestion lessonQuestioncheck = lessonQuestionRepository.findById(id).orElseThrow(() ->
                new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Câu hỏi không tồn tại (id)" + id));

        if (topic.getId() != lessonQuestioncheck.getTopic().getId()) {
            throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(),
                    "Câu hỏi không thuộc topic");
        }

        if (questionRequest.getQuestionType().equalsIgnoreCase(QuestionType.AUDIO_CHOICE.toString())) {
            if (questionRequest.getTextAudioQuestion() == null || questionRequest.getTextAudioQuestion().isEmpty()) {
                throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(),
                        "không được để trổng text cho âm thanh câu hỏi dạng audio");
            }
        }
        //xu li cau hoi

        LessonQuestion lessonQuestion = lessonQuestionMapper.mapEntityFromeRequest(questionRequest);
        //xử lí audio cho câu hỏi
        String audioUrl = questionRequest.getTextAudioQuestion();
        if (questionRequest.getTextAudioQuestion() != null && !questionRequest.getTextAudioQuestion().isEmpty()) {
            log.info("Bắt đầu chuyển text thành url");
            var url = uploadServiceClients.upLoadText(questionRequest.getTextAudioQuestion());
            log.info("url audio là" + url);
            audioUrl = url.getUrlImage();
        }
        lessonQuestion.setAudioUrlQuestions(audioUrl);

        //xu li list choice
        List<QuestionChoice> questionChoices = questionRequest.getChoiceRequests().stream().map(
                questionChoiceRequest -> {
                    if (questionRequest.getQuestionType().equalsIgnoreCase(QuestionType.WORD_ORDER.toString())) {
                        if (questionChoiceRequest.getTextBlock() == null || questionChoiceRequest.getTextBlock().isEmpty()) {
                            throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(),
                                    "không được để trổng câu trả lời cho câu xắp xếp");
                        }
                    }
                    if (questionRequest.getQuestionType().equalsIgnoreCase(QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE.toString())) {
                        if (questionChoiceRequest.getImageFile() == null || questionChoiceRequest.getImageFile().isEmpty()) {
                            throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(),
                                    "không được để trống file ảnh cho câu hỏi dạng ảnh");
                        }
                    }

                    // xu li audio
                    String urlAudioChoice = questionChoiceRequest.getTextAudioChoice();

                    if (questionChoiceRequest.getTextAudioChoice() != null && !questionChoiceRequest.getTextAudioChoice().isEmpty()) {
                        log.info("Bắt đầu chuyển text thành url");
                        var url = uploadServiceClients.upLoadText(questionChoiceRequest.getTextAudioChoice());
                        log.info("url audio là" + url);
                        urlAudioChoice = url.getUrlImage();
                    }

                    //xu li hinh anh
                    String urlImage = null;
                    if (questionChoiceRequest.getImageFile() != null && !questionChoiceRequest.getImageFile().isEmpty()) {
                        log.info("Bắt đầu chuyển ảnh thành url");
                        var url = uploadServiceClients.uploadFile(questionChoiceRequest.getImageFile());
                        log.info("url ảnh là" + url);
                        urlImage = url.getUrlImage();
                    }

                    QuestionChoice questionChoice = choiceMapper.mapRequestToChoice(questionChoiceRequest);
                    questionChoice.setAudioUrlForeign(urlAudioChoice);
                    questionChoice.setImageUrl(urlImage);
                    questionChoice.setId(questionChoiceRequest.getId());
                    questionChoice.setLessonQuestion(lessonQuestion);

                    return questionChoice;
                }
        ).collect(Collectors.toList());


        lessonQuestion.setTopic(topic);
        lessonQuestion.setId(id);

        lessonQuestion.setChoices(questionChoices);

        lessonQuestionRepository.save(lessonQuestion);
    }
}
