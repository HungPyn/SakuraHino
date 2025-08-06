<template>
  <div class="topic-admin-container">
    <div class="main-content flex-grow-1 p-4">
      <!-- Thống kê chủ đề -->
      <!-- <div class="row mb-4">
        <div class="col-md-6">
          <div
            class="card p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center"
            style="background-color: #e6f7ff; border-color: #91d5ff"
          >
            <i class="bi bi-folder-fill text-primary display-5 mb-2"></i>
            <h3 class="mb-0 text-primary">{{ topics.totalItems }}</h3>
            <p class="text-muted mb-0">Tổng số Chủ Đề</p>
          </div>
        </div>
        <div class="col-md-6">
          <div
            class="card p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center"
            style="background-color: #e6ffe6; border-color: #95de64"
          >
            <i class="bi bi-folder-check text-success display-5 mb-2"></i>
            <h3 class="mb-0 text-success">{{ 0 }}</h3>
            <p class="text-muted mb-0">Chủ Đề đang hoạt động</p>
          </div>
        </div>
      </div> -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="d-flex align-items-center mb-0">
          <i class="bi bi-folder2-open me-2 learning-path-title"></i>
          <span class="learning-path-title">Quản lý Chủ Đề</span>
          <small class="text-muted ms-2 mt-1"
            >({{ topics.totalItems }} chủ đề)</small
          >
        </h1>
        <button class="btn btn-success" @click="openCreateTopicModal">
          <i class="bi bi-plus-circle me-2"></i>Thêm chủ đề mới
        </button>
      </div>
      <!-- Danh sách chủ đề -->
      <TopicLessonAccordion ref="topicAccordion" />
    </div>

    <!-- Modal quản lý chủ đề -->
    <TopicFormModal ref="topicFormModal" @topic-done-form="reload" />

    <!-- Toast thông báo -->
    <NotificationToast ref="notificationToast" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import TopicLessonAccordion from "../lesson/TopicLessonAccordion.vue";
import TopicFormModal from "../lesson/TopicFormModal.vue";
import NotificationToast from "../share/NotificationToast.vue";
import topicService from "../../services/topicService";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";

const toast = useToast();
const topicAccordion = ref(null);
const topicFormModal = ref(null);
const notificationToast = ref(null);
const topics = ref([]);

const topicStats = reactive({
  totalTopics: topics.totalItems || 0,
  activeTopics: 0,
});

async function fetchTopics() {
  try {
    const data = await topicService.getAllTopics();
    topics.value = data;
    console.log("Lấy danh sách chủ đề thành công dât:", topics.value);
  } catch (e) {
    console.error("Lỗi khi tải chủ đề:", e);
  }
}
const reload = async () => {
  await fetchTopics();
  window.location.reload();
};

function openCreateTopicModal() {
  topicFormModal.value.openModal();
}

async function refreshAll() {
  await fetchTopics();
}

onMounted(async () => {
  await refreshAll();
});
</script>

<style scoped>
.topic-admin-container {
  min-height: 100vh;
  background-color: #f8fafd;
}

.main-content {
  background-color: #ffffff;
  margin-left: 0;
  border-left: none;
  width: 100%;
}

.learning-path-title {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}
</style>
