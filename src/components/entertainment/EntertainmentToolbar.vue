<template>
  <div class="entertainment-toolbar-container d-flex justify-content-between mb-4 p-3">
    <div class="search-input-wrapper">
      <i class="bi bi-search search-icon"></i>
      <input
        type="text"
        class="form-control custom-search-input"
        placeholder="Tìm theo tên truyện..."
        v-model="keyword"
        @input="$emit('search', keyword)"
      />
    </div>

    <button class="btn btn-primary custom-add-button" @click="$emit('add')">
      <i class="bi bi-plus-circle-fill me-2"></i> Thêm bộ truyện
    </button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  emits: ['search', 'add'], // Khai báo các emits rõ ràng
  setup() {
    const keyword = ref('');

    return {
      keyword,
    };
  },
};
</script>

<style scoped>
.entertainment-toolbar-container {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Đổ bóng nhẹ nhàng */
  padding: 1rem 1.5rem; /* Tăng padding */
  align-items: center; /* Căn giữa theo chiều dọc */
}

.search-input-wrapper {
  position: relative;
  width: 50%; /* Giữ nguyên chiều rộng */
  max-width: 400px; /* Giới hạn chiều rộng tối đa */
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d; /* Màu xám cho icon */
  font-size: 1.1rem;
}

.custom-search-input {
  padding: 0.75rem 1rem 0.75rem 2.8rem; /* Tăng padding trái để chừa chỗ cho icon */
  border-radius: 0.5rem;
  border: 1px solid #ced4da;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  color: #343a40;
}

.custom-search-input::placeholder {
  color: #a0a0a0;
}

.custom-search-input:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  outline: none;
}

.custom-add-button {
  background-color: #007bff; /* Màu xanh dương */
  border-color: #007bff;
  color: #fff;
  padding: 0.75rem 1.5rem; /* Tăng padding */
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  display: flex; /* Dùng flex để căn giữa icon và chữ */
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2); /* Đổ bóng nhẹ */
}

.custom-add-button:hover {
  background-color: #0056b3;
  border-color: #004085;
  transform: translateY(-2px); /* Hiệu ứng nhấc lên */
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3); /* Đổ bóng mạnh hơn khi hover */
}

.custom-add-button i {
  font-size: 1.2rem; /* Kích thước icon lớn hơn */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .entertainment-toolbar-container {
    flex-direction: column; /* Xếp chồng các phần tử trên màn hình nhỏ */
    align-items: stretch; /* Kéo dài các phần tử */
    padding: 1rem;
  }

  .search-input-wrapper {
    width: 100%; /* Chiếm toàn bộ chiều rộng */
    max-width: none;
    margin-bottom: 1rem; /* Khoảng cách giữa input và button */
  }

  .custom-search-input {
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    font-size: 0.9rem;
  }

  .search-icon {
    left: 0.8rem;
    font-size: 1rem;
  }

  .custom-add-button {
    width: 100%; /* Chiếm toàn bộ chiều rộng */
    padding: 0.6rem 1rem;
    font-size: 0.95rem;
  }

  .custom-add-button i {
    font-size: 1.1rem;
  }
}
</style>