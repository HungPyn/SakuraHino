<template>
  <div class="admin-page-container">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-calendar-check icon"></i> Quản lý Ôn tập Bài học
      </h1>
      <button @click="openAddForm" class="btn-primary btn-add-new">
        <i class="bi bi-plus-circle-fill"></i> Thêm mới
      </button>
    </div>

    <div class="toolbar-container">
      <ReviewFilters
        @filter-change="handleFilterChange"
        :topics="topics"
        :levels="levels"
      />
    </div>

    <div class="table-card">
      <div class="table-responsive">
        <table class="review-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Chủ đề</th>
              <th>Độ khó</th>
              <th>Ngày đến hạn</th>
              <th>Trạng thái</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in filteredReviews" :key="r.id">
              <td>{{ r.title }}</td>
              <td>
                <span :class="['badge', getTopicClass(r.topic)]">{{ r.topic }}</span>
              </td>
              <td>
                <span :class="['badge', getLevelClass(r.level)]">{{ r.level }}</span>
              </td>
              <td>{{ r.dueDate }}</td>
              <td>
                <span :class="['badge', getStatusClass(r.status)]">{{ r.status }}</span>
              </td>
              <td class="action-buttons text-center">
                <button class="btn-action btn-edit" @click="openEditForm(r)" title="Sửa">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action btn-delete" @click="confirmDelete(r.id)" title="Xóa">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showForm" class="form-modal-overlay">
      <div class="form-modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedReview ? 'Chỉnh sửa' : 'Thêm mới' }}</h2>
          <button @click="showForm = false" class="close-btn">&times;</button>
        </div>
        <ReviewForm
          :data="selectedReview"
          :topics="topics"
          :levels="levels"
          @save="saveReview"
          @cancel="showForm = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ReviewFilters from "../review/ReviewFilters.vue";
import ReviewForm from "../review/ReviewForm.vue";
import { getAllReviews, addReview, updateReview, deleteReview } from "../../services/reviewService.js";
import Swal from 'sweetalert2';

// State
const reviews = ref(getAllReviews());
const topics = ["Ngữ pháp", "Từ vựng", "Nghe", "Kanji"];
const levels = ["N5", "N4", "N3", "N2", "N1"];
const showForm = ref(false);
const selectedReview = ref(null);
const currentFilters = ref({
  query: '',
  topic: '',
  level: '',
  status: ''
});

// Computed Properties
const filteredReviews = computed(() => {
  let result = reviews.value;
  const { query, topic, level, status } = currentFilters.value;

  if (query) {
    result = result.filter(r =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.topic.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (topic) {
    result = result.filter(r => r.topic === topic);
  }

  if (level) {
    result = result.filter(r => r.level === level);
  }
  
  if (status) {
    result = result.filter(r => r.status === status);
  }

  return result;
});

// Methods
const handleFilterChange = (filters) => {
  currentFilters.value = filters;
};

const showSuccessPopup = (title, message) => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    showConfirmButton: false,
    timer: 2000
  });
};

const showErrorPopup = (title, message) => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
  });
};

const openAddForm = () => {
  selectedReview.value = null;
  showForm.value = true;
};

const openEditForm = (review) => {
  selectedReview.value = { ...review };
  showForm.value = true;
};

const saveReview = (data) => {
  try {
    if (data.id) {
      updateReview(data.id, data);
      showSuccessPopup('Cập nhật thành công!', 'Bài ôn tập đã được cập nhật.');
    } else {
      addReview(data);
      showSuccessPopup('Thêm mới thành công!', 'Bài ôn tập mới đã được thêm.');
    }
    reviews.value = getAllReviews();
    showForm.value = false;
  } catch (error) {
    showErrorPopup('Lỗi!', 'Đã xảy ra lỗi khi lưu bài ôn tập.');
  }
};

const confirmDelete = (id) => {
  Swal.fire({
    title: 'Bạn có chắc chắn muốn xóa?',
    text: "Bạn sẽ không thể khôi phục bản ghi này!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Đồng ý, xóa!'
  }).then((result) => {
    if (result.isConfirmed) {
      remove(id);
    }
  });
};

const remove = (id) => {
  try {
    deleteReview(id);
    reviews.value = getAllReviews();
    showSuccessPopup('Đã xóa!', 'Bản ghi đã được xóa thành công.');
  } catch (error) {
    showErrorPopup('Lỗi!', 'Đã xảy ra lỗi khi xóa bản ghi.');
  }
};

const getTopicClass = (topic) => {
  switch (topic) {
    case 'Ngữ pháp':
      return 'badge-grammar';
    case 'Từ vựng':
      return 'badge-vocabulary';
    case 'Nghe':
      return 'badge-listening';
    case 'Kanji':
      return 'badge-kanji';
    default:
      return 'badge-default';
  }
};

const getLevelClass = (level) => {
  switch (level) {
    case 'N5':
      return 'badge-n5';
    case 'N4':
      return 'badge-n4';
    case 'N3':
      return 'badge-n3';
    case 'N2':
      return 'badge-n2';
    case 'N1':
      return 'badge-n1';
    default:
      return 'badge-default';
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Hoàn thành':
      return 'badge-completed';
    case 'Đang ôn tập':
      return 'badge-in-progress';
    case 'Chưa bắt đầu':
      return 'badge-not-started';
    default:
      return 'badge-default';
  }
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

.review-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.95rem;
  color: #34495e;
}

.review-table th,
.review-table td {
  padding: 16px;
  border-bottom: 1px solid #e0e6ed;
  transition: background-color 0.3s ease;
}

.review-table th {
  background-color: #f0f3f8;
  font-weight: 600;
  color: #7f8c8d;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.review-table tbody tr:nth-child(odd) {
  background-color: #fcfdfe;
}
.review-table tbody tr:hover {
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

/* Topic Badges */
.badge-grammar { background-color: #3498db; }
.badge-vocabulary { background-color: #9b59b6; }
.badge-listening { background-color: #f39c12; }
.badge-kanji { background-color: #e74c3c; }

/* Level Badges */
.badge-n5 { background-color: #1abc9c; }
.badge-n4 { background-color: #3498db; }
.badge-n3 { background-color: #f1c40f; }
.badge-n2 { background-color: #e67e22; }
.badge-n1 { background-color: #e74c3c; }

/* Status Badges */
.badge-completed { background-color: #2ecc71; }
.badge-in-progress { background-color: #34495e; }
.badge-not-started { background-color: #95a5a6; }

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