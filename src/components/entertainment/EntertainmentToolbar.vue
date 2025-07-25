<template>
  <div class="entertainment-toolbar-card card mb-4">
    <div class="card-body d-flex align-items-center justify-content-between flex-wrap">
      <div class="search-input-group flex-grow-1 me-3 mb-2 mb-md-0">
        <input
          type="text"
          class="form-control search-input"
          placeholder="Tìm kiếm theo tiêu đề..."
          v-model="internalKeyword"
          @input="onSearchInput"
        />
        <i class="bi bi-search search-icon"></i>
      </div>

      <div class="filter-group d-flex align-items-center flex-wrap gap-3 me-3 mb-2 mb-md-0">
        <div class="d-flex align-items-center">
          <label for="filterGenre" class="me-2 text-muted">Thể loại:</label>
          <select id="filterGenre" v-model="internalFilterGenre" class="form-select form-select-sm" @change="emitFilters">
            <option value="all">Tất cả</option>
            <option value="story">Truyện ngắn</option>
            <option value="comic">Truyện tranh</option>
            <option value="game">Trò chơi</option>
            <option value="quiz">Câu đố</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div class="d-flex align-items-center">
          <label for="filterStatus" class="me-2 text-muted">Trạng thái:</label>
          <select id="filterStatus" v-model="internalFilterStatus" class="form-select form-select-sm" @change="emitFilters">
            <option value="all">Tất cả</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </div>
      </div>

      <button class="btn btn-outline-secondary btn-sm me-3 mb-2 mb-md-0" @click="resetFilters">
        <i class="bi bi-arrow-counterclockwise me-1"></i> Đặt lại
      </button>

      <button class="btn btn-primary btn-add-new" @click="emitAdd">
        <i class="bi bi-plus-circle me-2"></i> Thêm mới
      </button>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'; // Cần cài đặt lodash: npm install lodash

export default {
  // Cập nhật emits để bao gồm các bộ lọc mới
  emits: ['search', 'add', 'filter-genre', 'filter-status', 'reset-filters'],
  data() {
    return {
      internalKeyword: '',
      internalFilterGenre: 'all',  // Thể loại mặc định
      internalFilterStatus: 'all', // Trạng thái mặc định
    };
  },
  created() {
    this.onSearchInput = debounce(this.emitSearch, 300);
  },
  methods: {
    emitSearch() {
      this.$emit('search', this.internalKeyword);
    },
    emitFilters() {
      // Gửi cả hai bộ lọc cùng lúc để đảm bảo tính nhất quán
      this.$emit('filter-genre', this.internalFilterGenre);
      this.$emit('filter-status', this.internalFilterStatus);
    },
    emitAdd() {
      this.$emit('add');
    },
    resetFilters() {
      this.internalKeyword = '';
      this.internalFilterGenre = 'all';
      this.internalFilterStatus = 'all';
      this.emitSearch(); // Reset keyword
      this.emitFilters(); // Reset filters
      this.$emit('reset-filters'); // Báo cho component cha biết đã reset
    }
  }
};
</script>

<style scoped>
.entertainment-toolbar-card {
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

.filter-group label {
  font-weight: 500;
  color: #555;
  white-space: nowrap;
}

.filter-group .form-select {
  border-radius: 0.5rem;
  height: 45px;
  font-size: 0.95rem;
  border-color: #e0e0e0;
}

.filter-group .form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-add-new {
  background-color: #007bff;
  border-color: #007bff;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}

.btn-add-new:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .entertainment-toolbar-card .card-body {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input-group {
    max-width: 100%;
    margin-right: 0 !important;
    margin-bottom: 1rem !important;
  }

  .filter-group {
    width: 100%;
    margin-left: 0 !important;
    margin-bottom: 1rem;
    justify-content: space-between; /* Spread out filters */
  }

  .filter-group > div {
    flex-grow: 1; /* Allow filter dropdowns to expand */
  }

  .filter-group select {
    width: 100%;
  }

  .btn-outline-secondary,
  .btn-add-new {
    width: 100%;
    margin-right: 0 !important;
    margin-bottom: 1rem !important;
  }
}

@media (max-width: 576px) {
  .filter-group {
    flex-direction: column;
  }
}
</style>