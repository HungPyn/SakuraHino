<template>
  <div class="table-responsive learning-table-container">
    <table class="table custom-table">
      <thead>
        <tr>
          <th  scope="col">Lộ trình</th>
          <th  scope="col">Học viên đã tiếp cận</th>
          <th  scope="col">Tiến độ</th>
          <th  scope="col">Trạng thái</th>
          <th  scope="col">Thời gian</th>
          <th  scope="col">Hoạt động gần nhất</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id" class="table-row-hover">
          <td>
            <div class="d-flex align-items-center">
              <i class="bi bi-journal-bookmark-fill fs-5 me-2 text-info"></i>
              <span>{{ item.pathName }}</span>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center">
              <i class="bi bi-people-fill fs-5 me-2 text-primary"></i> <span>{{ item.accessCount }}</span>
            </div>
          </td>
          <td>
            <div class="progress-cell">
              <div class="progress custom-progress">
                <div
                  class="progress-bar"
                  :class="{
                    'bg-success': item.progressPercent === 100,
                    'bg-primary': item.progressPercent > 50 && item.progressPercent < 100,
                    'bg-warning': item.progressPercent <= 50 && item.progressPercent > 0,
                    'bg-secondary': item.progressPercent === 0
                  }"
                  role="progressbar"
                  :style="{ width: item.progressPercent + '%' }"
                  :aria-valuenow="item.progressPercent"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <small class="progress-text">{{ item.progressText }} ({{ item.progressPercent }}%)</small>
            </div>
          </td>
          <td>
            <span
              :class="['badge status-badge', {
                'bg-success-subtle text-success': item.status === 'Hoàn thành',
                'bg-primary-subtle text-primary': item.status === 'Đang học',
                'bg-warning-subtle text-warning': item.status === 'Tạm dừng'
              }]"
            >
              {{ item.status }}
            </span>
          </td>
          <td>
            <div class="d-flex align-items-center">
              <i class="bi bi-clock me-1 text-muted"></i>
              <span>{{ item.duration }}</span>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center">
              <i class="bi bi-calendar-event me-1 text-muted"></i>
              <span>{{ item.lastActive }}</span>
            </div>
          </td>
          <td class="action-cell text-center">
            <div class="btn-group action-buttons" role="group">
              <button
                class="btn btn-sm btn-icon-only btn-outline-info"
                title="Chi tiết"
                @click="$emit('detail', item)"
              >
                <i class="bi bi-eye"></i>
              </button>
              <button
                class="btn btn-sm btn-icon-only btn-outline-warning"
                title="Chỉnh sửa"
                @click="$emit('edit', item)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-sm btn-icon-only btn-outline-danger"
                title="Xóa"
                @click="$emit('delete', item)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td colspan="7" class="text-center text-muted py-4">Không có lộ trình nào để hiển thị.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: Array
  },
  emits: ['detail', 'edit', 'delete']
};
</script>

<style scoped>
/* Giữ nguyên style LearningTable */
.learning-table-container {
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

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


.custom-table-header {
  /* Đã thay đổi màu nền thành màu xám nhạt */
  background-color: #e9eef2; /* Màu xám nhạt */
  border-bottom: 2px solid #d4dae0; /* Đường viền dưới cũng thay đổi cho phù hợp */
}

.custom-table-header th {
  padding: 1rem 1.2rem;
  font-weight: 600;
  color: #5a6268; /* Màu chữ đã được điều chỉnh để dễ đọc trên nền xám */
  text-align: left;
  vertical-align: middle;
}

.custom-table tbody tr {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.custom-table tbody tr:last-child {
  border-bottom: none;
}

.custom-table tbody tr.table-row-hover:hover {
  background-color: #f9fcff;
  cursor: pointer;
}

.custom-table tbody td {
  padding: 1rem 1.2rem;
  vertical-align: middle;
  color: #495057;
}

.progress-cell {
  min-width: 120px;
}

.custom-progress {
  height: 8px;
  border-radius: 5px;
  background-color: #e9ecef;
  margin-bottom: 0.3rem;
}

.progress-bar {
  border-radius: 5px;
  transition: width 0.6s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: #6c757d;
  display: block;
  text-align: right;
  margin-top: 0.2rem;
}

.status-badge {
  padding: 0.4em 0.7em;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.85em;
  white-space: nowrap;
}

.bg-success-subtle { background-color: var(--bs-success-bg-subtle, #d1e7dd); }
.text-success { color: var(--bs-success-text-emphasis, #0f5132); }

.bg-primary-subtle { background-color: var(--bs-primary-bg-subtle, #cfe2ff); }
.text-primary { color: var(--bs-primary-text-emphasis, #052c65); }

.bg-warning-subtle { background-color: var(--bs-warning-bg-subtle, #fff3cd); }
.text-warning { color: var(--bs-warning-text-emphasis, #664d03); }

.action-cell {
  min-width: 120px;
}

.action-buttons .btn {
  border-radius: 0.375rem;
  padding: 0.5rem 0.6rem;
  margin: 0 0.15rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-buttons .btn i {
  font-size: 1rem;
}

.btn-icon-only {
  width: 36px;
  height: 36px;
}

@media (max-width: 991.98px) {
  .custom-table tbody td,
  .custom-table-header th {
    padding: 0.8rem 1rem;
  }
  .progress-cell {
    min-width: 100px;
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
  .stat-icon {
    font-size: 1.5rem !important;
  }
  .progress-text {
    font-size: 0.75rem;
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