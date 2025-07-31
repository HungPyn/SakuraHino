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
        <div
          v-if="questions.length === 0"
          class="alert alert-warning text-center"
          role="alert"
        >
          Chưa có câu hỏi nào được tạo cho bài học này.
        </div>

        <table v-else class="table table-striped table-hover table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Loại câu hỏi</th>
              <th>Câu hỏi</th>
              <th>Từ đích</th>
              <th>Số lựa chọn</th>
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
                  @click="editQuestion(q)"
                  class="btn btn-warning btn-sm me-2"
                >
                  Sửa
                </button>
                <button
                  @click="deleteQuestion(q.id)"
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

    <!-- Modal form -->
    <QuestionFormModal
      ref="questionModalRef"
      :lessonId="currentLessonId"
      @question-saved="handleQuestionSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import QuestionFormModal from "../lesson/QuestionFormModal.vue";

const route = useRoute();
const currentLessonId = ref(Number(route.params.lessonId || 101)); // fallback to 101
const questionModalRef = ref(null);
const isEditing = ref(false);
const questions = ref([]);

const questionTypeMap = {
  MULTIPLE_CHOICE_VOCAB_IMAGE: "Trắc nghiệm hình ảnh",
  MULTIPLE_CHOICE_TEXT_ONLY: "Trắc nghiệm văn bản",
  AUDIO_CHOICE: "Chọn qua âm thanh",
  WORD_ORDER: "Sắp xếp từ",
  PRONUNCIATION: "Phát âm",
  WRITING: "Viết",
};

const getQuestionTypeName = (type) => questionTypeMap[type] || type;

const openNewQuestionForm = () => {
  isEditing.value = false;
  questionModalRef.value.openModal({ mode: "create" });
};

const editQuestion = (question) => {
  if (!question) return alert("Không tìm thấy câu hỏi.");
  questionModalRef.value.openModal({
    ...question,
  });
};
const handleQuestionSaved = (savedQuestion) => {
  const index = questions.value.findIndex((q) => q.id === savedQuestion.id);
  if (index !== -1) {
    questions.value[index] = savedQuestion;
  } else {
    questions.value.push(savedQuestion);
  }
};

const deleteQuestion = (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
    questions.value = questions.value.filter((q) => q.id !== id);
  }
};

const importFromExcel = () => {
  alert("Chức năng import sẽ được phát triển sau.");
};

onMounted(() => {
  // Load mock data
  questions.value = getMockData();
});

function getMockData() {
  return [
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
}
</script>

<style scoped>
/* Tùy chỉnh giao diện nếu cần */
</style>
