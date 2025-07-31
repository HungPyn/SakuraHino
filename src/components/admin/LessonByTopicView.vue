<template>
  <div class="lesson-admin-container">
    <div class="main-content flex-grow-1 p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="bi bi-book learning-path-title">Quản lý Bài học</h1>
        <div>
          <button class="btn btn-success" @click="openCreateTopicModal">
            <i class="bi bi-plus-circle me-2"></i>Thêm chủ đề mới
          </button>
        </div>
      </div>

      <!-- Thống kê chủ đề -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div
            class="card p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center"
            style="background-color: #e6f7ff; border-color: #91d5ff"
          >
            <i class="bi bi-folder-fill text-primary display-5 mb-2"></i>
            <h3 class="mb-0 text-primary">{{ topicStats.totalTopics }}</h3>
            <p class="text-muted mb-0">Tổng số Chủ đề</p>
          </div>
        </div>
        <div class="col-md-3">
          <div
            class="card p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center"
            style="background-color: #e6ffe6; border-color: #95de64"
          >
            <i class="bi bi-folder-check text-success display-5 mb-2"></i>
            <h3 class="mb-0 text-success">{{ topicStats.activeTopics }}</h3>
            <p class="text-muted mb-0">Chủ đề đang hoạt động</p>
          </div>
        </div>
        <div class="col-md-3">
          <div
            class="card p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center"
            style="background-color: #fffbe6; border-color: #ffe58f"
          >
            <i class="bi bi-journal-check text-warning display-5 mb-2"></i>
            <h3 class="mb-0 text-warning">
              {{ topicStats.totalLessonsInTopics }}
            </h3>
            <p class="text-muted mb-0">Tổng Bài học trong Chủ đề</p>
          </div>
        </div>
        <div class="col-md-3">
          <div
            class="card p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center"
            style="background-color: #f0e6ff; border-color: #d3adf7"
          >
            <i class="bi bi-bar-chart-fill text-info display-5 mb-2"></i>
            <h3 class="mb-0 text-info">
              {{ topicStats.mostLessonsTopicName || "N/A" }}
            </h3>
            <p class="text-muted mb-0">Chủ đề nhiều bài học nhất</p>
          </div>
        </div>
      </div>

      <!-- Chỉ duyệt theo Chủ đề -->
      <TopicLessonAccordion
        ref="topicAccordion"
        @edit-lesson="onEdit"
        @delete-lesson="onDelete"
        @edit-topic="onEditTopic"
        @delete-topic="handleTopicDeleted"
        @refresh-data="handleRefreshAllData"
      />
    </div>

    <!-- Modal quản lý bài học -->
    <LessonFormModal
      ref="lessonFormModal"
      @lesson-saved="handleLessonSaved"
      :availableTopics="availableTopics"
    />

    <!-- Modal quản lý chủ đề -->
    <TopicFormModal ref="topicFormModal" @topic-saved="handleTopicSaved" />

    <!-- Toast thông báo -->
    <NotificationToast ref="notificationToast" />
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import LessonFormModal from "../lesson/LessonFormModal.vue";
import TopicLessonAccordion from "../lesson/TopicLessonAccordion.vue";
import TopicFormModal from "../lesson/TopicFormModal.vue";
import NotificationToast from "../share/NotificationToast.vue";

import lessonService from "../../services/lessonService";
import topicService from "../../services/topicService";

// Refs
const lessonFormModal = ref(null);
const topicFormModal = ref(null);
const topicAccordion = ref(null);
const notificationToast = ref(null);

// Topics & lessons
const availableTopics = ref([]);

const topicStats = reactive({
  totalTopics: 0,
  activeTopics: 0,
  totalLessonsInTopics: 0,
  mostLessonsTopicName: "",
});

// --- Fetch ---
async function fetchLessons() {
  try {
    return await lessonService.getAllLessons();
  } catch (e) {
    console.error("Lỗi khi tải bài học:", e);
    notificationToast.value.showToast("Lỗi khi tải bài học!", "error");
    return [];
  }
}

async function fetchTopics() {
  try {
    availableTopics.value = await topicService.getAllTopics();
  } catch (e) {
    console.error("Lỗi khi tải chủ đề:", e);
    notificationToast.value.showToast("Lỗi khi tải chủ đề!", "error");
  }
}

async function fetchTopicStats() {
  try {
    const topics = await topicService.getAllTopics();
    const lessons = await lessonService.getAllLessons();

    topicStats.totalTopics = topics.length;
    topicStats.activeTopics = topics.filter(
      (t) => t.status === "PUBLISHED"
    ).length;

    let totalLessonsCount = 0;
    let topicLessonCounts = new Map();

    topics.forEach((topic) => {
      const lessonsInTopic = lessons.filter(
        (lesson) => lesson.topicId === topic.id
      );
      totalLessonsCount += lessonsInTopic.length;
      topicLessonCounts.set(topic.name, lessonsInTopic.length);
    });

    topicStats.totalLessonsInTopics = totalLessonsCount;

    let max = -1,
      mostTopic = "";
    for (const [name, count] of topicLessonCounts) {
      if (count > max) {
        max = count;
        mostTopic = name;
      }
    }
    topicStats.mostLessonsTopicName = mostTopic;
  } catch (e) {
    console.error("Lỗi khi thống kê chủ đề:", e);
    notificationToast.value.showToast("Lỗi khi tải thống kê chủ đề!", "error");
  }
}

// --- Modal handlers ---
function openCreateTopicModal() {
  topicFormModal.value.openModal();
}

async function onEdit(lessonId) {
  try {
    const lesson = await lessonService.getLessonById(lessonId);
    if (lesson) {
      lessonFormModal.value.openModal(lesson);
    } else {
      notificationToast.value.showToast("Không tìm thấy bài học.", "error");
    }
  } catch (e) {
    console.error("Lỗi khi mở bài học:", e);
    notificationToast.value.showToast("Lỗi khi mở bài học.", "error");
  }
}

async function onDelete(lessonId) {
  if (confirm("Bạn có chắc muốn xóa bài học này?")) {
    try {
      await lessonService.deleteLesson(lessonId);
      await refreshAll();
      notificationToast.value.showToast(
        "Đã xóa bài học thành công!",
        "success"
      );
    } catch (e) {
      console.error("Xoá bài học lỗi:", e);
      notificationToast.value.showToast("Lỗi khi xóa bài học.", "error");
    }
  }
}

async function onEditTopic(topicId) {
  try {
    const topic = await topicService.getTopicById(topicId);
    if (topic) {
      topicFormModal.value.openModal(topic);
    } else {
      notificationToast.value.showToast("Không tìm thấy chủ đề.", "error");
    }
  } catch (e) {
    console.error("Lỗi khi sửa chủ đề:", e);
    notificationToast.value.showToast("Lỗi khi sửa chủ đề.", "error");
  }
}

async function handleTopicDeleted(topicId) {
  if (confirm("Bạn có chắc muốn xoá chủ đề này?")) {
    try {
      await topicService.deleteTopic(topicId);
      await refreshAll();
      topicAccordion.value?.fetchTopics();
      notificationToast.value.showToast("Đã xóa chủ đề thành công!", "success");
    } catch (e) {
      console.error("Lỗi khi xoá chủ đề:", e);
      notificationToast.value.showToast("Lỗi khi xoá chủ đề.", "error");
    }
  }
}

async function handleLessonSaved(isNew) {
  const msg = isNew ? "thêm" : "cập nhật";
  if (confirm(`Xác nhận ${msg} bài học?`)) {
    try {
      await refreshAll();
      topicAccordion.value?.fetchTopics();
      notificationToast.value.showToast(
        `Đã ${msg} bài học thành công!`,
        "success"
      );
    } catch (e) {
      console.error(`Lỗi khi ${msg} bài học:`, e);
      notificationToast.value.showToast(`Lỗi khi ${msg} bài học.`, "error");
    }
  }
}

async function handleTopicSaved(isNew) {
  const msg = isNew ? "thêm" : "cập nhật";
  if (confirm(`Xác nhận ${msg} chủ đề?`)) {
    try {
      await refreshAll();
      topicAccordion.value?.fetchTopics();
      notificationToast.value.showToast(
        `Đã ${msg} chủ đề thành công!`,
        "success"
      );
    } catch (e) {
      console.error(`Lỗi khi ${msg} chủ đề:`, e);
      notificationToast.value.showToast(`Lỗi khi ${msg} chủ đề.`, "error");
    }
  }
}

async function handleRefreshAllData() {
  await refreshAll();
  topicAccordion.value?.fetchTopics();
}

// --- Refresh all ---
async function refreshAll() {
  await fetchLessons();
  await fetchTopics();
  await fetchTopicStats();
}

// Init
onMounted(async () => {
  await refreshAll();
});
</script>

<style scoped>
/* Styles remain unchanged */
.lesson-admin-container {
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
  font-size: 2.5rem;
  color: #007bff;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); /* Add subtle shadow */
}

.table thead th {
  background-color: #e9f0f8;
  color: #333;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.table-hover tbody tr:hover {
  background-color: #f1f7fc;
}

.badge {
  font-size: 0.8em;
  padding: 0.4em 0.7em;
  border-radius: 0.5rem;
}
</style>
