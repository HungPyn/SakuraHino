<template>
  <div class="suspicious-users-table-container">
    <table class="table custom-table">
      <thead class="custom-thead">
        <tr>
          <th>ID</th>
          <th>Tên thành viên</th>
          <th>Email</th>
          <th>IP đăng ký</th>
          <th>Lý do nghi ngờ</th>
          <th>Ngày phát hiện</th>
          <th>Trạng thái</th>
          <th>Hoạt động gần nhất</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="custom-row">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.registeredIp }}</td>
          <td>{{ user.detectionReason }}</td>
          <td>{{ user.detectionDate }}</td>
          <td>
            <span :class="['badge', getStatusBadgeClass(user.status)]">{{ getStatusText(user.status) }}</span>
          </td>
          <td>{{ user.lastLogin }}</td>
          <td class="text-center actions-column">
            <button class="btn btn-sm btn-info me-2" @click="$emit('viewDetails', user)">
              <i class="bi bi-eye"></i> Xem
            </button>
            <button v-if="user.status === 'investigating'" class="btn btn-sm btn-success me-2" @click="$emit('clear', user.id)">
              <i class="bi bi-person-check"></i> Xóa nghi ngờ
            </button>
            <button v-if="user.status === 'investigating'" class="btn btn-sm btn-danger" @click="$emit('ban', user.id)">
              <i class="bi bi-person-x"></i> Cấm
            </button>
            <button v-if="user.status !== 'investigating'" class="btn btn-sm btn-secondary" @click="$emit('reset', user.id)">
              <i class="bi bi-arrow-counterclockwise"></i> Đặt lại
            </button>
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="9" class="text-center no-data-row">Không có người dùng nghi ngờ nào</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['users'],
  emits: ['viewDetails', 'clear', 'ban', 'reset'],
  methods: {
    getStatusBadgeClass(status) {
      switch (status) {
        case 'investigating': return 'bg-warning text-dark';
        case 'banned': return 'bg-danger';
        case 'cleared': return 'bg-success';
        default: return 'bg-secondary';
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'investigating': return 'Đang điều tra';
        case 'banned': return 'Đã bị cấm';
        case 'cleared': return 'Đã xác minh';
        default: return 'Không xác định';
      }
    }
  }
};
</script>

<style scoped>
/* Reusing most styles from other tables */

.suspicious-users-table-container {
  overflow-x: auto;
  margin-top: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.custom-table {
  width: 100%;
  margin-bottom: 0;
  border-collapse: separate;
  border-spacing: 0;
}

.custom-thead {
  background-color: #eef2f7;
}

.custom-thead th {
  padding: 1rem 1.25rem;
  font-weight: 600;
  color: #344767;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
  font-size: 0.95rem;
}

.custom-thead tr:first-child th:first-child {
  border-top-left-radius: 0.75rem;
}

.custom-thead tr:first-child th:last-child {
  border-top-right-radius: 0.75rem;
}

.custom-table tbody tr {
  transition: background-color 0.2s ease;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #f8fafd;
}

.custom-table tbody tr:hover {
  background-color: #e9f2ff;
}

.custom-table td {
  padding: 1rem 1.25rem;
  vertical-align: middle;
  border-top: 1px solid #e9ecef;
  color: #495057;
  font-size: 0.9rem;
}

.custom-table tbody tr td:first-child {
  border-left: none;
}
.custom-table tbody tr td:last-child {
  border-right: none;
}

.actions-column {
  white-space: nowrap;
  min-width: 250px; /* Đảm bảo đủ rộng cho nhiều nút */
}

/* Custom button styles */
.btn-info { /* View button */
  background-color: #17a2b8;
  border-color: #17a2b8;
  color: #fff;
}
.btn-info:hover {
  background-color: #138496;
  border-color: #117a8b;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(23, 162, 184, 0.2);
}

.btn-success { /* Clear button */
  background-color: #28a745;
  border-color: #28a745;
  color: #fff;
}
.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.2);
}

.btn-danger { /* Ban button */
  background-color: #dc3545;
  border-color: #dc3545;
  color: #fff;
}
.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.2);
}

.btn-secondary { /* Reset button */
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
}
.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(108, 117, 125, 0.2);
}

.btn-sm {
  border-radius: 0.5rem;
  padding: 0.4rem 0.6rem;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.btn-sm i {
  font-size: 0.9rem;
  margin-right: 0.25rem;
}

/* Common badge styles */
.badge {
  padding: 0.4em 0.7em;
  border-radius: 0.35rem;
  font-size: 0.75em;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  display: inline-block;
}

.badge.bg-warning { background-color: #ffc107 !important; }
.badge.bg-danger { background-color: #dc3545 !important; }
.badge.bg-success { background-color: #28a745 !important; }
.badge.bg-secondary { background-color: #6c757d !important; }
.badge.text-dark { color: #343a40 !important; }


.no-data-row {
  padding: 2rem !important;
  color: #6c757d;
  font-style: italic;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .custom-thead th,
  .custom-table td {
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
  }
  .actions-column {
    min-width: unset;
  }
}
</style>