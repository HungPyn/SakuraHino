<template>
  <div class="card reminder-toolbar-card mb-4">
    <div class="card-body d-flex align-items-center justify-content-between">
      <div class="search-input-group flex-grow-1 me-3">
        <input
          type="text"
          class="form-control search-input"
          placeholder="Tìm kiếm theo tiêu đề hoặc người dùng..."
          v-model="internalKeyword"
          @input="$emit('search', internalKeyword)"
        />
        <i class="bi bi-search search-icon"></i>
      </div>

      <div class="items-per-page-group">
        <label for="itemsPerPage" class="me-2 text-muted">Mục mỗi trang:</label>
        <select
          id="itemsPerPage"
          v-model="internalItemsPerPage"
          class="form-select form-select-sm"
          @change="$emit('update:itemsPerPage', internalItemsPerPage)"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>

      <button class="btn btn-primary btn-add-new ms-3" @click="$emit('add')">
        <i class="bi bi-plus-circle me-2"></i> Tạo nhắc nhở mới
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: {
    keyword: {
      type: String,
      default: ''
    },
    itemsPerPage: {
      type: Number,
      default: 10
    }
  },
  emits: ['add', 'search', 'update:itemsPerPage'],
  setup(props) {
    const internalKeyword = ref(props.keyword);
    const internalItemsPerPage = ref(props.itemsPerPage);

    watch(() => props.keyword, (newVal) => {
      internalKeyword.value = newVal;
    });

    watch(() => props.itemsPerPage, (newVal) => {
      internalItemsPerPage.value = newVal;
    });

    return {
      internalKeyword,
      internalItemsPerPage,
    };
  },
};
</script>

<style scoped>
/* Toolbar Card (Search Input and Items per page) */
.reminder-toolbar-card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  padding: 0.75rem 1.25rem;
}

.search-input-group {
  position: relative;
  max-width: 400px;
}

.search-input {
  border-radius: 0.5rem;
  padding-left: 2.5rem;
  border: 1px solid #ced4da;
  transition: all 0.2s ease;
  height: 45px;
  font-size: 1rem;
  color: #495057;
}

.search-input:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  outline: none;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
  pointer-events: none;
}

.items-per-page-group {
    display: flex;
    align-items: center;
    margin-left: auto;
}

.items-per-page-group .form-select {
    width: auto;
    min-width: 80px;
    border-radius: 0.5rem;
    height: 45px;
    font-size: 1rem;
    padding-left: 0.75rem;
    padding-right: 2rem;
}

.btn-add-new {
  background-color: #007bff;
  border-color: #007bff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
  white-space: nowrap; /* Prevent wrapping */
}

.btn-add-new:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3);
}

.btn-add-new i {
  font-size: 1.1em;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .reminder-toolbar-card .card-body {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input-group {
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
    margin-right: 0 !important;
  }
  .items-per-page-group {
    width: 100%;
    margin-left: 0;
    justify-content: flex-end;
    margin-bottom: 1rem;
  }
  .items-per-page-group label {
      white-space: nowrap;
  }
  .items-per-page-group .form-select {
      flex-grow: 0;
      max-width: 120px;
  }
  .btn-add-new {
    width: 100%;
  }
}
</style>