<template>
  <div class="entertainment-table-container">
    <table class="table custom-table">
      <thead class="custom-thead">
        <tr>
          <th>Tên truyện</th>
          <th>Số chương</th>
          <th>Chủ đề</th>
          <th>Nội dung</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="story in stories" :key="story.id" class="custom-row">
          <td>{{ story.title }}</td>
          <td>{{ story.chapterCount }}</td>
          <td>{{ story.topic }}</td>
          <td>
            <div class="story-content-preview">{{ story.content }}</div>
          </td>
          <td class="text-center actions-column">
            <button class="btn btn-sm btn-edit me-2" @click="$emit('edit', story)">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-delete" @click="$emit('delete', story.id)">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
        <tr v-if="stories.length === 0">
          <td colspan="5" class="text-center no-data-row">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['stories'],
  emits: ['edit', 'delete'] // Khai báo các emits để dễ quản lý
};
</script>

<style scoped>
.entertainment-table-container {
  overflow-x: auto; /* Cho phép cuộn ngang trên màn hình nhỏ */
  margin-top: 1.5rem; /* Khoảng cách với toolbar */
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Đổ bóng nhẹ cho toàn bộ bảng */
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
  background-color: #eef2f7; /* Màu nền nhẹ nhàng cho header */
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

/* Rounded corners for thead */
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
  background-color: #f8fafd; /* Sọc ngựa cho các hàng chẵn */
}

.custom-table tbody tr:hover {
  background-color: #e9f2ff; /* Màu khi hover */
}

.custom-table td {
  padding: 1rem 1.25rem;
  vertical-align: middle;
  border-top: 1px solid #e9ecef;
  color: #495057;
  font-size: 0.9rem;
}

/* No border on the first cell of each row for a cleaner look */
.custom-table tbody tr td:first-child {
  border-left: none;
}
.custom-table tbody tr td:last-child {
  border-right: none;
}


/* Content preview for long text */
.story-content-preview {
  max-height: 80px; /* Tăng chiều cao để hiển thị nhiều hơn */
  overflow: hidden;
  text-overflow: ellipsis; /* Thêm dấu ba chấm nếu nội dung quá dài */
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Giới hạn 3 dòng */
  -webkit-box-orient: vertical;
  line-height: 1.4; /* Khoảng cách dòng */
  font-size: 0.85rem;
}

/* Actions column styling */
.actions-column {
  white-space: nowrap; /* Ngăn các nút bị xuống dòng */
  min-width: 120px; /* Đảm bảo đủ rộng cho 2 nút */
}

/* Custom button styles */
.btn-edit,
.btn-delete {
  border-radius: 0.5rem;
  padding: 0.4rem 0.6rem;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Đổ bóng nhẹ cho nút */
}

.btn-edit {
  background-color: #28a745; /* Màu xanh lá cây */
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
  background-color: #dc3545; /* Màu đỏ */
  color: #fff;
  border-color: #dc3545;
}

.btn-delete:hover {
  background-color: #c82333;
  border-color: #bd2130;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.2);
}

/* Icon styling inside buttons */
.btn-edit i,
.btn-delete i {
  font-size: 0.9rem;
}

/* No data row */
.no-data-row {
  padding: 2rem !important;
  color: #6c757d;
  font-style: italic;
  font-size: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .custom-thead th,
  .custom-table td {
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
  }

  .story-content-preview {
    max-height: 60px; /* Giảm chiều cao trên di động */
    -webkit-line-clamp: 2; /* Giới hạn 2 dòng trên di động */
  }

  .btn-edit,
  .btn-delete {
    padding: 0.3rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>