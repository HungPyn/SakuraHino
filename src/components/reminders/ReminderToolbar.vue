<template>
  <div class="reminder-toolbar-card card mb-4">
    <div class="card-body d-flex align-items-center justify-content-between flex-wrap">
      <div class="search-input-group flex-grow-1 me-3 mb-2 mb-md-0">
        <input
          type="text"
          class="form-control search-input"
          placeholder="Tìm kiếm theo loại, tiêu đề hoặc trạng thái..."
          v-model="internalKeyword"
          @input="onSearchInput"
        />
        <i class="bi bi-search search-icon"></i>
      </div>

      <div class="filter-group d-flex align-items-center flex-wrap gap-3 me-3 mb-2 mb-md-0">
        <div class="d-flex align-items-center">
          <label for="filterType" class="me-2 text-muted">Loại:</label>
          <select id="filterType" v-model="internalFilterType" class="form-select form-select-sm" @change="emitFilters">
            <option value="all">Tất cả</option>
            <option value="lesson">Bài học</option>
            <option value="course">Khóa học</option>
            <option value="deadline">Hạn chót</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div class="d-flex align-items-center">
          <label for="filterStatus" class="me-2 text-muted">Trạng thái:</label>
          <select id="filterStatus" v-model="internalFilterStatus" class="form-select form-select-sm" @change="emitFilters">
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="overdue">Quá hạn</option>
          </select>
        </div>
      </div>

      <button class="btn btn-outline-secondary btn-sm me-3 mb-2 mb-md-0" @click="resetFilters">
        <i class="bi bi-arrow-counterclockwise me-1"></i> Đặt lại
      </button>

      <div class="items-per-page-group ms-md-auto">
        <label for="itemsPerPage" class="me-2 text-muted">Mục mỗi trang:</label>
        <select id="itemsPerPage" v-model="internalPerPage" class="form-select form-select-sm" @change="emitUpdatePerPage">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'; // Cần cài đặt lodash: npm install lodash

export default {
  emits: ['search', 'update-per-page', 'filter-type', 'filter-status', 'reset-filters'],
  data() {
    return {
      internalKeyword: '',
      internalFilterType: 'all',
      internalFilterStatus: 'all',
      internalPerPage: 5, // Giá trị mặc định, đồng bộ với ReminderView
    };
  },
  created() {
    // Debounce the search input to avoid too many emissions
    this.onSearchInput = debounce(this.emitSearch, 300);
  },
  methods: {
    emitSearch() {
      this.$emit('search', this.internalKeyword);
    },
    emitFilters() {
      this.$emit('filter-type', this.internalFilterType);
      this.$emit('filter-status', this.internalFilterStatus);
    },
    emitUpdatePerPage() {
      this.$emit('update-per-page', parseInt(this.internalPerPage));
    },
    resetFilters() {
      this.internalKeyword = '';
      this.internalFilterType = 'all';
      this.internalFilterStatus = 'all';
      this.emitSearch(); // Gửi event search rỗng
      this.emitFilters(); // Gửi event filter về 'all'
      this.$emit('reset-filters'); // Báo cho cha biết là đã reset
    }
  }
};
</script>

<style scoped>
.reminder-toolbar-card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

.search-input-group {
  position: relative;
  max-width: 400px;
}

.search-input {
  border-radius: 0.5rem;
  padding-left: 2.5rem;
  height: 45px;
  border-color: #e0e0e0;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.filter-group label,
.items-per-page-group label {
  font-weight: 500;
  color: #555;
  white-space: nowrap;
}

.filter-group .form-select,
.items-per-page-group .form-select {
  border-radius: 0.5rem;
  height: 45px;
  font-size: 0.95rem;
  border-color: #e0e0e0;
}

.filter-group .form-select:focus,
.items-per-page-group .form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .reminder-toolbar-card .card-body {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input-group {
    max-width: 100%;
    margin-right: 0 !important;
    margin-bottom: 1rem !important;
  }

  .filter-group,
  .items-per-page-group {
    width: 100%;
    margin-left: 0 !important;
    margin-bottom: 1rem;
  }

  .filter-group select,
  .items-per-page-group select {
    width: 100%;
  }

  .btn-outline-secondary {
    width: 100%;
    margin-right: 0 !important;
    margin-bottom: 1rem !important;
  }
}
</style>