<template>
  <div class="admin-page-container">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-file-earmark-bar-graph icon"></i> Quản lý Kết đề Thi
      </h1>
    </div>

    <div class="toolbar-container">
      <div class="filter-group">
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm theo tên đề thi..."
            class="search-input"
          />
          <i class="bi bi-search search-icon"></i>
        </div>
        <div class="topic-filter">
          <label for="topic-filter" class="filter-label">Chủ đề:</label>
          <select
            id="topic-filter"
            v-model.number="selectedTopicId"
            class="form-select"
          >
            <option :value="null">Tất cả chủ đề</option>
            <option v-for="t in topics" :key="t.id" :value="t.id">
              {{ t.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive">
        <table class="exam-table">
          <thead>
            <tr>
              <th>Tên đề thi</th>
              <th>Link download</th>
              <th>AudioUrl</th>
              <th>Thời gian làm</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in examResults" :key="result.id">
              <td>{{ result.examName }}</td>

              <td>
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="showLinks[result.id] = !showLinks[result.id]"
                >
                  {{ showLinks[result.id] ? "Ẩn link" : "Hiện link" }}
                </button>
                <div v-if="showLinks[result.id]" class="mt-1">
                  <a :href="result.downloadUrl" target="_blank">{{
                    result.downloadUrl
                  }}</a>
                </div>
              </td>

              <td>
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="
                    showLinks['audio-' + result.id] =
                      !showLinks['audio-' + result.id]
                  "
                >
                  {{
                    showLinks["audio-" + result.id] ? "Ẩn audio" : "Hiện audio"
                  }}
                </button>
                <div v-if="showLinks['audio-' + result.id]" class="mt-1">
                  <a :href="result.audioUrl" target="_blank">{{
                    result.audioUrl
                  }}</a>
                </div>
              </td>

              <td>
                <span class="score-badge">{{ result.examTime }}</span>
              </td>
              <td>{{ result.createAt }}</td>

              <td>
                <span
                  class="badge"
                  :class="
                    result.status === 'PUBLIC'
                      ? 'badge-success'
                      : result.status === 'LOCKED'
                      ? 'badge-danger'
                      : 'badge-warning'
                  "
                >
                  {{ result.status }}
                </span>
              </td>

              <td class="action-buttons text-center">
                <!-- Nút Thêm mới -->
                <button
                  class="btn-action btn-add"
                  @click="openForm()"
                  title="Thêm mới"
                >
                  <i class="bi bi-plus"></i>
                </button>
                <!-- Nút chỉnh sửa -->
                <button
                  class="btn-action btn-edit"
                  @click="openForm(result)"
                  title="Chỉnh sửa"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <!-- Nút xóa -->
                <button
                  class="btn-action btn-delete"
                  @click="confirmDelete(result.id)"
                  title="Xóa"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Form thêm/cập nhật -->
    <div v-if="showFormModal" class="form-modal-overlay">
      <div class="form-modal-content">
        <h2 class="modal-title">
          {{ selectedExam.id ? "Cập nhật" : "Thêm mới" }}
        </h2>
        <form @submit.prevent="saveExam">
          <div class="mb-3">
            <label class="form-label">Tên đề thi</label>
            <input
              type="text"
              v-model="selectedExam.examName"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">File</label>
            <input type="file" @change="onFileChange" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Audio URL</label>
            <input
              type="text"
              v-model="selectedExam.audioUrl"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Thời gian làm</label>
            <input
              type="number"
              v-model="selectedExam.examTime"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Text Reading</label>
            <textarea
              v-model="selectedExam.textReading"
              class="form-control"
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Trạng thái</label>
            <select v-model="selectedExam.status" class="form-select">
              <option value="PUBLIC">PUBLIC</option>
              <option value="LOCKED">LOCKED</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="submit" class="btn btn-success">
              {{ selectedExam.id ? "Cập nhật" : "Thêm mới" }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="showFormModal = false"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import {
  getAllExam,
  deleteExamResult,
  addExamm,
} from "@/services/examService.js";

const examResults = ref([]);
const showLinks = ref({});
const showFormModal = ref(false);
const selectedExam = ref({});
const searchQuery = ref("");
const selectedTopicId = ref(null);
const topics = ref([]); // có thể fetch từ API

const fetchExams = async () => {
  try {
    const data = await getAllExam();
    examResults.value = data;
  } catch (error) {
    console.error("Lỗi khi lấy exam:", error);
  }
};

onMounted(() => fetchExams());

// Mở form thêm/cập nhật
const openForm = (exam = null) => {
  if (exam) {
    selectedExam.value = { ...exam };
  } else {
    selectedExam.value = {
      examName: "",
      file: null,
      audioUrl: "",
      examTime: 0,
      textReading: "",
      status: "PUBLIC",
    };
  }
  showFormModal.value = true;
};

// Xử lý file upload
const handleFileUpload = (event) => {
  selectedExam.value.file = event.target.files[0];
};
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedExam.value.file = file;
  }
};

// Lưu exam (mock)
const saveExam = async () => {
  try {
    // Tạo FormData để gửi file + các trường khác
    const formData = new FormData();
    if (selectedExam.value.id) {
      formData.append("id", selectedExam.value.id);
    }
    formData.append("examName", selectedExam.value.examName);
    formData.append("status", selectedExam.value.status);
    formData.append("examTime", selectedExam.value.examTime);
    formData.append("textReading", selectedExam.value.textReading);
    if (selectedExam.value.audioUrl) {
      formData.append("audioUrl", selectedExam.value.audioUrl);
    }
    if (selectedExam.value.file) {
      formData.append("file", selectedExam.value.file);
    }

    // Gọi API thêm mới hoặc update
    await addExam(formData);

    // Thông báo thành công
    Swal.fire(
      "Thành công!",
      selectedExam.value.id ? "Đã cập nhật đề thi." : "Đã thêm đề thi mới.",
      "success"
    );

    // Đóng form
    showFormModal.value = false;

    // Cập nhật lại danh sách đề thi
    await getxam();
  } catch (error) {
    console.error("Lỗi khi lưu đề thi:", error);
    Swal.fire("Lỗi!", "Đã xảy ra lỗi khi lưu đề thi.", "error");
  }
};

// Hàm xóa

const confirmDelete = async (id) => {
  const res = await Swal.fire({
    title: "Bạn có chắc chắn muốn xóa?",
    text: "Hành động này sẽ xóa đề thi!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Đồng ý, xóa!",
  });

  if (res.isConfirmed) {
    try {
      await deleteExamm(id); // gọi API xóa
      Swal.fire("Đã xóa!", "Đề thi đã được xóa.", "success");
      await getxam(); // cập nhật lại danh sách từ server
    } catch (error) {
      console.error("Lỗi khi xóa đề thi:", error);
      Swal.fire("Lỗi!", "Đã xảy ra lỗi khi xóa đề thi.", "error");
    }
  }
};
</script>

<style scoped>
/* giữ nguyên style cũ, chỉ thêm nút thêm mới */
.admin-page-container {
  padding: 30px;
  background-color: #f5f7fa;
  min-height: 100vh;
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
.toolbar-container {
  margin-bottom: 25px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.search-bar {
  position: relative;
  width: 300px;
}
.search-input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
}
.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
}
.table-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-top: 25px;
}
.exam-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.95rem;
  color: #34495e;
}
.exam-table th,
.exam-table td {
  padding: 16px;
  border-bottom: 1px solid #e0e6ed;
}
.score-badge {
  padding: 5px 10px;
  background-color: #3498db;
  color: white;
  border-radius: 5px;
  font-weight: bold;
}
.badge {
  padding: 6px 14px;
  border-radius: 50px;
  color: white;
  font-weight: 600;
  text-align: center;
}
.badge-success {
  background-color: #2ecc71;
}
.badge-danger {
  background-color: #e74c3c;
}
.badge-warning {
  background-color: #f39c12;
}
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 5px;
}
.btn-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}
.btn-add {
  background-color: #e0f7fa;
  color: #00796b;
}
.btn-edit {
  background-color: #eaf3ff;
  color: #3498db;
}
.btn-delete {
  background-color: #fdecea;
  color: #e74c3c;
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
  width: 90%;
  max-width: 600px;
}
</style>
