<template>
  <div class="learning-path-view-container">
    <div class="learning-path-header">
      <h1 class=" bi-book learning-path-title">  Quản lý Lộ trình Học</h1>
      <button class="btn btn-primary btn-add-new" @click="openAdd">
        <i class="bi bi-plus-circle me-2"></i> Tạo lộ trình mới
      </button>
    </div>

    <LearningStats :stats="stats" class="mb-4" />

    <div class="card learning-path-toolbar-card mb-4">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div class="search-input-group flex-grow-1 me-3">
          <input
            type="text"
            class="form-control search-input"
            placeholder="Tìm kiếm theo tên người dùng hoặc lộ trình..."
            v-model="keyword"
            @input="handleSearch(keyword)"
          />
          <i class="bi bi-search search-icon"></i>
        </div>

        <div class="items-per-page-group">
          <label for="itemsPerPage" class="me-2 text-muted">Mục mỗi trang:</label>
          <select id="itemsPerPage" v-model="itemsPerPage" class="form-select form-select-sm" @change="currentPage = 1">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card learning-path-table-card">
      <div class="card-body p-0">
        <LearningTable
          :data="paginatedPaths" @edit="openEdit"
          @delete="handleDelete"
          @detail="openDetail"
        />
      </div>
    </div>

    <div class="d-flex justify-content-center mt-4">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="handlePageChange"
      />
    </div>

    <Teleport to="body">
      <div v-if="showPopup" class="modal-backdrop fade show"></div>
      <div v-if="showPopup" class="modal custom-modal" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <LearningPopup
              :data="selectedData"
              :mode="popupMode"
              @close="closePopup"
              @save="handleSave"
            />
          </div>
        </div>
      </div>
    </Teleport>

    <NotificationToast
      ref="notificationToast"
      :message="toastMessage"
      :type="toastType"
    />
  </div>
</template>

<script>
// Make sure learningPathService returns a mutable array or an object that can be mutated
import { stats, learningPaths } from '../../services/learningPathService';

import LearningStats from '../learning-path/LearningStats.vue'
import LearningTable from '../learning-path/LearningTable.vue'
import LearningPopup from '../learning-path/LearningPopup.vue'
import NotificationToast from '../share/NotificationToast.vue';
import Pagination from '../share/Pagination.vue'; // Import Pagination component

export default {
  components: {
    LearningStats,
    LearningTable,
    LearningPopup,
    NotificationToast,
    Pagination, // Add Pagination component
  },
  data() {
    return {
      stats: [...stats], // Assuming stats array is small and doesn't need pagination
      paths: [...learningPaths], // This will be the full dataset
      keyword: '',
      showPopup: false,
      popupMode: 'add', // 'add', 'edit', 'detail'
      selectedData: null,
      // Dữ liệu cho Toast Notification
      toastMessage: '',
      toastType: 'success',

      // Pagination data
      currentPage: 1,
      itemsPerPage: 10, // Default items per page
    };
  },
  computed: {
    filteredPaths() {
      if (!this.keyword) return this.paths;
      return this.paths.filter(
        p =>
          p.name.toLowerCase().includes(this.keyword.toLowerCase()) ||
          p.pathName.toLowerCase().includes(this.keyword.toLowerCase())
      );
    },
    // Computed property for total pages
    totalPages() {
      return Math.ceil(this.filteredPaths.length / this.itemsPerPage);
    },
    // Computed property for paginated data
    paginatedPaths() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPaths.slice(start, end);
    }
  },
  methods: {
    openAdd() {
      this.popupMode = 'add';
      this.selectedData = null;
      this.showPopup = true;
    },
    openEdit(item) {
      this.popupMode = 'edit';
      this.selectedData = { ...item };
      this.showPopup = true;
    },
    openDetail(item) {
      this.popupMode = 'detail';
      this.selectedData = { ...item };
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
      this.selectedData = null;
    },
    handleSave(data) {
      let message = '';
      let toastType = 'success'; // Default to success
      if (this.popupMode === 'add') {
        const newId = this.paths.length > 0 ? Math.max(...this.paths.map(p => p.id)) + 1 : 1;
        this.paths.push({ ...data, id: newId });
        message = 'Thêm lộ trình mới thành công!';
      } else { // 'edit'
        const index = this.paths.findIndex(p => p.id === data.id);
        if (index !== -1) {
          this.paths[index] = { ...data };
          message = 'Cập nhật lộ trình thành công!';
        } else {
          message = 'Cập nhật lộ trình thất bại!'; // Trường hợp không tìm thấy
          toastType = 'error';
        }
      }
      this.closePopup();
      this.showToast(message, toastType);
    },
    handleDelete(item) {
      if (confirm(`Bạn có chắc chắn muốn xóa lộ trình của "${item.name}" - "${item.pathName}" không?`)) {
        const initialLength = this.paths.length;
        this.paths = this.paths.filter(p => p.id !== item.id);
        if (this.paths.length < initialLength) {
            this.showToast('Xóa lộ trình thành công!', 'success');
            // Adjust current page if the last item of a page was deleted
            if (this.paginatedPaths.length === 0 && this.currentPage > 1) {
                this.currentPage--;
            }
        } else {
            this.showToast('Xóa lộ trình thất bại!', 'error');
        }
      }
    },
    handleSearch(keyword) {
      this.keyword = keyword;
      this.currentPage = 1; // Reset to first page on search
    },
    // Method to handle page changes from Pagination component
    handlePageChange(page) {
      this.currentPage = page;
    },
    // Phương thức để hiển thị toast notification
    showToast(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      // Gọi phương thức show() của component NotificationToast thông qua ref
      this.$refs.notificationToast.show();
    }
  },
  mounted() {
    // Optionally, if your learningPathService.js fetches data asynchronously
    // you might want to call a loadPaths method here, similar to BadgeView's loadBadges.
    // For now, it directly uses imported arrays.
  }
};
</script>

<style scoped>
/* Kế thừa style từ phiên bản trước đó của LearningPathView.vue */
.learning-path-view-container {
  padding: 1.5rem 2rem;
  background-color: #f8fafd;
  min-height: calc(100vh - 60px);
}

/* Header Section */
.learning-path-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.learning-path-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0;
  line-height: 1.2;
}

.btn-add-new {
  background-color: #007bff;
  border-color: #007bff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
}

.btn-add-new:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3);
}

.btn-add-new i {
  font-size: 1.1em;
  vertical-align: middle;
}

/* Toolbar Card (Search Input and Items per page) */
.learning-path-toolbar-card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  padding: 0.75rem 1.25rem;
}

.search-input-group {
  position: relative;
  max-width: 400px; /* Limit width of search input */
}

.search-input {
  border-radius: 0.5rem;
  padding-left: 2.5rem;
  border: 1px solid #ced4da;
  transition: all 0.2s ease;
  height: 45px;
  font-size: 1rem;
  color: #495057;
}

.search-input:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  outline: none;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
  pointer-events: none; /* Make icon non-interactive */
}

.items-per-page-group {
    display: flex;
    align-items: center;
    margin-left: auto; /* Push to the right */
}

.items-per-page-group .form-select {
    width: auto; /* Auto width based on content */
    min-width: 80px; /* Minimum width for select */
    border-radius: 0.5rem;
    height: 45px; /* Match search input height */
    font-size: 1rem;
    padding-left: 0.75rem;
    padding-right: 2rem; /* Space for dropdown arrow */
}

/* Table Card */
.learning-path-table-card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

/* Override default Bootstrap modal styling for custom look */
.custom-modal.modal {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
}

.custom-modal .modal-dialog {
  max-width: 90%;
}

.custom-modal .modal-content {
  border-radius: 1rem;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .learning-path-view-container {
    padding: 1rem;
  }
  .learning-path-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  .learning-path-title {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }
  .btn-add-new {
    width: 100%;
    text-align: center;
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
  .learning-path-toolbar-card .card-body {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input-group {
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
    margin-right: 0 !important; /* Override me-3 */
  }
  .items-per-page-group {
    width: 100%;
    margin-left: 0; /* Remove auto margin */
    justify-content: flex-end; /* Align right on small screens */
  }
  .items-per-page-group label {
      white-space: nowrap; /* Prevent label from wrapping */
  }
  .items-per-page-group .form-select {
      flex-grow: 0; /* Don't grow */
      max-width: 120px; /* Limit width of select box */
  }
}

@media (max-width: 576px) {
  .learning-path-title {
    font-size: 1.5rem;
  }
}
</style>