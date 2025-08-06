<template>
  <div class="card mb-4 p-1 border-0">
    <div class="row g-3 align-items-end">
      <div class="col-md-3">
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
          >Cấp độ</label
        >
        <select
          @change="timKiem"
          v-model="level"
          class="form-select"
          id="statusSelect"
        >
          <option value="">Tất cả</option>
          <option v-for="l in levels" :key="l.id" :value="l.id">
            {{ l.level }}
          </option>
        </select>
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
          <option value="PUBLISHED">Hoạt động</option>
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
  <div class="topic-lesson-accordion mt-4">
    <div v-if="loading" class="text-center p-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <div
      v-else-if="topics.length === 0"
      class="alert alert-info text-center"
      role="alert"
    >
      Không có chủ đề nào để hiển thị. Vui lòng thêm chủ đề mới.
    </div>

    <div v-else class="accordion" id="topicAccordion">
      <div
        v-for="topic in topics"
        :key="topic.id"
        class="accordion-item mb-3 shadow-sm rounded"
      >
        <h2 class="accordion-header" :id="'heading' + topic.id">
          <div
            class="accordion-button d-flex align-items-center topic-hover"
            @click="goToLessonView(topic.id)"
            style="cursor: pointer"
          >
            <img
              :src="topic.urlImage"
              class="topic-icon me-3"
              alt="Topic Icon"
              v-if="topic.urlImage"
            />
            <span class="topic-name flex-grow-1">
              {{ topic.name }} (Tối đa {{ topic.maxLesson }} bài học )
            </span>
            <span class="flex-grow-4 badge bg-primary me-12">
              {{ topic.level }}
            </span>
            <span class="fw-normal flex-grow-1 ps-12">
              <b>Ngày tạo: </b>{{ formatDate(topic.createAt) }}
            </span>
            <span
              :class="[
                'badge',
                topic?.status === 'PUBLISHED'
                  ? 'bg-success'
                  : topic?.status === 'PENDING'
                  ? 'bg-warning'
                  : topic?.status === 'DELETED'
                  ? 'bg-danger'
                  : 'bg-secondary',
                'flex-grow-3 text-center',
                'me-12',
              ]"
            >
              {{
                topic?.status === "PUBLISHED"
                  ? "Hoạt động"
                  : topic?.status === "PENDING"
                  ? "Chờ duyệt"
                  : topic?.status === "DELETED"
                  ? "Đã xóa"
                  : "Không xác định"
              }}
            </span>

            <span class="topic-actions ms-auto">
              <button
                class="btn btn-sm btn-outline-secondary me-2"
                @click.stop="openCreateTopicModal(topic)"
                title="Chỉnh sửa chủ đề"
              >
                <i class="bi bi-pencil-square"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click.stop="deleteTopic(topic.id)"
                title="Xóa chủ đề"
              >
                <i class="bi bi-trash"></i>
              </button>
            </span>
          </div>
        </h2>
      </div>
    </div>
  </div>
  <TopicFormModal ref="topicFormModalRef" @topic-done-form="reload" />
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
import { ref, onMounted, watch } from "vue";
import topicService from "../../services/topicService";
import lessonService from "../../services/lessonService";
import { useRouter } from "vue-router";
import TopicFormModal from "./TopicFormModal.vue";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import levelService from "@/services/levelService";
const router = useRouter();

const toast = useToast();

const emit = defineEmits([
  "edit-lesson",
  "delete-lesson",
  "edit-topic",
  "delete-topic",
  "refresh-data",
]);

//reloadtrang
const reload = async () => {
  emit("refresh-data");
  await timKiem();
};
// CÁC THAY ĐỔI ĐÃ THỰC HIỆN:

// 1. ĐỔI TÊN REF để tránh trùng lặp với import
const topicFormModalRef = ref(null);

// 2. CẬP NHẬT cách gọi phương thức openModal()
function openCreateTopicModal(topic) {
  topicFormModalRef.value.openModal(topic);
}

// ----------------------------------------------
// Các phần còn lại của code được giữ nguyên
// ----------------------------------------------

// chuyển tới lesson
function goToLessonView(topicId) {
  router.push({ name: "lesson", params: { topicId } });
}

const topics = ref([]);
const loading = ref(true);
const activeTopicId = ref(null); // Để kiểm soát accordion

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

async function deleteTopic(topicId) {
  const result = await Swal.fire({
    title: `Xác nhận xóa`,
    text: `Bạn có chắc muốn xóa chủ đề không??`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });

  if (result.isConfirmed) {
    try {
      await topicService.deleteTopic(topicId);

      // Thông báo xóa thành công
      toast.success(`Đã xóa chủ đề thành công!`);
      fetchTopics(); // Cập nhật danh sách chủ đề sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa chủ đề:", error);
    }
  }
}

const currentPage = ref(0); // Trang hiện tại (0-indexed để khớp với backend)
const size = ref(10); // Kích thước trang
const totalPages = ref(0); // Tổng số trang
function goToPage(pageNumber) {
  if (pageNumber < 0 || pageNumber >= totalPages.value) return;
  currentPage.value = pageNumber;
  timKiem();
}

async function fetchTopics() {
  try {
    loading.value = true;
    const data = await topicService.getAllTopics(currentPage.value, size.value);
    topics.value = data.items ?? [];
    totalPages.value = data.totalPages ?? 0;
  } catch (error) {
    console.error("Lỗi khi fetch topics:", error);
  } finally {
    loading.value = false;
  }
}
//lấy level
const levels = ref({});
//lấy level
const fetchLevels = async () => {
  try {
    const response = await levelService.getLevels();

    levels.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cấp độ:", error);
    alert("Có lỗi xảy ra khi lấy danh sách cấp độ: " + error.message);
  }
};

//tim kiem
const tuKhoa = ref("");
const level = ref("");
const startDate = ref(null);
const endDate = ref(null);
const status = ref("");
const resetFilters = async () => {
  level.value = "";
  tuKhoa.value = "";
  startDate.value = null;
  endDate.value = null;
  status.value = "";

  fetchTopics();
};

const timKiem = async () => {
  try {
    loading.value = true;
    const data = await topicService.searchTopics(
      currentPage.value,
      size.value,
      tuKhoa.value,
      level.value,
      startDate.value,
      endDate.value,
      status.value
    );

    topics.value = data?.items ?? [];
    totalPages.value = data?.totalPages ?? 0;
  } catch (error) {
    console.error("Lỗi khi tìm topics:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchTopics();
  await fetchLevels();
});
</script>

<style scoped>
.topic-lesson-accordion {
  max-width: 100%;
}

.accordion-item {
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  overflow: hidden;
}

.accordion-header .accordion-button {
  background-color: #f8fafd;
  color: #333;
  font-weight: bold;
  font-size: 1rem; /* Giảm nhẹ font chữ */
  padding: 0.5rem 1rem; /* Giảm padding để bớt dày */
  border-bottom: 1px solid #e0e0e0;
}

.accordion-button:not(.collapsed) {
  background-color: #ffffff;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.125);
}

.accordion-button:focus {
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  border-color: #80bdff;
}

.accordion-button::after {
  background-image: var(--bs-accordion-btn-icon);
  transform: var(--bs-accordion-btn-icon-transform);
}

.accordion-body {
  padding: 1.5rem;
  background-color: #ffffff;
}

/* Giữ nguyên kích thước ảnh, chỉ giảm margin */
.topic-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #dee2e6;
  margin-right: 0.75rem !important; /* Giảm margin của ảnh */
}

.topic-name {
  font-weight: 600;
  font-size: 0.95rem; /* Giảm nhẹ font tên chủ đề */
}

.topic-actions .btn {
  font-size: 0.8rem; /* Giảm nhẹ font nút */
  padding: 0.3rem 0.6rem; /* Giảm padding nút */
}

.table thead th {
  background-color: #f1f7fc;
  color: #555;
}

.table-hover tbody tr:hover {
  background-color: #f6fbff;
}

.badge {
  font-size: 0.7em; /* Giảm nhẹ font chữ của badge */
  padding: 0.2em 0.5em; /* Giảm padding của badge */
  border-radius: 0.4rem;
}

/* Đảm bảo hiệu ứng hover vẫn hoạt động */
.accordion-button.topic-hover {
  transition: background-color 0.2s ease-in-out;
}

.accordion-button.topic-hover:hover {
  background-color: #cadfff;
}

.accordion-button::after {
  content: none !important;
}

/* Giảm khoảng cách giữa các phần tử bên trong */
.accordion-header .accordion-button .me-3 {
  margin-right: 0.5rem !important; /* Giảm khoảng cách sau icon */
}

.accordion-header .accordion-button .ms-3 {
  margin-left: 0.5rem !important; /* Giảm khoảng cách giữa các badge */
}

.accordion-header .accordion-button .ms-auto {
  margin-left: 0.75rem !important; /* Giảm khoảng cách của các nút hành động */
}

.accordion-header .accordion-button .fw-normal {
  font-size: 0.85rem; /* Kích thước chữ của "Ngày tạo" */
}
</style>
