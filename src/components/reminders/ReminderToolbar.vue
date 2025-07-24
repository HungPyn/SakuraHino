<template>
  <div class="reminder-toolbar-container">
    <h1 class="toolbar-title">
      <i class="bi bi-bell-fill text-danger me-2"></i>Quản lý nhắc nhở
    </h1>
    <button class="btn btn-success toolbar-add-button" @click="$emit('add')">
      <i class="bi bi-plus-circle-fill me-1"></i>Thêm nhắc nhở
    </button>
  </div>
</template>

<script>
export default {
  emits: ['add'] // Khai báo rõ ràng sự kiện 'add' được emit
};
</script>

<style scoped>
.reminder-toolbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem; /* Khoảng cách dưới để tách biệt với nội dung bên dưới */
  padding-bottom: 1rem; /* Padding dưới để tạo đường phân cách */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05); /* Đường phân cách nhẹ */
  background-color: #f8fafd; /* Nền nhẹ nhàng cho phần toolbar */
  padding-top: 0.5rem;
  padding-left: 0.5rem; /* Để phù hợp với padding của container chính nếu có */
  padding-right: 0.5rem;
}

.toolbar-title {
  font-size: 1.75rem; /* Kích thước tiêu đề lớn hơn một chút */
  font-weight: 700; /* Đậm hơn */
  color: #2c3e50; /* Màu chữ đậm */
  margin-bottom: 0; /* Loại bỏ margin-bottom mặc định của h4 */
  display: flex; /* Dùng flex để căn chỉnh icon và text */
  align-items: center;
}

.toolbar-title i {
  font-size: 2rem; /* Kích thước icon lớn hơn */
  color: #dc3545 !important; /* Đảm bảo màu danger của Bootstrap */
}

.toolbar-add-button {
  padding: 0.75rem 1.25rem; /* Padding lớn hơn cho nút */
  font-size: 1rem; /* Kích thước chữ chuẩn */
  font-weight: 600; /* Đậm */
  border-radius: 0.5rem; /* Bo tròn vừa phải */
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.2); /* Shadow nhẹ cho nút thành công */
  transition: all 0.2s ease-in-out; /* Hiệu ứng chuyển động mượt mà */
}

.toolbar-add-button:hover {
  transform: translateY(-2px); /* Nâng lên một chút khi hover */
  box-shadow: 0 6px 15px rgba(40, 167, 69, 0.3); /* Shadow đậm hơn khi hover */
}

.toolbar-add-button i {
  font-size: 1.1rem; /* Kích thước icon trong nút */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .reminder-toolbar-container {
    flex-direction: column; /* Xếp chồng tiêu đề và nút trên màn hình nhỏ */
    align-items: flex-start; /* Căn trái khi xếp chồng */
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
  }

  .toolbar-title {
    font-size: 1.5rem;
    margin-bottom: 1rem; /* Khoảng cách giữa tiêu đề và nút */
  }

  .toolbar-title i {
    font-size: 1.75rem;
  }

  .toolbar-add-button {
    width: 100%; /* Nút full width trên màn hình nhỏ */
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .toolbar-title {
    font-size: 1.25rem;
  }
  .toolbar-title i {
    font-size: 1.5rem;
  }
}
</style>