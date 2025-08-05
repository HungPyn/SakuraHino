<template>
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
  await fetchTopics();
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
  fetchTopics();
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

onMounted(() => {
  fetchTopics();
});
</script>

<style scoped>
.topic-lesson-accordion {
  max-width: 100%;
}

.accordion-item {
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  overflow: hidden; /* Ensures border-radius applies to children */
}

.accordion-header .accordion-button {
  background-color: #f8fafd;
  color: #333;
  font-weight: bold;
  font-size: 1.15rem;
  padding: 1rem 1.25rem;
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

.topic-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.topic-name {
  font-weight: 600;
}

.topic-actions .btn {
  font-size: 0.9rem;
  padding: 0.4rem 0.75rem;
}

.table thead th {
  background-color: #f1f7fc;
  color: #555;
}

.table-hover tbody tr:hover {
  background-color: #f6fbff;
}

.badge {
  font-size: 0.75em;
  padding: 0.3em 0.6em;
  border-radius: 0.4rem;
}
.accordion-button.topic-hover {
  transition: background-color 0.2s ease-in-out;
}

.accordion-button.topic-hover:hover {
  background-color: #cadfff;
}
.topic-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%; /* Làm hình tròn */
  object-fit: cover; /* Giữ hình không bị méo */
  border: 2px solid #dee2e6; /* Viền nhẹ nếu muốn */
}
.accordion-button::after {
  content: none !important;
}
</style>
