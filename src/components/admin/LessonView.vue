<template>
  <div class="container mt-4">
    <div class="card p-4">
      <div v-if="topic" class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 class="mb-0 d-flex align-items-center">
              <i class="bi bi-book-half text-primary me-2"></i>
              <span class="text-primary">{{ topic.name }}</span>
            </h4>
            <small class="text-muted mt-1 d-flex align-items-center">
              <i class="bi bi-card-text me-1"></i>
              <span
                >Tối đa bài học: <b>{{ topic.maxLesson }}</b></span
              >
              <i class="bi bi-calendar-check ms-3 me-1"></i>
              <span
                >Ngày tạo: <b>{{ formatDate(topic.createAt) }}</b></span
              >
            </small>
          </div>
          <span
            :class="[
              'badge',
              topic.status === 'PUBLISHED'
                ? 'bg-success'
                : topic.status === 'PENDING'
                ? 'bg-warning'
                : 'bg-danger',
            ]"
          >
            {{
              topic.status === "PUBLISHED"
                ? "Đã xuất bản"
                : topic.status === "PENDING"
                ? "Chờ duyệt"
                : "Đã xóa"
            }}
          </span>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0">Danh sách bài học</h3>
        <div>
          <button @click="openNewLessonForm" class="btn btn-success me-2">
            <i class="bi bi-plus-circle"></i> Thêm bài học mới
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <div
          v-if="lessons.length === 0"
          class="alert alert-warning text-center"
          role="alert"
        >
          Chưa có bài học nào được tạo cho chủ đề này.
        </div>

        <table v-else class="table table-striped table-hover table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên bài học</th>
              <th>Câu hỏi tối đa</th>
              <th>ngày tạo</th>
              <th>trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(l, index) in lessons"
              :key="l.id"
              @click="goToQuestionView(l.id)"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ l.lessonName }}</td>
              <td>
                {{ l.maxQuestions }}
              </td>
              <td>{{ formatDate(l.createdAt) }}</td>
              <td>
                <span
                  :class="[
                    'badge',
                    l.status === 'PUBLISHED'
                      ? 'bg-success'
                      : l.status === 'PENDING'
                      ? 'bg-warning'
                      : l.status === 'DELETED'
                      ? 'bg-danger'
                      : 'bg-secondary',
                  ]"
                >
                  {{
                    l.status === "PUBLISHED"
                      ? "Đã xuất bản"
                      : l.status === "PENDING"
                      ? "Chờ duyệt"
                      : l.status === "DELETED"
                      ? "Đã xóa"
                      : "Không xác định"
                  }}
                </span>
              </td>
              <td>
                <button
                  @click="editQuestion(l)"
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
  </div>
  <nav
    aria-label="Page navigation example"
    class="d-flex justify-content-center mt-4"
  >
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: currentPage === 0 }">
        <button class="page-link" @click.prevent="goToPage(currentPage - 1)">
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
        <button class="page-link" @click.prevent="goToPage(currentPage + 1)">
          Next
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import topicService from "@/services/topicService";
import lessonService from "@/services/lessonService";
import { get } from "lodash";
import router from "../router";

const route = useRoute();
const topicId = ref(Number(route.params.topicId));
const questionModalRef = ref(null);
const isEditing = ref(false);
const questions = ref([]);
const lessonDetails = ref(null); // Biến mới để lưu thông tin bài học

const lessons = ref([]);

// chuyển sang question
function goToQuestionView(lessonId) {
  router.push({ name: "question", params: { lessonId } });
}

// Hàm format ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("vi-VN", options);
};
//phan trang
const currentPage = ref(0); // Trang hiện tại (0-indexed để khớp với backend)
const size = ref(10); // Kích thước trang
const totalPages = ref(0); // Tổng số trang
const topic = ref({});
function goToPage(pageNumber) {
  if (pageNumber < 0 || pageNumber >= totalPages.value) return;
  currentPage.value = pageNumber;
  getLessons();
}
//lay topic
const getTopic = async () => {
  try {
    const response = await topicService.getTopic(
      topicId.value,
      currentPage.value,
      size.value
    );

    topic.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin chủ đề:", error);
    return null;
  }
};
// Lấy danh sách bài học

const getLessons = async () => {
  try {
    const response = await lessonService.getLessons(
      topicId.value,
      currentPage.value,
      size.value
    );
    lessons.value = response.data.items;

    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài học:", error);
  }
};
onMounted(async () => {
  await getTopic();
  await getLessons();
});
</script>

<style scoped>
.lesson-header {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}
</style>
