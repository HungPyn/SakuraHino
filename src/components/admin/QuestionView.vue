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
              <th>trạng thái</th>
              <th>Câu hỏi</th>
              <th>Từ đích</th>
              <th>Số lựa chọn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(q, index) in questions" :key="q.id">
              <td>{{ index + 1 }}</td>
              <td>{{ getQuestionTypeName(q.questionType) }}</td>
              <td>
                <span
                  :class="[
                    'badge',
                    q.status === 'PUBLISHED'
                      ? 'bg-success'
                      : q.status === 'PENDING'
                      ? 'bg-warning'
                      : q.status === 'DELETED'
                      ? 'bg-danger'
                      : 'bg-secondary',
                  ]"
                >
                  {{
                    q.status === "PUBLISHED"
                      ? "Đã xuất bản"
                      : q.status === "PENDING"
                      ? "Chờ duyệt"
                      : q.status === "DELETED"
                      ? "Đã xóa"
                      : "Không xác định"
                  }}
                </span>
              </td>
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
      <nav
        aria-label="Page navigation example"
        class="d-flex justify-content-center mt-4"
      >
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 0 }">
            <button
              class="page-link"
              @click.prevent="goToPage(currentPage - 1)"
            >
              Previous
            </button>
          </li>

          <li
            class="page-item"
            v-for="n in totalPages"
            :key="n - 1"
            :class="{ active: n - 1 === currentPage }"
          >
            <button class="page-link" @click.prevent="goToPage(n - 1)">
              {{ n }}
            </button>
          </li>

          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages - 1 }"
          >
            <button
              class="page-link"
              @click.prevent="goToPage(currentPage + 1)"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Modal form -->
    <QuestionFormModal
      ref="questionModalRef"
      @question-saved="handleQuestionSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import QuestionFormModal from "../lesson/QuestionFormModal.vue";
import questionService from "@/services/questionService";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { bs } from "date-fns/locale";

const route = useRoute();
const lessonId = ref(Number(route.params.lessonId));
const questionModalRef = ref(null);
const isEditing = ref(false);
const questions = ref([]);
const toast = useToast();

const questionTypeMap = {
  MULTIPLE_CHOICE_VOCAB_IMAGE: "Trắc nghiệm hình ảnh",
  MULTIPLE_CHOICE_TEXT_ONLY: "Trắc nghiệm văn bản",
  AUDIO_CHOICE: "Nghe và chọn đáp án",
  WORD_ORDER: "Sắp xếp từ",
  PRONUNCIATION: "Luyện phát âm",
  WRITING: "Luyện viết",
};

const currentQuestion = ref({
  id: null,
  lessonId: null, // thay cho lesson trong entity
  questionType: null,
  promptTextTemplate: "",
  targetWordNative: "",
  targetLanguageCode: "",
  audioUrl: "",
  status: null,
  createdAt: null,
  updatedAt: null,
  choices: [
    {
      id: null,
      textForeign: "",
      textRomaji: "",
      imageUrl: "",
      audioUrlForeign: "",
      isCorrect: false,
      meaning: "",
    },
  ],
});
const newQuestion = {
  id: null,
  lessonId: null, // thay cho lesson trong entity
  questionType: "MULTIPLE_CHOICE_TEXT_ONLY",
  promptTextTemplate: "",
  targetWordNative: "",
  targetLanguageCode: "",
  audioUrl: "",
  status: "PUBLISHED",
  createdAt: null,
  updatedAt: null,
  choiceRequests: [
    {
      id: null,
      textForeign: "",
      textRomaji: "",
      imageUrl: "",
      audioUrlForeign: "",
      isCorrect: false,
      meaning: "",
    },
  ],
};

const getQuestionTypeName = (type) => questionTypeMap[type] || type;

const openNewQuestionForm = () => {
  currentQuestion.value = { ...newQuestion };
  questionModalRef.value.openModal({
    currentQuestion: newQuestion.value,
    lessonId: lessonId.value,
    isEditing: false,
  });
};

const editQuestion = (question) => {
  if (!question) return toast.error("Không tìm thấy câu hỏi.");
  currentQuestion.value = { ...question };
  questionModalRef.value.openModal({
    currentQuestion: currentQuestion.value,
    lessonId: lessonId.value,
    isEditing: true,
  });
};
const handleQuestionSaved = async (savedData) => {
  const { allImages, ...question } = savedData;
  if (!question.id) {
    const result = await Swal.fire({
      title: `Xác nhận thêm câu hỏi không`,

      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        const response = await questionService.createQuestion(
          question,
          allImages || []
        );

        getQuestions(); // Cập nhật danh sách câu hỏi sau khi thêm
        if (response === false) {
          return;
        }

        if (questionModalRef.value) {
          questionModalRef.value.closeModal();
        }
      } catch (error) {
        console.error("Lỗi khi thêm câu hỏi:", error);
      }
    }
  } else {
    const result = await Swal.fire({
      title: `Xác nhận cập nhật câu hỏi không`,

      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        const response = await questionService.updateQuestion(
          question.id,
          question,
          allImages || []
        );

        getQuestions(); // Cập nhật danh sách câu hỏi sau khi thêm
        if (response === false) {
          return;
        }

        if (questionModalRef.value) {
          questionModalRef.value.closeModal();
        }
      } catch (error) {
        console.error("Lỗi khi thêm câu hỏi:", error);
      }
    }
  }
};

const deleteQuestion = async (id) => {
  const result = await Swal.fire({
    title: `Xác nhận xóa`,
    text: `Bạn có chắc muốn xóa câu hỏi này?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });

  if (result.isConfirmed) {
    try {
      await questionService.deleteQuestion(id);

      // Thông báo xóa thành công
      toast.success(`Đã xóa câu hỏi thành công!`);
      getQuestions(); // Cập nhật danh sách câu hỏi sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa câu hỏi:", error);
    }
  }
};

const importFromExcel = () => {
  alert("Chức năng import sẽ được phát triển sau.");
};

const goToPage = (newPage) => {
  if (
    newPage >= 0 &&
    newPage < totalPages.value &&
    newPage !== currentPage.value
  ) {
    currentPage.value = newPage;
    getQuestions(); // fetch lại dữ liệu trang mới
  } else if (
    totalPages.value === 0 &&
    newPage === 0 &&
    currentPage.value !== 0
  ) {
    currentPage.value = 0;
    getQuestions(); // vẫn gọi lại để đảm bảo dữ liệu
  }
};
const currentPage = ref(0); // Trang hiện tại (0-indexed để khớp với backend)
const size = ref(10); // Kích thước trang
const totalPages = ref(0); // Tổng số trang
const getQuestions = async () => {
  try {
    const { list, totalPages: tp } = await questionService.getQuestions({
      lessonId: lessonId.value,
      page: currentPage.value,
      size: size.value,
    });

    questions.value = list;

    totalPages.value = tp;

    // console.log("Danh sách câu hỏi:", questions.value);
    console.log("Tổng số trang:", totalPages.value);
  } catch (err) {
    console.error("Không lấy được câu hỏi:", err);
  }
};

watch(currentPage, () => {
  getQuestions();
});
onMounted(() => {
  // Load mock data
  console.log("id từ param là:", lessonId.value);
  getQuestions();
});
</script>

<style scoped>
/* Tùy chỉnh giao diện nếu cần */
</style>
