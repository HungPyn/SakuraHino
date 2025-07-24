<template>
  <div class="toolbar-container d-flex justify-content-start mb-4 p-3">
    <div class="search-input-wrapper position-relative">
      <i class="bi bi-search search-icon position-absolute"></i>
      <input
        type="text"
        class="form-control custom-search-input"
        placeholder="Tìm kiếm thành viên..."
        v-model="searchKeyword"
        @input="$emit('search', searchKeyword)"
      />
    </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
  emits: ['search'], // Bỏ 'add' emit
  setup() {
    const searchKeyword = ref('');
    return {
      searchKeyword,
    };
  },
};
</script>

<style scoped>
.toolbar-container {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  padding: 1rem 1.5rem;
  align-items: center;
  justify-content: flex-start; /* Căn lề trái */
}

.search-input-wrapper {
  width: 100%;
  max-width: 400px;
}

.search-icon {
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
}

.custom-search-input {
  padding: 0.75rem 1rem 0.75rem 2.8rem;
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

/* Loại bỏ style của nút thêm vì đã bỏ nút */
/* .add-button { ... } */
/* .add-button:hover { ... } */
/* .add-button i { ... } */

@media (max-width: 768px) {
  .toolbar-container {
    flex-direction: column;
    align-items: stretch;
    padding: 0.8rem 1rem;
  }

  .search-input-wrapper {
    max-width: 100%;
    margin-bottom: 0; /* Không cần margin-bottom nếu chỉ có search */
  }

  /* Loại bỏ style của nút thêm ở responsive */
  /* .add-button { ... } */
}
</style>