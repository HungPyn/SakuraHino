<template>
  <div class="badge-filter-container d-flex flex-wrap align-items-center justify-content-end gap-3 flex-grow-1">
    <!-- Filter by Type -->
    <div class="filter-group">
      <label for="filterType" class="form-label mb-0 me-2 text-muted">Loại huy hiệu:</label>
      <select id="filterType" class="form-select form-select-sm" :value="filterType" @change="$emit('update:filterType', $event.target.value)">
        <option value="">Tất cả</option>
        <option value="level">Cấp độ</option>
        <option value="event">Sự kiện</option>
        <option value="streak">Chuỗi</option>
        <option value="achievement">Thành tích</option>
        <!-- Thêm các loại huy hiệu khác nếu có -->
      </select>
    </div>

    <!-- Filter by Status -->
    <div class="filter-group">
      <label for="filterStatus" class="form-label mb-0 me-2 text-muted">Trạng thái:</label>
      <select id="filterStatus" class="form-select form-select-sm" :value="filterStatus" @change="$emit('update:filterStatus', $event.target.value)">
        <option value="">Tất cả</option>
        <option value="active">Hoạt động</option>
        <option value="inactive">Không hoạt động</option>
      </select>
    </div>

    <!-- Filter by Date Range -->
    <div class="filter-group">
      <label for="filterDateRange" class="form-label mb-0 me-2 text-muted">Thời gian tạo:</label>
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
    filterType: {
      type: String,
      default: ''
    },
    filterStatus: {
      type: String,
      default: ''
    },
    filterDateRange: {
      type: String,
      default: ''
    }
  },
  emits: ['update:filterType', 'update:filterStatus', 'update:filterDateRange', 'reset-filters']
}
</script>

<style scoped>
.badge-filter-container {
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
  .badge-filter-container {
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