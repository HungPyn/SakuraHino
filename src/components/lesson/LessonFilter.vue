<template>
  <div class="card mb-4 shadow-sm">
    <div class="card-body">
      <div class="row g-3 align-items-center">
        <div class="col-md-3">
          <input
            type="text"
            class="form-control"
            placeholder="Tìm kiếm theo tên/mô tả bài học..."
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
            :value="filterTopicId"
            @change="$emit('update:filterTopicId', $event.target.value)"
          >
            <option value="">Tất cả Chủ đề</option>
            <option v-for="topic in availableTopics" :key="topic.id" :value="topic.id">{{ topic.name }}</option>
          </select>
        </div>

        <div class="col-md-3">
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
  filterTopicId: [String, Number],
  availableLevels: {
    type: Array,
    default: () => []
  },
  availableTopics: {
    type: Array,
    default: () => []
  }
});

defineEmits(['update:searchText', 'update:filterLevel', 'update:filterTopicId', 'reset-filters']);
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.75rem;
}
</style>