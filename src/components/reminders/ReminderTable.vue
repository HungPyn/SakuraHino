<template>
  <div class="reminder-table-container">
    <table class="table custom-reminder-table">
      <thead class="custom-reminder-table-header">
        <tr>
          <th>Loại nhắc nhở</th>
          <th>Ngày tạo</th>
          <th>Trạng thái</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in reminders" :key="item.id" class="table-row-hover">
          <td>{{ item.type }}</td>
          <td>{{ item.createdAt }}</td>
          <td>
            <span :class="['status-badge', getStatusClass(item.status)]">{{
              item.status
            }}</span>
          </td>
          <td class="text-center action-buttons-cell">
            <button
              class="btn btn-sm btn-outline-primary btn-icon-only me-1"
              title="Chỉnh sửa"
              @click="$emit('edit', item)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn btn-sm btn-outline-danger btn-icon-only"
              title="Xóa"
              @click="$emit('delete', item.id)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
        <tr v-if="reminders.length === 0">
          <td colspan="5" class="text-center text-muted py-4">
            Không có nhắc nhở nào để hiển thị.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ["reminders"],
  methods: {
    getStatusClass(status) {
      switch (status) {
        case "Đang hoạt động":
          return "bg-primary-subtle text-primary";
        case "Tạm dừng":
          return "bg-danger-subtle text-danger";
        case "Kết thúc":
          return "bg-dark-subtle text-dark";
        case "Đã hoàn thành":
          return "bg-dark-subtle text-purple";
        case "Đang chờ":
          return "bg-dark-subtle text-success";
        default:
          return "bg-light text-muted"; // Fallback
      }
    },
  },
};
</script>

<style scoped>
.reminder-table-container {
  border-radius: 0.75rem; /* Bo góc cho toàn bộ container */
  overflow: hidden; /* Đảm bảo nội dung không tràn ra ngoài góc bo */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Đổ bóng */
  background-color: #ffffff; /* Nền trắng cho bảng */
}
.custom-reminder-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.8rem;
}

.custom-reminder-table th {
  background-color: #e9ecef;
  color: #495057;
  font-weight: 600;
  padding: 1rem 1.25rem;
  border-bottom: none;
  text-align: left;
}

.custom-reminder-table-header {
  background-color: #e9eef2; /* Màu xám nhạt cho header */
  border-bottom: 2px solid #d4dae0; /* Đường viền dưới cho header */
}

.custom-reminder-table-header th {
  padding: 1rem 1.2rem; /* Tăng padding */
  font-weight: 600;
  color: #5a6268; /* Màu chữ tối hơn một chút cho header */
  text-align: left; /* Căn trái mặc định */
  vertical-align: middle;
}

/* Căn giữa cho cột "Hành động" trong header */
.custom-reminder-table-header th.text-center {
  text-align: center !important;
}

.custom-reminder-table tbody tr {
  border-bottom: 1px solid #eee; /* Đường viền nhẹ giữa các hàng */
  transition: background-color 0.2s ease; /* Hiệu ứng hover mềm mại */
}

.custom-reminder-table tbody tr:last-child {
  border-bottom: none; /* Bỏ đường viền dưới cùng của hàng cuối cùng */
}

.custom-reminder-table tbody tr.table-row-hover:hover {
  background-color: #f9fcff; /* Màu nền khi hover */
  cursor: pointer; /* Thay đổi con trỏ khi hover */
}

.custom-reminder-table tbody td {
  padding: 1rem 1.2rem; /* Padding cho các cell data */
  vertical-align: middle;
  color: #495057;
}

/* Status Badges */
.status-badge {
  padding: 0.4em 0.7em;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.85em;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Custom Bootstrap-like subtle colors */
.bg-success-subtle {
  background-color: var(--bs-success-bg-subtle, #d1e7dd);
}
.text-success {
  color: var(--bs-success-text-emphasis, #0f5132);
}

.bg-warning-subtle {
  background-color: var(--bs-warning-bg-subtle, #fff3cd);
}
.text-warning {
  color: var(--bs-warning-text-emphasis, #664d03);
}

.bg-secondary-subtle {
  background-color: var(--bs-secondary-bg-subtle, #e2e3e5);
}
.text-secondary {
  color: var(--bs-secondary-text-emphasis, #41464b);
}

/* Action Buttons */
.action-buttons-cell {
  min-width: 100px;
  text-align: center;
}

.btn-icon-only {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 0.375rem;
}

.btn-icon-only i {
  font-size: 1rem;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .custom-reminder-table-header th,
  .custom-reminder-table tbody td {
    padding: 0.8rem 1rem;
  }
  .btn-icon-only {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 767.98px) {
  .reminder-table-container {
    border-radius: 0;
    box-shadow: none;
  }
  .custom-reminder-table {
    font-size: 0.85rem;
  }
  .custom-reminder-table-header th,
  .custom-reminder-table tbody td {
    padding: 0.6rem 0.8rem;
  }
  .status-badge {
    font-size: 0.75em;
    padding: 0.3em 0.6em;
  }
  .btn-icon-only {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
  .btn-icon-only i {
    font-size: 0.9rem;
  }
}
</style>
