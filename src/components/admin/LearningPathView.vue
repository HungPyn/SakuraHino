<template>
  <div class="learning-path-view-container">
    <div class="learning-path-header">
      <h1 class="bi-book learning-path-title"> Quản lý Lộ trình Học</h1>
      <button class="btn btn-primary btn-add-new" @click="openAdd">
        <i class="bi bi-plus-circle me-2"></i> Tạo lộ trình mới
      </button>
    </div>

    <div class="card learning-path-toolbar-card mb-4">
      <div class="card-body d-flex align-items-center justify-content-between flex-wrap">
        <div class="search-input-group flex-grow-1 me-3 mb-2 mb-md-0">
          <input
            type="text"
            class="form-control search-input"
            placeholder="Tìm kiếm theo tên người dùng hoặc lộ trình..."
            v-model="keyword"
            @input="handleSearch(keyword)"
          />
          <i class="bi bi-search search-icon"></i>
        </div>

        <LearningPathFilter
          v-model:filterStatus="filterStatus"
          v-model:filterProgress="filterProgress"
          v-model:filterDateRange="filterDateRange"
          @reset-filters="resetAdvancedFilters"
        />
      </div>
    </div>

    <div class="card learning-path-table-card">
      <div class="card-body p-0">
        <LearningTable
          :data="paginatedPaths"
          @edit="openEdit"
          @delete="handleDelete"
          @detail="openDetail"
        />
        <p v-if="paginatedPaths.length === 0" class="text-center text-muted py-4 m-0">Không có lộ trình nào phù hợp với bộ lọc.</p>
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
// Loại bỏ 'stats' khỏi import nếu nó chỉ được dùng cho LearningStats
import { learningPaths } from '../../services/learningPathService'; 
// Loại bỏ LearningStats khỏi import nếu không sử dụng nữa
// import LearningStats from '../learning-path/LearningStats.vue';
import LearningTable from '../learning-path/LearningTable.vue';
import LearningPopup from '../learning-path/LearningPopup.vue';
import NotificationToast from '../share/NotificationToast.vue';
import Pagination from '../share/Pagination.vue';
import LearningPathFilter from '../learning-path/LearningPathFilter.vue';

export default {
  components: {
    // Loại bỏ LearningStats khỏi danh sách components
    // LearningStats,
    LearningTable,
    LearningPopup,
    NotificationToast,
    Pagination,
    LearningPathFilter,
  },
  data() {
    return {
      // Xóa 'stats: [...stats],' nếu bạn đã loại bỏ import 'stats'
      // stats: [...stats], 
      paths: [...learningPaths],
      keyword: '',
      showPopup: false,
      popupMode: 'add', // 'add', 'edit', 'detail'
      selectedData: null,
      toastMessage: '',
      toastType: 'success',

      currentPage: 1,
      itemsPerPage: 10,

      // Advanced Filters State
      filterStatus: '', // 'active', 'completed', 'inactive'
      filterProgress: '', // 'lt50', '50to75', 'gt75', 'completed' (less than 50%, 50-75%, greater than 75%, greater than 75%, completed)
      filterDateRange: '', // '7days', '30days', '90days', 'all'
    };
  },
  computed: {
    filteredPaths() {
      let result = [...this.paths];

      // 1. Filter by Keyword
      if (this.keyword) {
        const query = this.keyword.toLowerCase();
        result = result.filter(
          p =>
            (p.name && p.name.toLowerCase().includes(query)) || // Tên người dùng
            (p.pathName && p.pathName.toLowerCase().includes(query)) // Tên lộ trình
        );
      }

      // 2. Filter by Status
      if (this.filterStatus) {
        result = result.filter(p => p.status === this.filterStatus);
      }

      // 3. Filter by Progress (assuming `progress` is a number from 0-100 and `isCompleted` if available)
      if (this.filterProgress) {
        result = result.filter(p => {
          const progressValue = parseFloat(p.progress); // Convert progress to number
          if (this.filterProgress === 'lt50') return progressValue < 50;
          if (this.filterProgress === '50to75') return progressValue >= 50 && progressValue <= 75;
          if (this.filterProgress === 'gt75') return progressValue > 75 && progressValue < 100;
          if (this.filterProgress === 'completed') return progressValue === 100 || p.isCompleted; // Assuming a boolean isCompleted
          return true;
        });
      }

      // 4. Filter by Date Range (assuming `startDate` or `createdAt` field in your path data)
      // For simplicity, let's assume `createdAt` as a string 'YYYY-MM-DD' or similar
      if (this.filterDateRange && this.filterDateRange !== 'all') {
        const now = new Date();
        result = result.filter(p => {
          const pathDate = new Date(p.createdAt || p.startDate); // Use a relevant date field
          if (isNaN(pathDate.getTime())) return false; // Skip if date is invalid

          const diffTime = Math.abs(now - pathDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (this.filterDateRange === '7days') return diffDays <= 7;
          if (this.filterDateRange === '30days') return diffDays <= 30;
          if (this.filterDateRange === '90days') return diffDays <= 90;
          return true;
        });
      }

      return result;
    },
    totalPages() {
      return Math.ceil(this.filteredPaths.length / this.itemsPerPage);
    },
    paginatedPaths() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPaths.slice(start, end);
    },
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
    async handleSave(data) {
      let message = '';
      let toastType = 'success';
      let confirmMessage = '';

      if (this.popupMode === 'add') {
        confirmMessage = 'Bạn có muốn THÊM lộ trình mới này không?';
      } else { // 'edit'
        confirmMessage = 'Bạn có muốn CẬP NHẬT lộ trình này không?';
      }

      // Ask for user confirmation
      if (!confirm(confirmMessage)) {
        this.showToast('Đã hủy thao tác.', 'info');
        return;
      }

      try {
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
            message = 'Cập nhật lộ trình thất bại: Không tìm thấy lộ trình để cập nhật.';
            toastType = 'error';
          }
        }
        this.showToast(message, toastType);
        this.closePopup();
      } catch (error) {
        console.error("Lỗi khi lưu lộ trình:", error);
        this.showToast('Đã xảy ra lỗi khi lưu lộ trình.', 'error');
      }
    },
    async handleDelete(item) {
      const confirmMessage = `Bạn có chắc chắn muốn XÓA lộ trình của "${item.name}" - "${item.pathName}" không? Hành động này không thể hoàn tác.`;
      if (!confirm(confirmMessage)) {
        this.showToast('Đã hủy thao tác xóa.', 'info');
        return;
      }

      try {
        const initialLength = this.paths.length;
        this.paths = this.paths.filter(p => p.id !== item.id);
        if (this.paths.length < initialLength) {
          this.showToast('Xóa lộ trình thành công!', 'success');
          // Adjust current page if the last item of a page was deleted
          if (this.paginatedPaths.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
        } else {
          this.showToast('Xóa lộ trình thất bại: Không tìm thấy lộ trình để xóa.', 'error');
        }
      } catch (error) {
        console.error("Lỗi khi xóa lộ trình:", error);
        this.showToast('Đã xảy ra lỗi khi xóa lộ trình.', 'error');
      }
    },
    handleSearch(keyword) {
      this.keyword = keyword;
      this.currentPage = 1; // Reset to first page on search
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    resetAdvancedFilters() {
      this.filterStatus = '';
      this.filterProgress = '';
      this.filterDateRange = '';
      this.currentPage = 1; // Reset page after resetting filters
      this.showToast('Đã đặt lại bộ lọc nâng cao.', 'info');
    },
    showToast(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.$refs.notificationToast.show();
    },
  },
  mounted() {
    // In a real application, you would fetch learning paths from an API here.
    // E.g., learningPathService.fetchLearningPaths().then(data => this.paths = data);
  },
  watch: {
    // Watch advanced filters to reset page when they change
    filterStatus() {
      this.currentPage = 1;
    },
    filterProgress() {
      this.currentPage = 1;
    },
    filterDateRange() {
      this.currentPage = 1;
    },
    itemsPerPage() {
      this.currentPage = 1; // Reset to page 1 when itemsPerPage changes
    }
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
@media (max-width: 992px) {
  .learning-path-toolbar-card .card-body {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input-group {
    width: 100%;
    max-width: 100%;
    margin-right: 0 !important;
    margin-bottom: 1rem; /* Add margin below search on smaller screens */
  }
  /* Ensure filter component also stacks vertically */
  .learning-path-toolbar-card .learning-path-filter-container {
    width: 100%;
    margin-bottom: 1rem;
  }
  .items-per-page-group {
    width: 100%;
    margin-left: 0;
    justify-content: flex-end;
  }
  .items-per-page-group label {
    white-space: nowrap;
  }
  .items-per-page-group .form-select {
    flex-grow: 0;
    max-width: 120px;
  }
}


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
  /* Toolbar flex-direction already set to column for 992px and below */
}

@media (max-width: 576px) {
  .learning-path-title {
    font-size: 1.5rem;
  }
}
</style>