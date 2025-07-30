<template>
  <div class="container mt-4">
    <div class="card p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0">Danh sách Câu hỏi</h3>
        <div>
          <button @click="openNewQuestionForm" class="btn btn-success me-2">
            <i class="bi bi-plus-circle"></i> Thêm câu hỏi mới
          </button>
          <button @click="importFromExcel" class="btn btn-info">
            <i class="bi bi-file-earmark-excel"></i> Thêm bằng file Excel
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-hover table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Loại câu hỏi</th>
              <th>Câu hỏi</th>
              <th>Từ đích</th>
              <th>số lựa chọn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="q in questions" :key="q.id">
              <td>{{ q.id }}</td>
              <td>{{ getQuestionTypeName(q.questionType) }}</td>
              <td>
                {{
                  q.promptTextTemplate.replace(
                    "{targetWordNative}",
                    q.targetWordNative
                  )
                }}
              </td>
              <td>{{ q.targetWordNative }}</td>
              <td>{{ q.choices.length }}</td>
              <td>
                <button
                  @click="editQuestion(q.id)"
                  class="btn btn-warning btn-sm me-2"
                >
                  Sửa
                </button>
                <button
                  @click="viewQuestionDetail(q.id)"
                  class="btn btn-danger btn-sm"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <QuestionFormModal
    ref="questionModalRef"
    :lessonId="currentLessonId"
    @question-saved="handleQuestionSaved"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router"; // Import useRoute để lấy route params
import QuestionFormModal from "../lesson/QuestionFormModal.vue"; // Import component con
// const lessonId = router.params.lessonId;

const route = useRoute(); // Lấy đối tượng route
const currentLessonId = ref(null); // Biến để lưu lessonId hiện tại

// Các biến trạng thái để điều khiển form con (modal)
const showQuestionForm = ref(false); // Điều khiển ẩn/hiện modal
const currentQuestion = ref(null); // Dữ liệu câu hỏi được chỉnh sửa hoặc tạo mới
const isEditing = ref(false); // true nếu đang sửa, false nếu đang thêm

const questions = ref([]);

const questionTypeMap = {
  MULTIPLE_CHOICE_VOCAB_IMAGE: "Trắc nghiệm hình ảnh",
  MULTIPLE_CHOICE_TEXT_ONLY: "Trắc nghiệm văn bản",
  AUDIO_CHOICE: "Chọn qua âm thanh",
  WORD_ORDER: "Sắp xếp từ",
  PRONUNCIATION: "Phát âm",
  WRITING: "Viết",
};

const getQuestionTypeName = (type) => {
  return questionTypeMap[type] || type;
};

// --- Hàm cho nút "Thêm câu hỏi mới" ---
const openNewQuestionForm = () => {
  isEditing.value = false; // Đặt trạng thái là thêm mới
  currentQuestion.value = {
    id: null,
    lessonId: currentLessonId.value, // TRUYỀN lessonId VÀO initialQuestion
    questionType: "MULTIPLE_CHOICE_TEXT_ONLY",
    promptTextTemplate: "",
    targetWordNative: "",
    targetLanguageCode: "ja", // Mặc định Nhật Bản
    optionsLanguageCode: "vi", // Mặc định Tiếng Việt
    audioUrlQuestions: null,
    choices: [
      // Khởi tạo 4 lựa chọn trống mặc định
      {
        id: null,
        lessonQuestionId: null,
        textForeign: "",
        textRomaji: "",
        imageUrl: null,
        audioUrlForeign: null,
        isCorrect: false,
        textBlock: "",
        meaning: "",
      },
      {
        id: null,
        lessonQuestionId: null,
        textForeign: "",
        textRomaji: "",
        imageUrl: null,
        audioUrlForeign: null,
        isCorrect: false,
        textBlock: "",
        meaning: "",
      },
      {
        id: null,
        lessonQuestionId: null,
        textForeign: "",
        textRomaji: "",
        imageUrl: null,
        audioUrlForeign: null,
        isCorrect: false,
        textBlock: "",
        meaning: "",
      },
      {
        id: null,
        lessonQuestionId: null,
        textForeign: "",
        textRomaji: "",
        imageUrl: null,
        audioUrlForeign: null,
        isCorrect: false,
        textBlock: "",
        meaning: "",
      },
    ],
  };
  showQuestionForm.value = true; // Hiển thị form con
};

// Hàm khi bấm "Sửa" trên từng hàng
const editQuestion = (questionIdToEdit) => {
  isEditing.value = true; // Đặt trạng thái là chỉnh sửa
  // Tìm câu hỏi trong mảng `questions`
  const questionToEdit = questions.value.find((q) => q.id === questionIdToEdit);
  if (questionToEdit) {
    // Tạo bản sao sâu để tránh chỉnh sửa trực tiếp dữ liệu trong danh sách
    currentQuestion.value = JSON.parse(JSON.stringify(questionToEdit));
    showQuestionForm.value = true; // Hiển thị form con
  } else {
    alert("Không tìm thấy câu hỏi để chỉnh sửa.");
  }
};

// Hàm xử lý khi form con emit 'question-saved'
const handleQuestionSaved = (savedQuestion) => {
  if (isEditing.value) {
    // Logic cập nhật câu hỏi hiện có trong danh sách
    const index = questions.value.findIndex((q) => q.id === savedQuestion.id);
    if (index !== -1) {
      questions.value[index] = savedQuestion;
    }
    alert("Cập nhật câu hỏi thành công!");
  } else {
    // Logic thêm câu hỏi mới vào danh sách
    questions.value.push(savedQuestion);
    alert("Thêm câu hỏi mới thành công!");
  }
  closeQuestionForm(); // Đóng form sau khi lưu
  // TODO: Ở đây bạn sẽ gọi API để lưu/cập nhật dữ liệu lên server
  console.log("Dữ liệu câu hỏi đã lưu:", savedQuestion);
};

// Hàm đóng form con (modal)
const closeQuestionForm = () => {
  showQuestionForm.value = false;
  currentQuestion.value = null; // Reset dữ liệu form
};

// Hàm xóa câu hỏi (ví dụ, bạn có thể triển khai popup xác nhận)
const deleteQuestion = (id) => {
  if (confirm(`Bạn có chắc chắn muốn xóa câu hỏi ID: ${id} không?`)) {
    questions.value = questions.value.filter((q) => q.id !== id);
    alert("Xóa câu hỏi thành công!");
    // TODO: Gọi API xóa câu hỏi
  }
};

const importFromExcel = () => {
  alert('Chức năng "Thêm bằng file Excel" sẽ được phát triển sau.');
};
onMounted(async () => {
  // Giả lập fetch từ API, bạn nên thay bằng fetch thực tế từ backend
  // Đây là mảng dữ liệu mock mà bạn đã cung cấp
  const mockData = [
    {
      id: 1,
      lessonId: 101,
      questionType: "MULTIPLE_CHOICE_VOCAB_IMAGE",
      promptTextTemplate: "Chọn hình đúng với từ '{targetWordNative}'",
      targetWordNative: "りんご",
      targetLanguageCode: "ja",
      optionsLanguageCode: "vi",
      audioUrlQuestions: "https://example.com/audio/apple.mp3",
      choices: [
        {
          id: 101,
          lessonQuestionId: 1,
          textForeign: "りんご",
          textRomaji: "ringo",
          imageUrl: "https://example.com/images/apple.png",
          audioUrlForeign: "https://example.com/audio/apple_choice.mp3",
          isCorrect: true,
          textBlock: null,
          meaning: "quả táo",
        },
        {
          id: 102,
          lessonQuestionId: 1,
          textForeign: "みかん",
          textRomaji: "mikan",
          imageUrl: "https://example.com/images/orange.png",
          audioUrlForeign: "https://example.com/audio/orange_choice.mp3",
          isCorrect: false,
          textBlock: null,
          meaning: "quả quýt",
        },
        {
          id: 103,
          lessonQuestionId: 1,
          textForeign: "バナナ",
          textRomaji: "banana",
          imageUrl: "https://example.com/images/banana.png",
          audioUrlForeign: "https://example.com/audio/banana_choice.mp3",
          isCorrect: false,
          textBlock: null,
          meaning: "quả chuối",
        },
        {
          id: 104,
          lessonQuestionId: 1,
          textForeign: "ぶどう",
          textRomaji: "budou",
          imageUrl: "https://example.com/images/grape.png",
          audioUrlForeign: "https://example.com/audio/grape_choice.mp3",
          isCorrect: false,
          textBlock: null,
          meaning: "quả nho",
        },
      ],
    },
    {
      id: 2,
      lessonId: 101,
      questionType: "MULTIPLE_CHOICE_TEXT_ONLY",
      promptTextTemplate: "Chọn nghĩa đúng của từ '{targetWordNative}'",
      targetWordNative: "先生",
      targetLanguageCode: "ja",
      optionsLanguageCode: "vi",
      audioUrlQuestions: "https://example.com/audio/sensei.mp3",
      choices: [
        {
          id: 201,
          lessonQuestionId: 2,
          textForeign: null,
          textRomaji: null,
          imageUrl: null,
          audioUrlForeign: null,
          isCorrect: true,
          textBlock: "giáo viên",
          meaning: null,
        },
        {
          id: 202,
          lessonQuestionId: 2,
          textForeign: null,
          textRomaji: null,
          imageUrl: null,
          audioUrlForeign: null,
          isCorrect: false,
          textBlock: "học sinh",
          meaning: null,
        },
        {
          id: 203,
          lessonQuestionId: 2,
          textForeign: null,
          textRomaji: null,
          imageUrl: null,
          audioUrlForeign: null,
          isCorrect: false,
          textBlock: "bác sĩ",
          meaning: null,
        },
        {
          id: 204,
          lessonQuestionId: 2,
          textForeign: null,
          textRomaji: null,
          imageUrl: null,
          audioUrlForeign: null,
          isCorrect: false,
          textBlock: "kỹ sư",
          meaning: null,
        },
      ],
    },
    {
      id: 3,
      lessonId: 102,
      questionType: "AUDIO_CHOICE",
      promptTextTemplate: "Nghe và chọn từ đúng",
      targetWordNative: "ありがとう",
      targetLanguageCode: "ja",
      optionsLanguageCode: "ja",
      audioUrlQuestions: "https://example.com/audio/arigato.mp3",
      choices: [
        {
          id: 301,
          lessonQuestionId: 3,
          textForeign: "ありがとう",
          textRomaji: "arigato",
          imageUrl: null,
          audioUrlForeign: null,
          isCorrect: true,
          textBlock: null,
          meaning: null,
        },
        {
          id: 302,
          lessonQuestionId: 3,
          textForeign: "すみません",
          textRomaji: "sumimasen",
          imageUrl: null,
          audioUrlForeign: null,
          isCorrect: false,
          textBlock: null,
          meaning: null,
        },
        {
          id: 303,
          lessonQuestionId: 3,
          textForeign: "おはよう",
          textRomaji: "ohayou",
          imageUrl: null,
          audioUrlForeign: null,
          isCorrect: false,
          textBlock: null,
          meaning: null,
        },
        {
          id: 304,
          lessonQuestionId: 3,
          textForeign: "さようなら",
          textRomaji: "sayounara",
          imageUrl: null,
          audioUrlForeign: null,
          isCorrect: false,
          textBlock: null,
          meaning: null,
        },
      ],
    },
    {
      id: 4,
      lessonId: 103,
      questionType: "WORD_ORDER",
      promptTextTemplate:
        "Sắp xếp các từ sau thành câu đúng: '{targetWordNative}'",
      targetWordNative: "Tôi | là | giáo viên",
      targetLanguageCode: "vi",
      optionsLanguageCode: "vi",
      audioUrlQuestions: null,
      choices: [
        {
          id: 401,
          lessonQuestionId: 4,
          textForeign: null,
          textRomaji: null,
          imageUrl: null,
          audioUrlForeign: null,
          isCorrect: true,
          textBlock: "Tôi là giáo viên",
          meaning: null,
        },
        {
          id: 402,
          lessonQuestionId: 4,
          textForeign: null,
          textRomaji: null,
          imageUrl: null,
          audioUrlForeign: null,
          isCorrect: false,
          textBlock: "Giáo viên là tôi",
          meaning: null,
        },
        {
          id: 403,
          lessonQuestionId: 4,
          textForeign: null,
          textRomaji: null,
          imageUrl: null,
          audioUrlForeign: null,
          isCorrect: false,
          textBlock: "Là tôi giáo viên",
          meaning: null,
        },
        {
          id: 404,
          lessonQuestionId: 4,
          textForeign: null,
          textRomaji: null,
          imageUrl: null,
          audioUrlForeign: null,
          isCorrect: false,
          textBlock: "Giáo viên tôi là",
          meaning: null,
        },
      ],
    },
    {
      id: 5,
      lessonId: 104,
      questionType: "WRITING",
      promptTextTemplate: "Nhìn hình và nhập từ đúng",
      targetWordNative: "りんご",
      targetLanguageCode: "ja",
      optionsLanguageCode: null,
      audioUrlQuestions: null,
      choices: [
        {
          id: 501,
          lessonQuestionId: 5,
          textForeign: "りんご",
          textRomaji: "ringo",
          imageUrl: "https://example.com/images/apple_for_writing.png",
          audioUrlForeign: null,
          isCorrect: true,
          textBlock: null,
          meaning: "quả táo",
        },
        {
          id: 502,
          lessonQuestionId: 5,
          textForeign: "みかん",
          textRomaji: "mikan",
          imageUrl: "https://example.com/images/orange_for_writing.png",
          audioUrlForeign: null,
          isCorrect: false,
          textBlock: null,
          meaning: "quả quýt",
        },
        {
          id: 503,
          lessonQuestionId: 5,
          textForeign: "バナナ",
          textRomaji: "banana",
          imageUrl: "https://example.com/images/banana_for_writing.png",
          audioUrlForeign: null,
          isCorrect: false,
          textBlock: null,
          meaning: "quả chuối",
        },
        {
          id: 504,
          lessonQuestionId: 5,
          textForeign: "ぶどう",
          textRomaji: "budou",
          imageUrl: "https://example.com/images/grape_for_writing.png",
          audioUrlForeign: null,
          isCorrect: false,
          textBlock: null,
          meaning: "quả nho",
        },
      ],
    },
  ];
  questions.value = mockData; // Gán dữ liệu mock vào biến `questions`
  console.log("Danh sách câu hỏi:", questions.value);
});
</script>

<style scoped>
/* Tùy chỉnh nếu cần */
</style>
