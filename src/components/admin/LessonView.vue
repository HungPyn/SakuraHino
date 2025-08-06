<template>
  <div class="container mt-4">
    <div class="card p-4">
      <div v-if="topic" class="card-body p-2">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="d-flex align-items-center">
            <h4 class="mb-0 d-flex align-items-center me-5">
              <i class="bi bi-book-half text-primary me-2"></i>
              <span class="text-primary">{{ topic.name }}</span>
            </h4>

            <small class="text-muted d-flex align-items-center me-5 fs-6">
              <i class="bi bi-card-text me-1"></i>
              <span
                >Tối đa bài học: <b>{{ topic.maxLesson }}</b></span
              >
            </small>

            <small class="text-muted d-flex align-items-center me-5 fs-6">
              <i class="bi bi-calendar-check me-1"></i>
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

      <div class="card mb-4 p-2 border-0">
        <div class="row g-3 align-items-end">
          <div class="col-md-5">
            <label for="keyword" class="form-label font-weight-bold"
              >Tìm kiếm</label
            >
            <input
              @change="timKiem"
              v-model="tuKhoa"
              type="text"
              class="form-control"
              id="keyword"
              placeholder="Nhập từ khóa..."
            />
          </div>
          <div class="col-md-2">
            <label for="startDate" class="form-label font-weight-bold"
              >Từ ngày</label
            >
            <input
              @change="timKiem"
              v-model="startDate"
              type="date"
              class="form-control"
              id="startDate"
            />
          </div>
          <div class="col-md-2">
            <label for="endDate" class="form-label font-weight-bold"
              >Đến ngày</label
            >
            <input
              @change="timKiem"
              v-model="endDate"
              type="date"
              class="form-control"
              id="endDate"
            />
          </div>
          <div class="col-md-2">
            <label for="statusSelect" class="form-label font-weight-bold"
              >Trạng thái</label
            >
            <select
              @change="timKiem"
              v-model="status"
              class="form-select"
              id="statusSelect"
            >
              <option value="">Tất cả</option>
              <option value="PUBLISHED">Đã xuất bản</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="DELETED">Đã xóa</option>
            </select>
          </div>
          <div class="col-md-1">
            <button
              type="button"
              @click="resetFilters"
              class="btn btn-outline-secondary w-100"
              title="Đặt lại bộ lọc"
            >
              <i class="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0">Danh sách bài học</h5>
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

        <table v-else class="table table-striped table-hover table-xl">
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
                  @click.stop="editLesson(l)"
                  class="btn btn-warning btn-sm me-2"
                >
                  Sửa
                </button>
                <button
                  @click.stop="deleteLesson(l.id)"
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
  <div
    class="modal fade"
    id="lessonModal"
    tabindex="-1"
    aria-labelledby="lessonModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="lessonModalLabel">
            {{ isEditing ? "Sửa bài học" : "Thêm bài học mới" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveLesson">
            <div class="mb-3">
              <label for="lessonName" class="form-label">Tên bài học</label>
              <input
                type="text"
                class="form-control"
                id="lessonName"
                v-model="lessonForm.lessonName"
                required
              />
            </div>
            <div class="mb-3">
              <label for="maxQuestions" class="form-label"
                >Số câu hỏi tối đa</label
              >
              <select
                class="form-select"
                id="maxQuestions"
                v-model="lessonForm.maxQuestions"
                required
              >
                <option v-for="n in 8" :key="n + 7" :value="n + 7">
                  {{ n + 7 }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="status" class="form-label">Trạng thái</label>
              <select
                class="form-select"
                id="status"
                v-model="lessonForm.status"
                required
              >
                <option value="PUBLISHED">Xuất bản</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="DELETED">Xóa</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Hủy
          </button>
          <button type="button" class="btn btn-primary" @click="saveLesson">
            Lưu bài học
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import topicService from "@/services/topicService";
import lessonService from "@/services/lessonService";
import { Modal } from "bootstrap";
import router from "../router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";

const route = useRoute();
const topicId = ref(Number(route.params.topicId));
const questionModalRef = ref(null);
const isEditing = ref(false);
const questions = ref([]);
const lessonDetails = ref(null); // Biến mới để lưu thông tin bài học

const toast = useToast();

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
  timKiem();
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

// xóa bài học
const deleteLesson = async (lessonId) => {
  const result = await Swal.fire({
    title: `Xác nhận xóa`,
    text: `Bạn có chắc muốn xóa bài học không?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });

  if (result.isConfirmed) {
    try {
      const response = await lessonService.deleteLesson(lessonId);

      // Thông báo xóa thành công
      toast.success(response.data);
      getLessons(); // Cập nhật danh sách bài học sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa bài học:", error);
    }
  }
};

//form sua xoa

// --- Cập nhật form và modal ---
const lessonModal = ref(null); // Biến để lưu instance của Modal
const lessonForm = ref({
  id: null,
  lessonName: "",
  maxQuestions: 8,
  status: "PUBLISHED",
  topicId: topicId.value,
});

// Hàm để reset form
const resetForm = () => {
  lessonForm.value = {
    id: null,
    lessonName: "",
    maxQuestions: 8,
    status: "PUBLISHED",
    topicId: topicId.value,
  };
};

// Mở modal để thêm mới bài học
const openNewLessonForm = () => {
  isEditing.value = false;
  resetForm();
  lessonModal.value.show();
};

// Mở modal để sửa bài học
const editLesson = (lesson) => {
  isEditing.value = true;

  lessonForm.value = { ...lesson }; // Sao chép dữ liệu của bài học vào form
  lessonModal.value.show();
};

// Xử lý lưu form (thêm mới hoặc cập nhật)
const saveLesson = async () => {
  console.log("leson truoc khi gui qua service: ", lessonForm.value);
  if (isEditing.value) {
    const result = await Swal.fire({
      title: `Xác nhận chỉnh sửa`,
      text: `Bạn có chắc muốn sửa bài học này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Lưu",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const response = await lessonService.updateLesson(
          lessonForm.value.id,
          lessonForm.value
        );
        if (response.data) {
          toast.success("Sửa thành công");

          lessonModal.value.hide(); // Đóng modal
          timKiem(); // Tải lại danh sách bài học
        } else {
          toast.error(response.error);
        }
      } catch (error) {
        console.error("Lỗi khi sửa bài học:", error);
      }
    }
  } else {
    const result = await Swal.fire({
      title: `Xác nhận chỉnh sửa`,
      text: `Bạn có chắc muốn sửa bài học này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Lưu",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const response = await lessonService.addLesson(lessonForm.value);
        if (response.data) {
          toast.success("Thêm thành công");

          lessonModal.value.hide(); // Đóng modal
          timKiem(); // Tải lại danh sách bài học
        } else {
          toast.error(response.error);
        }
      } catch (error) {
        console.error("Lỗi khi thêm bài học:", error);
      }
    }
  }
};

//tim kiem
const tuKhoa = ref("");
const startDate = ref(null);
const endDate = ref(null);
const status = ref("");
const resetFilters = async () => {
  tuKhoa.value = "";
  startDate.value = null;
  endDate.value = null;
  status.value = "";
  getLessons();
};

const timKiem = async () => {
  try {
    const response = await lessonService.searchLessons(
      currentPage.value,
      size.value,
      tuKhoa.value,
      topicId.value,
      startDate.value,
      endDate.value,
      status.value
    );
    lessons.value = response.data?.items ?? [];

    totalPages.value = response.data?.totalPages ?? 0;
  } catch (error) {
    console.error("Lỗi khi tìm lesson:", error);
  }
};
onMounted(async () => {
  await getTopic();
  await getLessons();
  // Khởi tạo Modal sau khi component đã được mount
  const modalElement = document.getElementById("lessonModal");
  if (modalElement) {
    lessonModal.value = new Modal(modalElement);
  }
});
</script>

<style scoped>
.lesson-header {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}
.modal-title {
  color: #007bff;
}
</style>
