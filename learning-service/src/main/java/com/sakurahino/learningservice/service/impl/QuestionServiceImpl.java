package com.sakurahino.learningservice.service.impl;

import com.sakurahino.clients.feign.UploadServiceClients;
import com.sakurahino.common.ex.ExceptionCode;
import com.sakurahino.common.ex.ResourceException;
import com.sakurahino.learningservice.dto.questionchoice.ChoiceExcelRequest;
import com.sakurahino.learningservice.dto.question.LessonQuestionRequest;
import com.sakurahino.learningservice.dto.question.LessonQuestionResponse;
import com.sakurahino.learningservice.dto.questionchoice.QuestionChoiceResponse;
import com.sakurahino.learningservice.dto.question.QuestionExcelRequest;
import com.sakurahino.learningservice.entity.Lesson;
import com.sakurahino.learningservice.entity.LessonQuestion;
import com.sakurahino.learningservice.entity.QuestionChoice;
import com.sakurahino.learningservice.entity.Topic;
import com.sakurahino.learningservice.enums.LearningStatus;
import com.sakurahino.learningservice.enums.QuestionType;
import com.sakurahino.learningservice.mapper.ChoiceMapper;
import com.sakurahino.learningservice.mapper.LessonQuestionMapper;
import com.sakurahino.learningservice.repository.LessonQuestionRepository;
import com.sakurahino.learningservice.repository.LessonRepository;
import com.sakurahino.learningservice.repository.QuestionChoiceRepository;
import com.sakurahino.learningservice.repository.TopicRepository;
import com.sakurahino.learningservice.service.QuestionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
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
    private final LessonRepository lessonRepository;

    // Phần này dùng cho user để lấy câu hỏi ra
    private List<LessonQuestionResponse> mapAndShuffleQuestions(List<LessonQuestion> questions) {
        // Shuffle tổng thể câu hỏi
        Collections.shuffle(questions);

        // Map sang DTO và shuffle vị trí đáp án
        return questions.stream()
                .map(question -> {
                    LessonQuestionResponse response = lessonQuestionMapper.mapQuestionResponse(question);

                    List<QuestionChoiceResponse> choices = new ArrayList<>(response.getChoices());
                    Collections.shuffle(choices);
                    response.setChoices(choices);

                    return response;
                })
                .collect(Collectors.toList());
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



    //admin
    @Override
    public List<LessonQuestionResponse> getQuestionsByLessonIdAdmin(Integer lessonId) {
        List<LessonQuestion> lessonQuestions = lessonQuestionRepository.findLessonQuestionsByLesson_IdOrderByIdDesc(lessonId);
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
        Lesson lesson = lessonRepository.findById(questionRequest.getLessonId()).orElseThrow(() -> new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(),
                "Lesson không tồn tại (id)" + questionRequest.getLessonId()));

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


        lessonQuestion.setLesson(lesson);

        lessonQuestion.setChoices(questionChoices);

        lessonQuestionRepository.save(lessonQuestion);
    }

    @Override
    @Transactional
    public void updateQuestion(Integer id, LessonQuestionRequest questionRequest) {
        Lesson lesson = lessonRepository.findById(questionRequest.getLessonId()).orElseThrow(() -> new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(),
                "Lesson không tồn tại (id)" + questionRequest.getLessonId()));


        LessonQuestion lessonQuestioncheck = lessonQuestionRepository.findById(id).orElseThrow(() ->
                new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(), "Câu hỏi không tồn tại (id)" + id));

        if (lesson.getId() != lessonQuestioncheck.getLesson().getId()) {
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


        lessonQuestion.setLesson(lesson);
        lessonQuestion.setId(id);

        lessonQuestion.setChoices(questionChoices);

        lessonQuestionRepository.save(lessonQuestion);
    }

    @Override
    @Transactional // Đảm bảo toàn bộ quá trình import là một transaction
    public void importQuestionFromeExcel(Integer lessonId, MultipartFile excelFile) {
        if (excelFile.isEmpty()) {
            throw new IllegalArgumentException("File Excel không được trống.");
        }

        try (InputStream is = excelFile.getInputStream()) {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheetAt(0); // Lấy sheet đầu tiên

            Iterator<Row> rowIterator = sheet.iterator();
            List<LessonQuestion> questionsToSave = new ArrayList<>();

            // Bỏ qua hàng tiêu đề nếu có
            if (rowIterator.hasNext()) {
                rowIterator.next();
            }
            // Tìm Lesson trước một lần để tránh truy vấn nhiều lần trong vòng lặp và đảm bảo Lesson tồn tại
            Lesson lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new ResourceException(ExceptionCode.DU_LIEU_KHONG_TON_TAI.getStatus(),
                            "Lesson không tồn tại (id): " + lessonId));

            int rowNum = 1; // Bắt đầu từ hàng thứ 2 (hàng dữ liệu đầu tiên sau tiêu đề)
            while (rowIterator.hasNext()) {
                Row currentRow = rowIterator.next();
                rowNum++; // Tăng số hàng hiện tại

                // Bỏ qua toàn bộ hàng nếu nó trống rỗng hoàn toàn
                if (isRowEmpty(currentRow)) {
                    log.info("Bỏ qua hàng trống số: " + rowNum);
                    continue;
                }

                try {
                    // --- 1. Đọc dữ liệu từ Excel vào DTOs của bạn ---
                    QuestionExcelRequest questionExcelRequest = new QuestionExcelRequest();
                    List<ChoiceExcelRequest> choiceExcelRequests = new ArrayList<>();

                    // **CÁC CHỈ SỐ CỘT CỦA CÂU HỎI CHÍNH:**
                    // Cột A (0): QuestionType (TEXT_CHOICE, AUDIO_CHOICE, WORD_ORDER, etc.)
                    // Cột B (1): PromptTextTemplate (nội dung câu hỏi)
                    // Cột C (2): TargetWordNative
                    // Cột D (3): TargetLanguageCode
                    // Cột E (4): OptionsLanguageCode
                    // Cột F (5): TextAudioQuestion (văn bản để chuyển đổi thành URL audio câu hỏi)
                    // Cột G (6): CorrectAnswer (nếu bạn muốn lưu riêng cho câu hỏi, không phải trong Choice)
                    // Cột H (7): ExplainAnswer
                    // Cột I (8): Level

                    // Đọc dữ liệu cho QuestionExcelRequest
                    String questionTypeStr = getCellValueAsString(currentRow.getCell(0));
                    if (questionTypeStr == null || questionTypeStr.trim().isEmpty()) {
                        throw new IllegalArgumentException("Loại câu hỏi (cột A) không được để trống tại hàng " + rowNum);
                    }
                    questionExcelRequest.setQuestionType(questionTypeStr);

                    String promptTextTemplate = getCellValueAsString(currentRow.getCell(1));
                    if (promptTextTemplate == null || promptTextTemplate.trim().isEmpty()) {
                        throw new IllegalArgumentException("Nội dung câu hỏi (cột B) không được để trống tại hàng " + rowNum);
                    }
                    questionExcelRequest.setPromptTextTemplate(promptTextTemplate);

                    questionExcelRequest.setTargetWordNative(getCellValueAsString(currentRow.getCell(2)));
                    questionExcelRequest.setTargetLanguageCode(getCellValueAsString(currentRow.getCell(3)));
                    questionExcelRequest.setOptionsLanguageCode(getCellValueAsString(currentRow.getCell(4)));
                    questionExcelRequest.setTextAudioQuestion(getCellValueAsString(currentRow.getCell(5)));
                    // Thêm các trường khác nếu có
                    // lessonQuestion.setCorrectAnswer(getCellValueAsString(currentRow.getCell(6)));
                    // lessonQuestion.setExplainAnswer(getCellValueAsString(currentRow.getCell(7)));
                    // lessonQuestion.setLevel(getCellValueAsString(currentRow.getCell(8)));


                    // **CÁC CHỈ SỐ CỘT CỦA LỰA CHỌN (CHOICES):**
                    // Giả định mỗi lựa chọn chiếm 7 cột: TextForeign, TextRomaji, ImageUrl, TextAudioChoice, IsCorrect, TextBlock, Meaning
                    // Cột bắt đầu của Lựa chọn 1 là J (chỉ số 9)
                    int startingChoiceCol = 6;
                    int colsPerChoice = 7;

                    // Lặp qua tối đa 4 lựa chọn (có thể điều chỉnh số lượng này tùy theo nhu cầu của bạn)
                    for (int i = 0; i < 4; i++) {
                        int baseCol = startingChoiceCol + (i * colsPerChoice);

                        // Lấy giá trị của các ô quan trọng của lựa chọn
                        String textForeign = getCellValueAsString(currentRow.getCell(baseCol));
                        String imageUrl = getCellValueAsString(currentRow.getCell(baseCol + 2));
                        String textAudioChoice = getCellValueAsString(currentRow.getCell(baseCol + 3));
                        String isCorrectStr = getCellValueAsString(currentRow.getCell(baseCol + 4));
                        String meaning = getCellValueAsString(currentRow.getCell(baseCol + 6));


                        // Kiểm tra xem lựa chọn có dữ liệu đáng kể nào không
                        // Nếu tất cả các trường chính của một lựa chọn đều trống, thì bỏ qua lựa chọn đó
                        if ((textForeign == null || textForeign.trim().isEmpty()) &&
                                (imageUrl == null || imageUrl.trim().isEmpty()) &&
                                (textAudioChoice == null || textAudioChoice.trim().isEmpty()) &&
                                (isCorrectStr == null || isCorrectStr.trim().isEmpty()) &&
                                (meaning == null || meaning.trim().isEmpty())) {
                            continue; // Bỏ qua lựa chọn này nếu nó hoàn toàn trống
                        }

                        ChoiceExcelRequest choiceExcelRequest = new ChoiceExcelRequest();
                        choiceExcelRequest.setTextForeign(textForeign);
                        choiceExcelRequest.setTextRomaji(getCellValueAsString(currentRow.getCell(baseCol + 1)));
                        choiceExcelRequest.setImageUrl(imageUrl);
                        choiceExcelRequest.setTextAudioChoice(textAudioChoice);

                        // Xử lý IsCorrect (chuyển đổi "TRUE" thành true, ngược lại là false)
                        choiceExcelRequest.setIsCorrect(isCorrectStr != null && isCorrectStr.equalsIgnoreCase("TRUE"));

                        choiceExcelRequest.setTextBlock(getCellValueAsString(currentRow.getCell(baseCol + 5)));

                        choiceExcelRequest.setMeaning(meaning);

                        choiceExcelRequests.add(choiceExcelRequest);
                    }
                    questionExcelRequest.setChoiceRequests(choiceExcelRequests);

                    // --- 2. Ánh xạ DTOs sang Entities và xử lý audio/image URLs, đồng thời Validate nghiệp vụ ---
                    LessonQuestion lessonQuestion = new LessonQuestion();
                    lessonQuestion.setLesson(lesson); // Gán Lesson đã tìm được

                    // Validate và ánh xạ QuestionType
                    QuestionType questionType;
                    try {
                        questionType = QuestionType.valueOf(questionExcelRequest.getQuestionType().toUpperCase());
                    } catch (IllegalArgumentException e) {
                        throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(),
                                "Loại câu hỏi không hợp lệ '" + questionExcelRequest.getQuestionType() + "' tại hàng " + rowNum + ". Vui lòng kiểm tra enum QuestionType.");
                    }
                    lessonQuestion.setQuestionType(questionType);
                    lessonQuestion.setPromptTextTemplate(questionExcelRequest.getPromptTextTemplate());
                    lessonQuestion.setTargetWordNative(questionExcelRequest.getTargetWordNative());
                    lessonQuestion.setTargetLanguageCode(questionExcelRequest.getTargetLanguageCode());
                    lessonQuestion.setOptionsLanguageCode(questionExcelRequest.getOptionsLanguageCode());
                    // Ánh xạ các trường khác nếu có trong Entity (CorrectAnswer, ExplainAnswer, Level)


                    // Validate số lượng lựa chọn tùy theo loại câu hỏi (ví dụ)
                    if (questionType.equals(QuestionType.MULTIPLE_CHOICE_TEXT_ONLY) || questionType.equals(QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE)
                            || questionType.equals(QuestionType.AUDIO_CHOICE)) {
                        if (choiceExcelRequests.size() < 2) { // Ví dụ: cần ít nhất 2 lựa chọn
                            throw new IllegalArgumentException("Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn tại hàng " + rowNum);
                        }
                        long correctChoicesCount = choiceExcelRequests.stream().filter(ChoiceExcelRequest::getIsCorrect).count();
                        if (correctChoicesCount == 0) {
                            throw new IllegalArgumentException("Câu hỏi trắc nghiệm phải có ít nhất một đáp án đúng tại hàng " + rowNum);
                        }
                    }


                    // Validate nếu QuestionType là AUDIO_CHOICE thì PromptTextTemplate phải trống và có TextAudioQuestion
                    if (questionType.equals(QuestionType.AUDIO_CHOICE)) {
                        if (questionExcelRequest.getTextAudioQuestion() == null || questionExcelRequest.getTextAudioQuestion().trim().isEmpty()) {
                            throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(), "Hàng " + rowNum + ": Câu hỏi loại AUDIO_CHOICE yêu cầu 'TextAudioQuestion' không được trống .");
                        }
                    }

                    // Xử lý Audio cho câu hỏi chính
                    String textAudioQuestion = questionExcelRequest.getTextAudioQuestion();
                    if (textAudioQuestion != null && !textAudioQuestion.isEmpty()) {
                        try {
                            log.info("Hàng {}: Bắt đầu chuyển text thành url cho câu hỏi: '{}'", rowNum, textAudioQuestion);
                            var urlResponse = uploadServiceClients.upLoadText(textAudioQuestion);
                            lessonQuestion.setAudioUrlQuestions(urlResponse.getUrlImage());
                            log.info("Hàng {}: URL audio câu hỏi: {}", rowNum, urlResponse.getUrlImage());
                        } catch (Exception e) {
                            log.error("Hàng {}: Lỗi khi upload audio cho câu hỏi: {}. Sẽ để trống URL audio.", rowNum, e.getMessage());
                            lessonQuestion.setAudioUrlQuestions(null);
                        }
                    } else {
                        lessonQuestion.setAudioUrlQuestions(null);
                    }

                    // Xử lý Choices
                    List<QuestionChoice> questionChoices = new ArrayList<>();
                    for (ChoiceExcelRequest choiceExcelRequest : choiceExcelRequests) {
                        QuestionChoice questionChoice = new QuestionChoice();
                        questionChoice.setTextForeign(choiceExcelRequest.getTextForeign());
                        questionChoice.setTextRomaji(choiceExcelRequest.getTextRomaji());
                        questionChoice.setIsCorrect(choiceExcelRequest.getIsCorrect());
                        questionChoice.setTextBlock(choiceExcelRequest.getTextBlock());
                        questionChoice.setMeaning(choiceExcelRequest.getMeaning()); // Đã validate ở trên

                        // Gán Image URL trực tiếp từ DTO (không upload file ở đây)
                        questionChoice.setImageUrl(choiceExcelRequest.getImageUrl());

                        // Xử lý Audio cho lựa chọn
                        String textAudioChoice = choiceExcelRequest.getTextAudioChoice();
                        if (textAudioChoice != null && !textAudioChoice.isEmpty()) {
                            try {
                                log.info("Hàng {}: Bắt đầu chuyển text thành url cho lựa chọn: '{}'", rowNum, textAudioChoice);
                                var urlResponse = uploadServiceClients.upLoadText(textAudioChoice);
                                questionChoice.setAudioUrlForeign(urlResponse.getUrlImage());
                                log.info("Hàng {}: URL audio lựa chọn: {}", rowNum, urlResponse.getUrlImage());
                            } catch (Exception e) {
                                log.error("Hàng {}: Lỗi khi upload audio cho lựa chọn: {}. Sẽ để trống URL audio.", rowNum, e.getMessage());
                                questionChoice.setAudioUrlForeign(null);
                            }
                        } else {
                            questionChoice.setAudioUrlForeign(null);
                        }
                        if (lessonQuestion.getQuestionType().equals(QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE.toString())) {
                            if (questionChoice.getImageUrl() == null || questionChoice.getImageUrl().isEmpty()) {
                                throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(), "Hàng " + rowNum + ": Câu hỏi loại hình ảnh yêu cầu 'urlImage' không được trống .");
                            }
                        }
                        if (lessonQuestion.getQuestionType().equals(QuestionType.WORD_ORDER.toString())) {
                            if (questionChoice.getTextBlock() == null || questionChoice.getTextBlock().isEmpty()) {
                                throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(), "Hàng " + rowNum + ": Câu hỏi loại Xắp xếp yêu cầu 'TextBlock' không được trống .");
                            }
                        }
                        if (!questionType.equals(QuestionType.WRITING) || !questionType.equals(QuestionType.PRONUNCIATION) ){
                            if(questionChoice.getMeaning() == null || questionChoice.getMeaning().isEmpty()){
                                throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(), "Hàng " + rowNum + ": Không được để trống nghĩa câu trả lời với các câu lựa chọn.");

                            }
                        }

                        questionChoice.setLessonQuestion(lessonQuestion); // Thiết lập mối quan hệ
                        questionChoices.add(questionChoice);
                    }
                    if (lessonQuestion.getQuestionType().equals(QuestionType.WORD_ORDER.toString())) {
                        if (questionChoices.size() > 1) {
                            throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(), "Hàng " + rowNum + ": Câu hỏi loại Xắp xếp yêu cầu chỉ truyền lên 1 đáp án duy nhất.");
                        }
                    }
                    lessonQuestion.setChoices(questionChoices);
                    questionsToSave.add(lessonQuestion);

                } catch (IllegalArgumentException e) {
                    // Xử lý các lỗi validation nghiệp vụ (ví dụ: thiếu trường bắt buộc)
                    log.error("Lỗi dữ liệu tại hàng {}: {}", rowNum, e.getMessage());
                    throw new ResourceException(ExceptionCode.DU_LIEU_TRUYEN_LEN_SAI.getStatus(),
                            "Lỗi dữ liệu tại hàng " + rowNum + ": " + e.getMessage());
                } catch (ResourceException e) {
                    // Lỗi đã được định nghĩa trước (ví dụ: Lesson không tồn tại)
                    throw e;
                } catch (Exception e) {
                    // Các lỗi không mong muốn khác
                    log.error("Lỗi không mong muốn khi xử lý hàng Excel số {}: {}", rowNum, e.getMessage(), e);
                    throw new RuntimeException("Lỗi không mong muốn tại hàng " + rowNum + ": " + e.getMessage(), e);
                }
            }
            workbook.close();

            // Lưu tất cả các câu hỏi vào cơ sở dữ liệu
            if (!questionsToSave.isEmpty()) {
                lessonQuestionRepository.saveAll(questionsToSave);
                log.info("Đã import thành công {} câu hỏi từ Excel.", questionsToSave.size());
            } else {
                log.warn("Không có câu hỏi nào hợp lệ được tìm thấy trong tệp Excel.");
            }

        } catch (IOException e) {
            log.error("Lỗi đọc file Excel: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi khi đọc file Excel: " + e.getMessage(), e);
        } catch (ResourceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Lỗi tổng quát trong quá trình import dữ liệu: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi trong quá trình import dữ liệu: " + e.getMessage(), e);
        }
    }

    // Hàm tiện ích kiểm tra xem một hàng có hoàn toàn trống rỗng hay không.
    private boolean isRowEmpty(Row row) {
        if (row == null || row.getLastCellNum() <= 0) {
            return true;
        }
        for (int cellNum = row.getFirstCellNum(); cellNum < row.getLastCellNum(); cellNum++) {
            Cell cell = row.getCell(cellNum);
            if (cell != null && cell.getCellType() != CellType.BLANK && getCellValueAsString(cell) != null && !getCellValueAsString(cell).trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return null;
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return cell.getCachedFormulaResultType() == CellType.STRING ? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue());
                } catch (IllegalStateException e) {
                    // Log cảnh báo và trả về null nếu công thức không thể được tính toán
                    log.warn("Lỗi khi đọc công thức ở ô {}:{}. Trả về null.", cell.getRowIndex() + 1, cell.getColumnIndex() + 1);
                    return null;
                }
            case BLANK:
            case ERROR:
            default:
                return null;
        }
    }


}
