<template>
  <div class="learning-path-filter-container d-flex flex-wrap align-items-center justify-content-end gap-3 flex-grow-1">
    <div class="filter-group">
      <label for="filterStatus" class="form-label mb-0 me-2 text-muted">Trạng thái:</label>
      <select id="filterStatus" class="form-select form-select-sm" :value="filterStatus" @change="$emit('update:filterStatus', $event.target.value)">
        <option value="">Tất cả</option>
        <option value="active">Đang hoạt động</option>
        <option value="completed">Đã hoàn thành</option>
        <option value="inactive">Không hoạt động</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="filterProgress" class="form-label mb-0 me-2 text-muted">Tiến độ:</label>
      <select id="filterProgress" class="form-select form-select-sm" :value="filterProgress" @change="$emit('update:filterProgress', $event.target.value)">
        <option value="">Tất cả</option>
        <option value="lt50">Dưới 50%</option>
        <option value="50to75">50% - 75%</option>
        <option value="gt75">Trên 75% (chưa hoàn thành)</option>
        <option value="completed">Đã hoàn thành (100%)</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="filterDateRange" class="form-label mb-0 me-2 text-muted">Thời gian:</label>
      <select id="filterDateRange" class="form-select form-select-sm" :value="filterDateRange" @change="$emit('update:filterDateRange', $event.target.value)">
        <option value="">Tất cả</option>
        <option value="7days">7 ngày qua</option>
        <option value="30days">30 ngày qua</option>
        <option value="90days">90 ngày qua</option>
      </select>
    </div>

    <button class="btn btn-outline-secondary btn-sm" @click="$emit('reset-filters')">
      <i class="bi bi-arrow-counterclockwise"></i> Đặt lại
    </button>
  </div>
</template>

<script>
export default {
  props: {
    filterStatus: {
      type: String,
      default: ''
    },
    filterProgress: {
      type: String,
      default: ''
    },
    filterDateRange: {
      type: String,
      default: ''
    }
  },
  emits: ['update:filterStatus', 'update:filterProgress', 'update:filterDateRange', 'reset-filters']
}
</script>

<style scoped>
.learning-path-filter-container {
  /* Adjust as needed for layout */
  flex-grow: 1; /* Allow it to take available space */
  justify-content: flex-end; /* Align filters to the right */
}

.filter-group {
  display: flex;
  align-items: center;
  white-space: nowrap; /* Prevent label/select from wrapping */
}

.form-label {
  font-size: 0.9rem;
}

.form-select-sm {
  height: 40px; /* Adjust height to match other inputs if needed */
  min-width: 120px; /* Ensure select boxes are wide enough */
  border-radius: 0.5rem;
  font-size: 0.9rem;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem; /* Default padding for select-sm */
}

.btn-outline-secondary {
  border-radius: 0.5rem;
  height: 40px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .learning-path-filter-container {
    justify-content: flex-start; /* Stack filters on smaller screens */
    width: 100%; /* Take full width */
    margin-top: 1rem; /* Add some space from search bar */
  }
  .filter-group {
    width: 100%; /* Each filter group takes full width */
    margin-bottom: 0.5rem; /* Space between filter groups */
  }
  .form-select-sm {
    width: 100%; /* Make select boxes take full width of their group */
    min-width: unset; /* Remove min-width constraint */
  }
  .btn-outline-secondary {
    width: 100%; /* Make reset button take full width */
  }
}
</style>