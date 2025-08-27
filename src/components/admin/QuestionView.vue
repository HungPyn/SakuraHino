<template>
  <div class="container mt-4">
    <div class="card p-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0">Danh sách Câu hỏi</h3>
        <div>
          <button @click="openNewQuestionForm" class="btn btn-success me-2">
            <i class="bi bi-plus-circle"></i> Thêm câu hỏi mới
          </button>
          <button @click="openExcelModal" class="btn btn-info">
            <i class="bi bi-file-earmark-excel"></i> Thêm bằng file Excel
          </button>
        </div>
      </div>

      <!-- Table -->
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
              <th>Trạng thái</th>
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

      <!-- Pagination -->
      <nav class="d-flex justify-content-center mt-4">
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

    <!-- Modal QuestionForm -->
    <QuestionFormModal
      ref="questionModalRef"
      @question-saved="handleQuestionSaved"
    />

    <!-- Modal Excel dùng teleport -->
    <teleport to="body">
      <div
        class="modal fade"
        id="excelUploadModal"
        tabindex="-1"
        aria-labelledby="excelUploadModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="excelUploadModalLabel">
                Upload file Excel
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="closeExcelModal"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitExcel">
                <div class="mb-3">
                  <label for="excelFile" class="form-label"
                    >Chọn file Excel</label
                  >
                  <input
                    type="file"
                    class="form-control"
                    ref="excelFileInput"
                    accept=".xlsx,.xls"
                    required
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeExcelModal"
              >
                Hủy
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="submitExcel"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import QuestionFormModal from "../lesson/QuestionFormModal.vue";
import questionService from "@/services/questionService";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { Modal } from "bootstrap";

const route = useRoute();
const lessonId = ref(Number(route.params.lessonId));
const questionModalRef = ref(null);
const questions = ref([]);
const toast = useToast();

const excelUploadModal = ref(null);
const excelFileInput = ref(null);

// Map các loại câu hỏi
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
  lessonId: null,
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
  ...currentQuestion.value,
  questionType: "MULTIPLE_CHOICE_TEXT_ONLY",
  status: "PUBLISHED",
};

const getQuestionTypeName = (type) => questionTypeMap[type] || type;

// QuestionForm
const openNewQuestionForm = () => {
  currentQuestion.value = { ...newQuestion };
  questionModalRef.value.openModal({
    currentQuestion: currentQuestion.value,
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
  const action = !question.id
    ? questionService.createQuestion
    : questionService.updateQuestion;
  try {
    const result = !question.id
      ? await Swal.fire({
          title: "Xác nhận thêm câu hỏi không",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
        })
      : await Swal.fire({
          title: "Xác nhận cập nhật câu hỏi không",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
        });

    if (result.isConfirmed) {
      if (!question.id) await action(question, allImages || []);
      else await action(question.id, question, allImages || []);

      getQuestions();
      questionModalRef.value?.closeModal();
    }
  } catch (err) {
    console.error("Lỗi khi lưu câu hỏi:", err);
  }
};

const deleteQuestion = async (id) => {
  const result = await Swal.fire({
    title: "Xác nhận xóa",
    text: "Bạn có chắc muốn xóa câu hỏi này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });
  if (result.isConfirmed) {
    try {
      await questionService.deleteQuestion(id);
      toast.success("Đã xóa câu hỏi thành công!");
      getQuestions();
    } catch (err) {
      console.error("Lỗi khi xóa câu hỏi:", err);
    }
  }
};

// Excel Modal
const initExcelModal = async () => {
  await nextTick();
  const modalEl = document.getElementById("excelUploadModal");
  if (modalEl && !excelUploadModal.value)
    excelUploadModal.value = new Modal(modalEl, {
      backdrop: "static",
      keyboard: false,
    });
};
const openExcelModal = async () => {
  if (!excelUploadModal.value) await initExcelModal();
  excelUploadModal.value.show();
};
const closeExcelModal = () => excelUploadModal.value?.hide();

const submitExcel = async () => {
  const files = excelFileInput.value.files;
  if (!files || files.length === 0) {
    toast.error("Vui lòng chọn file Excel!");
    return;
  }
  const file = files[0];

  try {
    const response = await questionService.importExcel(file);
    getQuestions();
    closeExcelModal();
  } catch (err) {
    console.error("Lỗi upload Excel:", err);
  }
};

// Pagination
const currentPage = ref(0);
const size = ref(10);
const totalPages = ref(0);
const getQuestions = async () => {
  try {
    const { list, totalPages: tp } = await questionService.getQuestions({
      lessonId: lessonId.value,
      page: currentPage.value,
      size: size.value,
    });
    questions.value = list;
    totalPages.value = tp;
  } catch (err) {
    console.error("Không lấy được câu hỏi:", err);
  }
};
watch(currentPage, () => getQuestions());
const goToPage = (newPage) => {
  if (
    newPage >= 0 &&
    newPage < totalPages.value &&
    newPage !== currentPage.value
  )
    currentPage.value = newPage;
};

onMounted(async () => {
  await initExcelModal();
  getQuestions();
});
</script>

<style scoped>
/* Giữ nguyên style cũ */
</style>
