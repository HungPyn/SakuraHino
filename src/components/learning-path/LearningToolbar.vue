<template>
  <div class="learning-toolbar-container">
    <div class="search-input-group">
      <input
        class="form-control search-input"
        type="text"
        placeholder="Tìm kiếm theo tên học viên hoặc lộ trình..."
        v-model="keyword"
        @input="$emit('search', keyword)"
      />
      <i class="bi bi-search search-icon"></i>
    </div>
  </div>
</template>

<script>
export default {
  // Không cần props hay emits cho nút 'add' nữa
  emits: ['search'],
  data() {
    return {
      keyword: ''
    };
  }
};
</script>

<style scoped>
.learning-toolbar-container {
  /*
    Nếu component này vẫn được bọc trong một card ở LearningPathView,
    thì không cần padding hay shadow ở đây.
    Chỉ cần đảm bảo flexbox căn chỉnh đúng.
  */
  display: flex;
  justify-content: flex-end; /* Căn phải nếu chỉ có search, hoặc space-between nếu có button */
  align-items: center;
  margin-bottom: 1.5rem; /* Đảm bảo khoảng cách với bảng bên dưới */
}

.search-input-group {
  position: relative;
  width: 100%; /* Chiếm toàn bộ chiều rộng có sẵn */
  max-width: 400px; /* Giới hạn chiều rộng tối đa cho ô tìm kiếm */
}

.search-input {
  border-radius: 0.75rem; /* Bo góc nhiều hơn cho input */
  padding: 0.75rem 1.25rem 0.75rem 2.75rem; /* Top, Right, Bottom, Left (cho icon) */
  border: 1px solid #ced4da; /* Viền nhẹ nhàng */
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Bóng đổ nhẹ */
  height: 48px; /* Chiều cao cố định */
  font-size: 1rem;
  color: #495057;
}

.search-input::placeholder {
  color: #adb5bd; /* Màu placeholder nhạt hơn */
}

.search-input:focus {
  border-color: #80bdff; /* Màu viền xanh khi focus */
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25); /* Shadow nhẹ khi focus */
  outline: none; /* Bỏ outline mặc định */
}

.search-icon {
  position: absolute;
  left: 1rem; /* Vị trí icon */
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d; /* Màu icon */
  font-size: 1.2rem; /* Kích thước icon */
  pointer-events: none; /* Đảm bảo icon không chặn click vào input */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .learning-toolbar-container {
    justify-content: center; /* Căn giữa trên màn hình nhỏ */
    margin-bottom: 1rem;
  }
  .search-input-group {
    max-width: 100%; /* Cho phép chiếm toàn bộ chiều rộng trên mobile */
  }
  .search-input {
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    height: 42px;
    font-size: 0.95rem;
  }
  .search-icon {
    left: 0.8rem;
    font-size: 1.1rem;
  }
}

@media (max-width: 576px) {
  .search-input {
    padding: 0.5rem 0.8rem 0.5rem 2.2rem;
    height: 40px;
    font-size: 0.9rem;
  }
  .search-icon {
    left: 0.7rem;
    font-size: 1rem;
  }
}
</style>