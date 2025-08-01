<template>
  <div class="table-responsive badge-table-container">
    <table class="table custom-table">
      <thead class="custom-table-header">
        <tr>
          <th>Tên huy hiệu</th>
          <th>Mô tả</th>
          <th>Icon</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="badge in badges" :key="badge.id" class="table-row-hover">
          <td>
            <div class="d-flex align-items-center">
              <i
                :class="['bi', badge.icon || 'bi-question-circle']"
                :style="{
                  color: badge.color || '#6c757d',
                  fontSize: '1.25rem',
                }"
                class="me-2"
              ></i>
              <span>{{ badge.name }}</span>
            </div>
          </td>
          <td>{{ badge.description }}</td>
          <td>
            <div class="d-flex align-items-center">
              <i
                :class="['bi', badge.icon || 'bi-question-circle']"
                :style="{ color: badge.color || '#6c757d', fontSize: '1.5rem' }"
                class="me-2"
              ></i>
              <span class="text-muted small">{{ badge.icon || "N/A" }}</span>
            </div>
          </td>

          <td class="action-cell text-center">
            <div class="btn-group action-buttons" role="group">
              <button
                class="btn btn-sm btn-icon-only btn-outline-info"
                title="Chi tiết"
                @click="$emit('view', badge)"
              >
                <i class="bi bi-eye"></i>
              </button>
              <button
                class="btn btn-sm btn-icon-only btn-outline-warning"
                title="Chỉnh sửa"
                @click="$emit('edit', badge)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-sm btn-icon-only btn-outline-danger"
                title="Xóa"
                @click="$emit('delete', badge.id)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="badges.length === 0">
          <td colspan="5" class="text-center text-muted py-4">
            <div
              class="d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="bi bi-award-fill display-4 text-secondary mb-3"></i>
              <p class="h5 text-secondary">Chưa có huy hiệu nào được tạo.</p>
              <p class="text-muted">
                Hãy thêm huy hiệu đầu tiên của bạn để bắt đầu!
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    badges: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["edit", "delete", "view"], // Explicitly declare emitted events
};
</script>

<style scoped>
/* Container for the table, matching the card style */
.badge-table-container {
  border-radius: 0.75rem;
  overflow: hidden; /* Ensures rounded corners are visible */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Soft shadow */
  background-color: #ffffff;
}

/* Custom Table Styling */
.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.8rem;
}

.custom-table th {
  background-color: #e9ecef;
  color: #495057;
  font-weight: 600;
  padding: 1rem 1.25rem;
  border-bottom: none;
  text-align: left;
}

/* Table Header */
.custom-table-header {
  background-color: #f2f5f9; /* Light grey background */
  border-bottom: 2px solid #e0e6ed; /* Subtle separator */
}

.custom-table-header th {
  padding: 1rem 1.2rem;
  font-weight: 600; /* Bolder font */
  color: #34495e; /* Darker text color */
  text-align: left;
  vertical-align: middle;
}

/* Table Body Rows */
.custom-table tbody tr {
  border-bottom: 1px solid #eee; /* Light border between rows */
  transition: background-color 0.2s ease; /* Smooth hover effect */
}

.custom-table tbody tr:last-child {
  border-bottom: none; /* No border for the last row */
}

.custom-table tbody tr.table-row-hover:hover {
  background-color: #f9fcff; /* Very light blue on hover */
  cursor: pointer;
}

.custom-table tbody td {
  padding: 1rem 1.2rem;
  vertical-align: middle;
  color: #495057; /* Standard text color */
}

/* Icon and color display in table */
.color-display-wrapper {
  display: flex;
  align-items: center;
}

.color-box {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  margin-right: 8px;
  flex-shrink: 0; /* Prevent shrinking */
}

.color-value {
  white-space: nowrap; /* Prevent color hex code from wrapping */
}

/* Action Buttons (similar to LearningTable) */
.action-cell {
  min-width: 120px; /* Ensure enough space for buttons */
}

.action-buttons .btn {
  border-radius: 0.375rem; /* Slightly rounded buttons */
  padding: 0.5rem 0.6rem; /* Adjust padding */
  margin: 0 0.15rem; /* Small space between buttons */
  font-size: 0.9rem;
  display: flex; /* Flex to center icon */
  align-items: center;
  justify-content: center;
}

.action-buttons .btn i {
  font-size: 1rem; /* Icon size */
}

.btn-icon-only {
  width: 36px; /* Fixed width for square buttons */
  height: 36px; /* Fixed height for square buttons */
}

/* Responsive Adjustments (copy from LearningTable for consistency) */
@media (max-width: 991.98px) {
  .custom-table tbody td,
  .custom-table-header th {
    padding: 0.8rem 1rem;
  }
  .action-cell {
    min-width: 100px;
  }
  .action-buttons .btn {
    padding: 0.4rem 0.5rem;
    font-size: 0.85rem;
  }
  .btn-icon-only {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 767.98px) {
  .table-responsive {
    border-radius: 0;
    box-shadow: none;
  }
  .custom-table {
    font-size: 0.85rem;
  }
  .custom-table tbody td,
  .custom-table-header th {
    padding: 0.6rem 0.8rem;
  }
  .action-cell {
    min-width: 80px;
  }
  .btn-icon-only {
    width: 28px;
    height: 28px;
    margin: 0 0.1rem;
  }
}
</style>
