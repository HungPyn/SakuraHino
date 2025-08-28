<template>
  <div class="admin-page-container">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-book icon"></i> Quản lý Lịch sử Ôn tập
      </h1>
      <button @click="openAddForm" class="btn-primary btn-add-new">
        <i class="bi bi-plus-circle-fill"></i> Thêm mới
      </button>
    </div>

    <div class="toolbar-container">
      <LearningHistoryFilters
        @filter-change="handleFilterChange"
        :topics="topics"
      />
    </div>

    <div class="table-card">
      <div class="table-responsive">
        <table class="history-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Topic</th>
              <th>Tiến độ</th>
              <th class="text-center">Ngày</th>
              <th class="text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="h in histories" :key="h.id">
              <td>{{ h.userName }}</td>
              <td>
                <span class="badge">{{ h.topicName }}</span>
              </td>
              <td>
                <span :class="['badge', getProgressClass(h.progress)]">
                  {{ h.score }}%
                </span>
              </td>
              <td class="text-center">{{ formatDate(h.completedAt) }}</td>
              <td class="text-center">
                <span
                  class="badge"
                  :class="
                    h.status === 'PASSED'
                      ? 'bg-success'
                      : h.status === 'FAILED'
                      ? 'bg-danger'
                      : 'bg-secondary'
                  "
                >
                  {{ h.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showForm" class="form-modal-overlay">
      <div class="form-modal-content">
        <div class="modal-header">
          <h2 class="modal-title">
            {{ selectedHistory ? "Chỉnh sửa" : "Thêm mới" }}
          </h2>
          <button @click="showForm = false" class="close-btn">&times;</button>
        </div>
        <LearningHistoryForm
          :data="selectedHistory"
          :topics="topics"
          @save="saveHistory"
          @cancel="showForm = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import LearningHistoryFilters from "../LearningHistory/LearningHistoryFilters.vue";
import LearningHistoryForm from "../LearningHistory/LearningHistoryForm.vue";
import {
  getAllHistories,
  addHistory,
  updateHistory,
  deleteHistory,
} from "@/services/learningHistoryService.js";
import Swal from "sweetalert2";
import userService from "@/services/userService";

// State
const histories = ref([]);
const topics = ["Ngữ pháp", "Từ vựng", "Nghe", "Kanji"];
const showForm = ref(false);
const selectedHistory = ref(null);
const currentFilters = ref({
  query: "",
  topic: "",
  status: "",
});

// Computed Properties
const filteredHistories = computed(() => {
  let result = histories.value;
  const { query, topic, status } = currentFilters.value;

  // Filter by search query (user or topic)
  if (query) {
    result = result.filter(
      (h) =>
        h.user.toLowerCase().includes(query.toLowerCase()) ||
        h.topic.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Filter by topic
  if (topic) {
    result = result.filter((h) => h.topic === topic);
  }

  // Filter by status (progress)
  if (status) {
    const isCompleted = status === "Hoàn thành";
    result = result.filter((h) => {
      const progressValue = parseInt(h.progress, 10);
      return isCompleted
        ? progressValue === 100
        : progressValue > 0 && progressValue < 100;
    });
  }

  return result;
});
const getLichSu = async () => {
  const data = await userService.getLichSuOnTap();
  histories.value = data;
  console.log("Data lich su nhan duoc la", JSON.stringify(data, null, 2));
};

// Methods
const handleFilterChange = (filters) => {
  currentFilters.value = filters;
};
onMounted(() => {
  getLichSu();
});
const showSuccessPopup = (title, message) => {
  Swal.fire({
    icon: "success",
    title: title,
    text: message,
    showConfirmButton: false,
    timer: 2000,
  });
};

const showErrorPopup = (title, message) => {
  Swal.fire({
    icon: "error",
    title: title,
    text: message,
  });
};

const openAddForm = () => {
  selectedHistory.value = null;
  showForm.value = true;
};

const openEditForm = (history) => {
  selectedHistory.value = { ...history };
  showForm.value = true;
};

const saveHistory = (data) => {
  try {
    if (data.id) {
      updateHistory(data.id, data);
      showSuccessPopup(
        "Cập nhật thành công!",
        "Lịch sử ôn tập đã được cập nhật."
      );
    } else {
      addHistory(data);
      showSuccessPopup(
        "Thêm mới thành công!",
        "Lịch sử ôn tập mới đã được thêm."
      );
    }
    histories.value = getAllHistories();
    showForm.value = false;
  } catch (error) {
    showErrorPopup("Lỗi!", "Đã xảy ra lỗi khi lưu lịch sử.");
  }
};
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const confirmDelete = (id) => {
  Swal.fire({
    title: "Bạn có chắc chắn muốn xóa?",
    text: "Bạn sẽ không thể khôi phục bản ghi này!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Đồng ý, xóa!",
  }).then((result) => {
    if (result.isConfirmed) {
      remove(id);
    }
  });
};

const remove = (id) => {
  try {
    deleteHistory(id);
    histories.value = getAllHistories();
    showSuccessPopup("Đã xóa!", "Bản ghi đã được xóa thành công.");
  } catch (error) {
    showErrorPopup("Lỗi!", "Đã xảy ra lỗi khi xóa bản ghi.");
  }
};

const getProgressClass = (progress) => {
  const progressValue = parseInt(progress, 10);
  if (progressValue >= 100) return "badge-completed";
  if (progressValue > 0) return "badge-in-progress";
  return "badge-not-started";
};
</script>

<style scoped>
.admin-page-container {
  padding: 30px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon {
  font-size: 1.8rem;
  color: #3498db;
}

.btn-primary {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-primary:hover {
  background-color: #27ae60;
}

.toolbar-container {
  margin-bottom: 25px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.table-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-top: 25px;
}

.table-responsive {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.95rem;
  color: #34495e;
}

.history-table th,
.history-table td {
  padding: 16px;
  border-bottom: 1px solid #e0e6ed;
  transition: background-color 0.3s ease;
}

.history-table th {
  background-color: #f0f3f8;
  font-weight: 600;
  color: #7f8c8d;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.history-table tbody tr:nth-child(odd) {
  background-color: #fcfdfe;
}
.history-table tbody tr:hover {
  background-color: #f3f6f9;
}

.text-center {
  text-align: center;
}

.badge {
  padding: 6px 14px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.8rem;
  color: white;
  min-width: 100px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: inline-block;
}

.badge-grammar {
  background-color: #3498db;
}
.badge-vocabulary {
  background-color: #9b59b6;
}
.badge {
  padding: 6px 14px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.8rem;
  color: white;
  min-width: 100px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: inline-block;
  background-color: #3498db; /* màu cố định */
}
.badge-listening {
  background-color: #f39c12;
}
.badge-kanji {
  background-color: #e74c3c;
}

.badge-completed {
  background-color: #2ecc71;
}
.badge-in-progress {
  background-color: #34495e;
}
.badge-not-started {
  background-color: #95a5a6;
}

.action-buttons {
  white-space: nowrap;
}

.btn-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  margin: 0 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-edit {
  background-color: #eaf3ff;
  color: #3498db;
}
.btn-edit:hover {
  background-color: #d6e9ff;
  color: #2980b9;
  transform: scale(1.1);
}

.btn-delete {
  background-color: #fdecea;
  color: #e74c3c;
}
.btn-delete:hover {
  background-color: #f9d6d2;
  color: #c0392b;
  transform: scale(1.1);
}

.form-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.form-modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e6ed;
  padding-bottom: 15px;
  margin-bottom: 20px;
}
.modal-title {
  font-size: 1.8rem;
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 2.2rem;
  cursor: pointer;
  color: #bdc3c7;
}
</style>
