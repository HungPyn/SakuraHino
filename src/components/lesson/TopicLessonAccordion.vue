<template>
  <div class="topic-lesson-accordion mt-4">
    <div v-if="loading" class="text-center p-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <div
      v-else-if="topicsWithLessons.length === 0"
      class="alert alert-info text-center"
      role="alert"
    >
      Không có chủ đề nào để hiển thị. Vui lòng thêm chủ đề mới.
    </div>

    <div v-else class="accordion" id="topicAccordion">
      <div
        v-for="topic in topicsWithLessons"
        :key="topic.id"
        class="accordion-item mb-3 shadow-sm rounded"
      >
        <h2 class="accordion-header" :id="'heading' + topic.id">
          <button
            class="accordion-button d-flex align-items-center"
            :class="{ collapsed: activeTopicId !== topic.id }"
            type="button"
            @click="toggleAccordion(topic.id)"
          >
            <img
              :src="topic.urlImage"
              class="topic-icon me-3"
              alt="Topic Icon"
              v-if="topic.urlImage"
            />
            <span class="topic-name flex-grow-1"
              >{{ topic.name }} ({{ topic.lessons.length }} bài học)</span
            >
            <span class="flex-grow-4 badge bg-primary me-12">
              {{ topic.level }}</span
            >
            <span class="fw-normal flex-grow-1 ps-12"
              >Bài học tối đa: {{ topic.maxLesson }}
            </span>
            <span
              :class="[
                'badge',
                topic.status === 'PUBLISHED' ? 'bg-success' : 'bg-danger',
                `flex-grow-3 text-center`,
                'me-12',
              ]"
              >{{
                topic.status === "PUBLISHED" ? "Hoạt động" : "Chưa xuất bản"
              }}
            </span>

            <span class="topic-actions ms-auto">
              <button
                class="btn btn-sm btn-outline-secondary me-2"
                @click.stop="editTopic(topic.id)"
                title="Thêm bài học mới"
              >
                <i class="bi bi-plus-square"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-secondary me-2"
                @click.stop="editTopic(topic.id)"
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
          </button>
        </h2>
        <div
          :id="'collapse' + topic.id"
          class="accordion-collapse collapse"
          :class="{ show: activeTopicId === topic.id }"
        >
          <div class="accordion-body">
            <div
              v-if="topic.lessons.length === 0"
              class="alert alert-warning text-center small"
              role="alert"
            >
              Chủ đề này chưa có bài học nào.
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th scope="col">Bài học</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Câu hỏi tối đa</th>
                    <th scope="col">Ngày tạo</th>
                    <th scope="col">Cập nhật lúc</th>
                    <th scope="col">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(lesson, index) in topic.lessons"
                    :key="lesson.id"
                    @click="goToQuestionView(lesson.id)"
                  >
                    <td>Bài: {{ index + 1 }}</td>

                    <td>
                      <span
                        :class="[
                          'badge',
                          lesson.status === 'PUBLISHED'
                            ? 'bg-success'
                            : 'bg-secondary',
                        ]"
                      >
                        {{
                          lesson.status === "PUBLISHED"
                            ? "Đã xuất bản"
                            : "Bản nháp"
                        }}
                      </span>
                    </td>
                    <td>{{ lesson.maxQuestion }}</td>
                    <td>{{ formatDate(lesson.createAt) }}</td>
                    <td>{{ formatDate(lesson.updateAt) }}</td>
                    <td>
                      <button
                        class="btn btn-sm btn-warning me-2"
                        @click.stop="editLesson(lesson.id)"
                        title="Chỉnh sửa bài học"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-danger"
                        @click.stop="deleteLesson(lesson.id)"
                        title="Xóa bài học"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import topicService from "../../services/topicService";
import lessonService from "../../services/lessonService";
import { useRouter } from "vue-router";
const router = useRouter();

const emit = defineEmits([
  "edit-lesson",
  "delete-lesson",
  "edit-topic",
  "delete-topic",
  "refresh-data",
]);

const topicsWithLessons = ref([]);
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

// Hàm fetch tất cả chủ đề và bài học liên quan
async function fetchTopicsWithLessons() {
  loading.value = true;
  try {
    const topics = await topicService.getAllTopics();
    const lessons = await lessonService.getAllLessons(); // Get all lessons

    // Group lessons by topic
    const groupedTopics = topics
      .map((topic) => {
        const lessonsForTopic = lessons.filter(
          (lesson) => lesson.topicId === topic.id
        );
        return {
          ...topic,
          lessons: lessonsForTopic.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          ), // Sort lessons by updated date
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort topics alphabetically

    topicsWithLessons.value = groupedTopics;
  } catch (error) {
    console.error("Error fetching topics and lessons for accordion:", error);
    // You might want to emit an error toast here if NotificationToast is available
  } finally {
    loading.value = false;
  }
}

// Hàm toggle accordion
function toggleAccordion(topicId) {
  activeTopicId.value = activeTopicId.value === topicId ? null : topicId;
}

function goToQuestionView(id) {
  router.push({ name: "question", params: { lessonId: id } });
}

// --- Emit actions to parent (LessonAdminView) ---
function editLesson(lessonId) {
  emit("edit-lesson", lessonId);
}

function deleteLesson(lessonId) {
  emit("delete-lesson", lessonId);
}

function editTopic(topicId) {
  emit("edit-topic", topicId);
}

function deleteTopic(topicId) {
  emit("delete-topic", topicId); // Emit sự kiện lên cha để cha xử lý confirm và xóa
}

// Public method for parent to refresh data
defineExpose({
  fetchTopics: fetchTopicsWithLessons,
});

onMounted(() => {
  fetchTopicsWithLessons();
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
  color: #007bff;
  background-color: #e9f0f8;
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
</style>
