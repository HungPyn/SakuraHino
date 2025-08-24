package com.sakurahino.learningservice.service.impl;
import com.sakurahino.clients.dto.AudioUploadResponseDTO;
import com.sakurahino.clients.feign.UploadServiceClients;
import com.sakurahino.common.dto.PaginatedResponse;
import com.sakurahino.common.ex.AppException;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.util.TimeUtils;
import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.question.LessonQuestionResponse;
import com.sakurahino.learningservice.dto.questionchoice.QuestionChoiceRequest;
import com.sakurahino.learningservice.dto.questionchoice.QuestionChoiceResponse;
import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.QuestionType;
import com.sakurahino.learningservice.mapper.LessonQuestionMapper;
import com.sakurahino.learningservice.repository.LessonQuestionRepository;
import com.sakurahino.learningservice.repository.LessonRepository;
import com.sakurahino.learningservice.repository.TopicRepository;
import com.sakurahino.learningservice.service.QuestionChoiceService;
import com.sakurahino.learningservice.service.QuestionService;
import com.sakurahino.learningservice.utils.language.JapaneseTokenizerUtil;
import com.sakurahino.learningservice.utils.language.LanguageUtil;
import com.sakurahino.learningservice.utils.language.VietnameseTokenizerUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionServiceImpl implements QuestionService {

    private final QuestionChoiceService questionChoiceService;
    private final UploadServiceClients uploadServiceClients;
    private final LessonQuestionRepository lessonQuestionRepository;
    private final TopicRepository topicRepository;
    private final LessonQuestionMapper lessonQuestionMapper;
    private final LessonRepository lessonRepository;

    // Phần này dùng cho user để lấy câu hỏi ra
    private List<LessonQuestionResponse> mapAndShuffleQuestions(List<LessonQuestion> questions) {
        // Shuffle danh sách câu hỏi trước
        Collections.shuffle(questions);

        return questions.stream()
                .map(question -> {
                    LessonQuestionResponse response = lessonQuestionMapper.mapQuestionResponse(question);

                    // Copy và shuffle đáp án
                    List<QuestionChoiceResponse> choices = new ArrayList<>(response.getChoices());

                    // Xử lý riêng với câu hỏi dạng WORD_ORDER
                    if (question.getQuestionType() == QuestionType.WORD_ORDER) {
                        handleWordOrderQuestion(question, choices);
                    }

                    Collections.shuffle(choices);
                    response.setChoices(choices);
                    return response;
                })
                .toList();
    }

    private void handleWordOrderQuestion(LessonQuestion question, List<QuestionChoiceResponse> choices) {
        if (question.getChoices() == null || question.getChoices().isEmpty()) return;
        if (choices == null || choices.isEmpty()) return;

        String sentence = null;
        String targetLang = question.getTargetLanguageCode();

        if ("ja".equalsIgnoreCase(targetLang)) {
            // Học tiếng Việt -> dùng câu tiếng Việt (meaning)
            sentence = question.getChoices().get(0).getMeaning();
        } else if ("vi".equalsIgnoreCase(targetLang)) {
            // Học tiếng Nhật -> dùng câu tiếng Nhật (textForeign)
            sentence = question.getChoices().get(0).getTextForeign();
        }

        if (sentence == null || sentence.isBlank()) return;

        List<String> tokens;
        if ("ja".equalsIgnoreCase(targetLang)) {
            // Tokenizer tiếng Việt
            tokens = VietnameseTokenizerUtil.tokenize(sentence,true);
        } else if ("vi".equalsIgnoreCase(targetLang)) {
            // Tokenizer tiếng Nhật
            tokens = JapaneseTokenizerUtil.tokenize(sentence);
        } else {
            return; // Không hỗ trợ ngôn ngữ khác
        }

        // Gán token cho đáp án đầu tiên một cách an toàn
        choices.stream().findFirst().ifPresent(c -> c.setItems(tokens));
    }




    @Override
    public List<LessonQuestionResponse> getQuestionsForUser(String code) {
        List<LessonQuestion> listQuestions = lessonQuestionRepository.findLessonQuestionByLesson_Code(code);

        return mapAndShuffleQuestions(listQuestions);
    }

    @Override
    public List<LessonQuestionResponse> getQuestionsPractice(String code, int limit) {
        List<LessonQuestion> allQuestions =
                lessonQuestionRepository.findAllByTopicCodeWithChoicesPublished(code);

        // Group theo lesson
        Map<Integer, List<LessonQuestion>> questionsByLesson = allQuestions.stream()
                .collect(Collectors.groupingBy(q -> q.getLesson().getId()));

        List<LessonQuestion> pickedQuestions = new ArrayList<>();
        Random random = new Random();

        // Mỗi lesson chọn random 1 câu
        for (List<LessonQuestion> questions : questionsByLesson.values()) {
            int randomIndex = random.nextInt(questions.size());
            pickedQuestions.add(questions.get(randomIndex));
        }

        // Nếu chưa đủ limit → random thêm từ pool còn lại
        allQuestions.removeAll(pickedQuestions);
        Collections.shuffle(allQuestions);
        Collections.shuffle(pickedQuestions);

        for (LessonQuestion q : allQuestions) {
            if (pickedQuestions.size() >= limit) break;
            pickedQuestions.add(q);
        }
        return mapAndShuffleQuestions(pickedQuestions);
    }


    @Override
    public List<LessonQuestionResponse> getQuestionsTestForUser() {
        List<Topic> topics = topicRepository.findFirstPublishedTopics(
                LearningStatus.PUBLISHED,
                PageRequest.of(0, 2)
        );

        if (topics.isEmpty()) {
            return Collections.emptyList();
        }

        int totalQuestionsNeeded = 8;
        int questionsPerTopic = (int) Math.ceil((double) totalQuestionsNeeded / topics.size());

        // Lấy câu hỏi lần 1
        List<LessonQuestionResponse> questions = topics.stream()
                .flatMap(topic -> lessonQuestionRepository
                        .findRandomPublishedQuestionsByTopic(
                                topic.getId(),
                                questionsPerTopic,
                                LearningStatus.PUBLISHED.toString()
                        ).stream()
                )
                .map(lessonQuestionMapper::mapQuestionResponse)
                .collect(Collectors.toList());

        // Nếu vẫn thiếu → lấy bù từ các topic đã chọn
        if (questions.size() < totalQuestionsNeeded) {
            int missing = totalQuestionsNeeded - questions.size();

            // Random bù từ các topic đã có
            List<LessonQuestionResponse> extra = topics.stream()
                    .flatMap(topic -> lessonQuestionRepository
                            .findRandomPublishedQuestionsByTopic(
                                    topic.getId(),
                                    missing, // tăng limit để có thể lấy bù
                                    LearningStatus.PUBLISHED.toString()
                            ).stream()
                    )
                    .map(lessonQuestionMapper::mapQuestionResponse)
                    .toList();

            // Tránh trùng câu hỏi
            Set<Integer> existingIds = questions.stream()
                    .map(LessonQuestionResponse::getId)
                    .collect(Collectors.toSet());

            extra.stream()
                    .filter(q -> !existingIds.contains(q.getId()))
                    .limit(missing)
                    .forEach(questions::add);
        }
        System.out.println(questions.size() +"-> số câu hỏi được random ra");
        return questions.stream().limit(totalQuestionsNeeded).toList();
    }


    // admin
    @Override
    public PaginatedResponse<LessonQuestionResponse> getAllForAdmin(Integer lessonId,int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        // Lấy page các LessonQuestion
        Page<LessonQuestion> questionPage = lessonQuestionRepository.findAllByLesson_IdOrderByCreatedAtDesc(lessonId,pageable);

        // Map từng LessonQuestion sang LessonQuestionResponse
        List<LessonQuestionResponse> responseList = questionPage.getContent().stream()
                .map(lessonQuestionMapper::mapQuestionResponse)
                .toList();

        return new PaginatedResponse<>(
                responseList,                          // items
                questionPage.getNumber(),              // page
                (int) questionPage.getTotalElements(), // totalItems (cast từ long → int)
                questionPage.getTotalPages(),          // totalPages
                questionPage.hasNext()                 // hasNext
        );
    }

    @Override
    public LessonQuestionResponse getQuestionById(Integer questionId) {
        LessonQuestion question = lessonQuestionRepository.findById(questionId)
                .orElseThrow(
                        () -> new AppException(ExceptionCode.QUESTION_NOT_FOUND)
                );
        return lessonQuestionMapper.mapQuestionResponse(question);
    }

    @Override
    @Transactional
    public LessonQuestionResponse create(LessonQuestionRequest data,Map<String, MultipartFile> imageFilesMap) {
        Lesson l = lessonRepository.findById(data.getLessonId())
                .orElseThrow(()->new AppException(ExceptionCode.LESSON_KHONG_TON_TAI));
        int publishedCount = lessonQuestionRepository.countQuestions(l.getId(), LearningStatus.PUBLISHED);
        if (l.getMaxQuestions()<= publishedCount && data.getStatus()== LearningStatus.PUBLISHED) {
            throw new AppException(ExceptionCode.MAX_PUBLIC_QUESTION_REACHED);
        }
       LessonQuestion lq = new LessonQuestion();
       lq.setLesson(l);
       lq.setStatus(data.getStatus());
       lq.setCreatedAt(TimeUtils.nowInstant());
        lq.setQuestionType(data.getQuestionType());
        if (LanguageUtil.isJapanese(data.getTargetWordNative())) {
            lq.setTargetLanguageCode("ja");
        } else if (LanguageUtil.isVietnamese(data.getTargetWordNative())) {
            lq.setTargetLanguageCode("vi");
        } else {
            lq.setTargetLanguageCode("unknown");
        }
       if (data.getQuestionType() == QuestionType.PRONUNCIATION|| data.getQuestionType()== QuestionType.AUDIO_CHOICE) {
           AudioUploadResponseDTO response = uploadServiceClients.upLoadText(data.getTargetWordNative());
           lq.setAudioUrl(response.getUrlAudio()); // hoặc getUrlImage() tùy field
       }
       lq.setTargetWordNative(data.getTargetWordNative());
       lq.setPromptTextTemplate(data.getPromptTextTemplate());
        lq = lessonQuestionRepository.save(lq);
        // Gọi addChoice sau khi có ID
        if (data.getChoiceRequests() != null && !data.getChoiceRequests().isEmpty()) {
            questionChoiceService.addQuestionChoice(lq,data.getChoiceRequests(), imageFilesMap);
        }

        return lessonQuestionMapper.mapQuestionResponse(lq);
    }

    @Override
    @Transactional
    public LessonQuestionResponse update(Integer questionId,LessonQuestionRequest data, Map<String, MultipartFile> imageFilesMap) {
        // Lấy LessonQuestion hiện tại
        LessonQuestion question = lessonQuestionRepository.findById(questionId)
                .orElseThrow(() -> new AppException(ExceptionCode.QUESTION_NOT_FOUND));

        boolean updated = false;

        // Cập nhật các field cơ bản của LessonQuestion nếu có thay đổi
        if (!Objects.equals(data.getStatus(), question.getStatus())) {
            question.setStatus(data.getStatus());
            updated = true;
        }
        if (!Objects.equals(data.getTargetWordNative(), question.getTargetWordNative())) {
            question.setTargetWordNative(data.getTargetWordNative());
            updated = true;
            // Nếu là câu hỏi có audio, update audio URL
            if (data.getQuestionType() == QuestionType.PRONUNCIATION
                    || data.getQuestionType() == QuestionType.AUDIO_CHOICE) {
                AudioUploadResponseDTO response = uploadServiceClients.upLoadText(data.getTargetWordNative());
                question.setAudioUrl(response.getUrlAudio());
            }
        }
        if (!Objects.equals(data.getPromptTextTemplate(), question.getPromptTextTemplate())) {
            question.setPromptTextTemplate(data.getPromptTextTemplate());
            updated = true;
        }

        // Chỉ update các QuestionChoice đã có id
        if (data.getChoiceRequests() != null) {
            for (QuestionChoiceRequest cr : data.getChoiceRequests()) {
                if (cr.getId() != null) {
                    questionChoiceService.updateQuestionChoice(cr.getId(), cr, imageFilesMap);
                }
            }
        }

        // Lưu LessonQuestion nếu có thay đổi
        if (updated) {
            question = lessonQuestionRepository.save(question);
        }

        // Map sang response
        return lessonQuestionMapper.mapQuestionResponse(question);
    }

    @Override
    public void delete(Integer questionId) {
        LessonQuestion lessonQuestion = lessonQuestionRepository.findById(questionId)
                .orElseThrow(() -> new AppException(ExceptionCode.QUESTION_NOT_FOUND));
        lessonQuestion.setStatus(LearningStatus.DELETED);
        lessonQuestionRepository.save(lessonQuestion);
    }

}
