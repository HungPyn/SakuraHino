<template>
  <div class="community-table-container">
    <table class="table custom-table">
      <thead class="custom-thead">
        <tr>
          <th>Tên thành viên</th>
          <th>Email</th>
          <th>Ngày tham gia</th>
          <th>Trình độ</th>
          <th>Tổng số bài viết</th>
          <th>Hoạt động gần nhất</th>
          <th>Trạng thái</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="custom-row">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.joinDate }}</td>
          <td>
            <span :class="['badge', getLevelBadgeClass(user.level)]">{{ user.level }}</span>
          </td>
          <td>{{ user.totalPosts }}</td>
          <td>{{ user.lastActive }}</td>
          <td>
            <span :class="['badge', getStatusBadgeClass(user.status)]">{{ getStatusText(user.status) }}</span>
          </td>
          <td class="text-center actions-column">
            <button class="btn btn-sm btn-edit me-2" @click="$emit('edit', user)">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-delete" @click="$emit('delete', user.id)">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="8" class="text-center no-data-row">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['users'],
  emits: ['edit', 'delete'],
  methods: {
    getLevelBadgeClass(level) {
      switch (level) {
        case 'N5': return 'bg-primary';
        case 'N4': return 'bg-info text-dark';
        case 'N3': return 'bg-success';
        case 'N2': return 'bg-warning text-dark';
        case 'N1': return 'bg-danger';
        default: return 'bg-secondary';
      }
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case 'active': return 'bg-success';
        case 'inactive': return 'bg-warning text-dark';
        case 'pending': return 'bg-info text-dark';
        case 'banned': return 'bg-danger';
        default: return 'bg-secondary';
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'active': return 'Hoạt động';
        case 'inactive': return 'Không hoạt động';
        case 'pending': return 'Chờ duyệt';
        case 'banned': return 'Bị cấm';
        default: return 'Không xác định';
      }
    }
  }
};
</script>

<style scoped>
.community-table-container {
  overflow-x: auto;
  margin-top: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
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
  min-width: 120px;
}

.btn-edit,
.btn-delete {
  border-radius: 0.5rem;
  padding: 0.4rem 0.6rem;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.btn-edit {
  background-color: #28a745;
  color: #fff;
  border-color: #28a745;
}

.btn-edit:hover {
  background-color: #218838;
  border-color: #1e7e34;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.2);
}

.btn-delete {
  background-color: #dc3545;
  color: #fff;
  border-color: #dc3545;
}

.btn-delete:hover {
  background-color: #c82333;
  border-color: #bd2130;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.2);
}

.btn-edit i,
.btn-delete i {
  font-size: 0.9rem;
}

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

.badge.bg-primary { background-color: #007bff !important; }
.badge.bg-info { background-color: #17a2b8 !important; }
.badge.bg-success { background-color: #28a745 !important; }
.badge.bg-warning { background-color: #ffc107 !important; }
.badge.bg-danger { background-color: #dc3545 !important; }
.badge.bg-secondary { background-color: #6c757d !important; }
.badge.text-dark { color: #343a40 !important; } /* For light backgrounds */


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

  .btn-edit,
  .btn-delete {
    padding: 0.3rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>