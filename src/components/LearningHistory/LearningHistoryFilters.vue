<template>
  <div class="filter-container">
    <div class="search-bar">
      <div class="search-input-wrapper">
        <i class="bi bi-search search-icon"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm theo tên người dùng, khóa học..."
          @input="handleSearch"
          class="search-input"
        />
      </div>
      <button @click="toggleAdvancedFilter" class="btn-secondary btn-advanced-filter">
        <i class="bi bi-funnel-fill"></i> Lọc Nâng Cao
      </button>
    </div>

    <div v-if="showAdvancedFilter" class="advanced-filter-modal-overlay" @click.self="toggleAdvancedFilter">
      <div class="advanced-filter-modal-content">
        <div class="modal-header">
          <h3><i class="bi bi-sliders"></i> Bộ lọc nâng cao</h3>
          <button @click="toggleAdvancedFilter" class="close-modal-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="filter-group-modal">
            <label class="filter-label"><i class="bi bi-tags-fill icon"></i> Topic:</label>
            <select v-model="filters.topic" class="form-select">
              <option value="">Tất cả</option>
              <option v-for="t in topics" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="filter-group-modal">
            <label class="filter-label"><i class="bi bi-check-circle-fill icon"></i> Trạng thái:</label>
            <select v-model="filters.status" class="form-select">
              <option value="">Tất cả</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đang học">Đang học</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="applyFilters" class="btn-primary">Áp dụng</button>
          <button @click="resetFilters" class="btn-outline-secondary">Đặt lại</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    topics: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchQuery: '',
      showAdvancedFilter: false,
      filters: {
        topic: '',
        status: '',
      },
    };
  },
  methods: {
    handleSearch() {
      this.$emit('filter-change', { ...this.filters, query: this.searchQuery });
    },
    toggleAdvancedFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter;
    },
    applyFilters() {
      this.$emit('filter-change', { ...this.filters, query: this.searchQuery });
      this.showAdvancedFilter = false;
    },
    resetFilters() {
      this.filters = { topic: '', status: '' };
      this.searchQuery = '';
      this.applyFilters();
    },
  },
};
</script>

<style scoped>
/* Main Filter Container */
.filter-container {
  display: flex;
  flex-direction: column;
}

/* Search Bar */
.search-bar {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input-wrapper {
  position: relative;
  flex-grow: 1;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
}

/* Buttons */
.btn-secondary {
  background-color: #f0f3f6;
  color: #34495e;
  border: 1px solid #bdc3c7;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-secondary:hover {
  background-color: #e0e5ea;
}

.btn-primary {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}
.btn-primary:hover {
  background-color: #27ae60;
}

.btn-outline-secondary {
  background: none;
  color: #7f8c8d;
  border: 1px solid #bdc3c7;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}
.btn-outline-secondary:hover {
  background-color: #f5f7fa;
}

/* Modal for Advanced Filter */
.advanced-filter-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.advanced-filter-modal-content {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 450px;
  animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e6ed;
  padding-bottom: 15px;
  margin-bottom: 20px;
}
.modal-header h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.close-modal-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #bdc3c7;
}

.modal-body .filter-group-modal {
  margin-bottom: 20px;
}

.filter-label {
  display: block;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  color: #34495e;
  background-color: #fcfdfe;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2334495e' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 10px;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>