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

    // ================= map & shuffle questions =================
    private List<LessonQuestionResponse> mapAndShuffleQuestions(List<LessonQuestion> questions) {
        if (questions == null || questions.isEmpty()) return Collections.emptyList();

        // Shuffle danh sách câu hỏi trước
        Collections.shuffle(questions);

        List<LessonQuestionResponse> responses = new ArrayList<>();
        for (LessonQuestion question : questions) {
            LessonQuestionResponse response = lessonQuestionMapper.mapQuestionResponse(question);

            // Copy đáp án để shuffle mà không ảnh hưởng gốc
            List<QuestionChoiceResponse> choices = new ArrayList<>(response.getChoices());

            if (question.getQuestionType() == QuestionType.WORD_ORDER) {
                handleWordOrderQuestion(question, choices);
            } else {
                Collections.shuffle(choices);
            }

            response.setChoices(choices);
            responses.add(response);
        }

        return responses;
    }

    // ================= Helper tokenize =================
    private List<String> tokenizeSentenceForWordOrder(LessonQuestion question) {
        if (question.getChoices() == null || question.getChoices().isEmpty()) return Collections.emptyList();

        String sentence = null;
        String targetLang = question.getTargetLanguageCode();

        if ("ja".equalsIgnoreCase(targetLang)) {
            // Học tiếng Việt -> dùng meaning
            sentence = question.getChoices().get(0).getMeaning();
        } else if ("vi".equalsIgnoreCase(targetLang)) {
            // Học tiếng Nhật -> dùng textForeign
            sentence = question.getChoices().get(0).getTextForeign();
        }

        if (sentence == null || sentence.isBlank()) return Collections.emptyList();

        if ("ja".equalsIgnoreCase(targetLang)) {
            return VietnameseTokenizerUtil.tokenize(sentence, true);
        } else if ("vi".equalsIgnoreCase(targetLang)) {
            return JapaneseTokenizerUtil.tokenize(sentence);
        } else {
            return Collections.emptyList();
        }
    }

    // ================= WORD_ORDER handler =================
    private void handleWordOrderQuestion(LessonQuestion question, List<QuestionChoiceResponse> choices) {
        if (choices == null || choices.isEmpty()) return;

        List<String> tokens = tokenizeSentenceForWordOrder(question);

        // Gán token cho đáp án đầu tiên một cách an toàn
        choices.stream().findFirst().ifPresent(c -> c.setItems(tokens));
    }

    @Override
    public List<LessonQuestionResponse> getQuestionsForUser(String code) {
        List<LessonQuestion> listQuestions = lessonQuestionRepository.findLessonQuestionByLesson_CodeAndStatus(code,LearningStatus.PUBLISHED);

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
        if (topics.isEmpty()) return Collections.emptyList();

        int totalQuestionsNeeded = 8;
        int questionsPerTopic = (int) Math.ceil((double) totalQuestionsNeeded / topics.size());

        // Lấy câu hỏi lần 1 từ DB (LessonQuestion)
        List<LessonQuestion> questions = topics.stream()
                .flatMap(topic -> lessonQuestionRepository
                        .findRandomPublishedQuestionsByTopic(
                                topic.getId(),
                                questionsPerTopic,
                                LearningStatus.PUBLISHED.toString()
                        ).stream()
                )
                .collect(Collectors.toList());

        // Nếu thiếu → lấy bù
        int missing = totalQuestionsNeeded - questions.size();
        if (missing > 0) {
            List<LessonQuestion> extra = topics.stream()
                    .flatMap(topic -> lessonQuestionRepository
                            .findRandomPublishedQuestionsByTopic(
                                    topic.getId(),
                                    missing,
                                    LearningStatus.PUBLISHED.toString()
                            ).stream()
                    )
                    .filter(q -> questions.stream().noneMatch(e -> e.getId().equals(q.getId())))
                    .limit(missing)
                    .toList();
            questions.addAll(extra);
        }

        System.out.println(questions.size() + " -> số câu hỏi được random ra");

        // Map & shuffle đáp án, WORD_ORDER mới tách chuỗi
        return mapAndShuffleQuestions(questions)
                .stream()
                .limit(totalQuestionsNeeded)
                .toList();
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
        boolean questionExists = lessonQuestionRepository
                .existsByLessonIdAndTargetWordNative(data.getLessonId(), data.getTargetWordNative());

        if (questionExists) {
            throw new AppException(ExceptionCode.QUESTION_ALREADY_EXISTS);
        }

        // Check duplicate trong choiceRequests
        Set<String> seen = new HashSet<>();
        for (QuestionChoiceRequest cr : data.getChoiceRequests()) {
            String key = cr.getTextForeign() + "||" + cr.getMeaning();
            if (!seen.add(key)) {
                throw new AppException(ExceptionCode.DUPLICATE_CHOICE_IN_REQUEST);
            }
        }
        // Validate đáp án đúng
        boolean hasCorrectChoice = false;
        for (QuestionChoiceRequest cr : data.getChoiceRequests()) {
            if (cr.getIsCorrect()) {
                hasCorrectChoice = true;
                // Nếu dạng question yêu cầu match với targetWordNative thì check luôn
                if (!cr.getTextForeign().equalsIgnoreCase(data.getTargetWordNative())) {
                    throw new AppException(ExceptionCode.CORRECT_ANSWER_NOT_MATCH_TARGET);
                }
            }
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
        // 2️⃣ Check duplicate choice trong request (textForeign + meaning)
        if (data.getChoiceRequests() != null) {
            Set<String> seen = new HashSet<>();
            for (QuestionChoiceRequest cr : data.getChoiceRequests()) {
                String key = cr.getTextForeign() + "||" + cr.getMeaning();
                if (!seen.add(key)) {
                    throw new AppException(ExceptionCode.DUPLICATE_CHOICE_IN_REQUEST);
                }
            }
        }
        boolean updated = false;

        // Cập nhật các field cơ bản của LessonQuestion nếu có thay đổi
        if (!Objects.equals(data.getStatus(), question.getStatus())) {
            question.setStatus(data.getStatus());
            updated = true;
        }
        if (!Objects.equals(data.getTargetWordNative(), question.getTargetWordNative())) {
            // 1️⃣ Check duplicate question trong DB (bỏ qua chính câu hỏi đang update)
            boolean duplicateQuestion = lessonQuestionRepository
                    .existsByLessonIdAndTargetWordNativeAndIdNot(
                            question.getLesson().getId(),
                            data.getTargetWordNative(),
                            question.getId()
                    );
            if (duplicateQuestion) {
                throw new AppException(ExceptionCode.QUESTION_ALREADY_EXISTS);
            }

            // 2️⃣ Update targetWordNative
            question.setTargetWordNative(data.getTargetWordNative());
            updated = true;

            // 3️⃣ Nếu là câu hỏi có audio, update audio URL
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
