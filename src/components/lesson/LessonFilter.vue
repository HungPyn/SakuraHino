<template>
  <div class="card mb-4 shadow-sm">
    <div class="card-body">
      <div class="row g-3 align-items-center">
        <div class="col-md-4">
          <input
            type="text"
            class="form-control"
            placeholder="Tìm kiếm theo tên/chủ đề bài học..."
            :value="searchText"
            @input="$emit('update:searchText', $event.target.value)"
          />
        </div>

        <div class="col-md-3">
          <select
            class="form-select"
            :value="filterLevel"
            @change="$emit('update:filterLevel', $event.target.value)"
          >
            <option value="">Tất cả Cấp độ</option>
            <option v-for="level in availableLevels" :key="level" :value="level">{{ level }}</option>
          </select>
        </div>

        <div class="col-md-3">
          <select
            class="form-select"
            :value="filterStatus"
            @change="$emit('update:filterStatus', $event.target.value)"
          >
            <option value="">Tất cả Trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="published">Đã xuất bản</option>
          </select>
        </div>

        <div class="col-md-2">
          <button class="btn btn-outline-secondary w-100" @click="$emit('reset-filters')">
            <i class="bi bi-x-circle me-2"></i>Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  searchText: String,
  filterLevel: String,
  filterStatus: String,
  availableLevels: {
    type: Array,
    default: () => [] // Nên là rỗng nếu muốn cha truyền vào
  }
});

defineEmits(['update:searchText', 'update:filterLevel', 'update:filterStatus', 'reset-filters']);
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.75rem;
}
</style>