<template>
  <div class="violated-posts-table-container">
    <table class="table custom-table">
      <thead class="custom-thead">
        <tr>
          <th>ID Bài viết</th>
          <th>Tiêu đề</th>
          <th>Tác giả</th>
          <th>Ngày báo cáo</th>
          <th>Lý do</th>
          <th>Nội dung vi phạm</th>
          <th>Trạng thái</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.id" class="custom-row">
          <td>{{ post.id }}</td>
          <td>{{ post.title }}</td>
          <td>{{ post.author }} <span v-if="post.authorId"> (ID: {{ post.authorId }})</span></td>
          <td>{{ post.reportDate }}</td>
          <td>{{ post.reason }}</td>
          <td>
            <div class="post-content-preview">{{ post.content }}</div>
          </td>
          <td>
            <span :class="['badge', getStatusBadgeClass(post.status)]">{{ getStatusText(post.status) }}</span>
          </td>
          <td class="text-center actions-column">
            <button class="btn btn-sm btn-info me-2" @click="$emit('viewDetails', post)">
              <i class="bi bi-eye"></i> Xem
            </button>
            <button v-if="post.status === 'pending_review'" class="btn btn-sm btn-success me-2" @click="$emit('resolve', post.id)">
              <i class="bi bi-check-circle"></i> Giải quyết
            </button>
            <button v-if="post.status === 'pending_review'" class="btn btn-sm btn-warning text-dark me-2" @click="$emit('reject', post.id)">
              <i class="bi bi-x-circle"></i> Bác bỏ
            </button>
            <button class="btn btn-sm btn-delete" @click="$emit('delete', post.id)">
              <i class="bi bi-trash"></i> Xóa
            </button>
          </td>
        </tr>
        <tr v-if="posts.length === 0">
          <td colspan="8" class="text-center no-data-row">Không có bài viết vi phạm nào</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['posts'],
  emits: ['viewDetails', 'resolve', 'reject', 'delete'],
  methods: {
    getStatusBadgeClass(status) {
      switch (status) {
        case 'pending_review': return 'bg-warning text-dark';
        case 'rejected': return 'bg-danger';
        case 'resolved': return 'bg-success';
        default: return 'bg-secondary';
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'pending_review': return 'Chờ duyệt';
        case 'rejected': return 'Bị bác bỏ';
        case 'resolved': return 'Đã giải quyết';
        default: return 'Không xác định';
      }
    }
  }
};
</script>

<style scoped>
/* Reusing most styles from CommunityTable.vue and EntertainmentTable.vue */
.violated-posts-table-container {
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

.post-content-preview {
  max-height: 60px; /* Nhỏ hơn để dễ xem tổng quan */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Giới hạn 2 dòng */
  -webkit-box-orient: vertical;
  line-height: 1.4;
  font-size: 0.85rem;
}

.actions-column {
  white-space: nowrap;
  min-width: 250px; /* Đảm bảo đủ rộng cho nhiều nút */
}

/* Custom button styles - extending existing patterns */
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

.btn-success { /* Resolve button */
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

.btn-warning { /* Reject button */
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529; /* Dark text for light background */
}
.btn-warning:hover {
  background-color: #e0a800;
  border-color: #d39e00;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.2);
}

.btn-delete { /* Reusing existing delete style */
  background-color: #dc3545;
  border-color: #dc3545;
  color: #fff;
}
.btn-delete:hover {
  background-color: #c82333;
  border-color: #bd2130;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.2);
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
  margin-right: 0.25rem; /* Khoảng cách giữa icon và text */
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

  .post-content-preview {
    max-height: 40px;
    -webkit-line-clamp: 1;
  }

  .actions-column {
    min-width: unset; /* Allow to shrink on small screens */
  }
}
</style>