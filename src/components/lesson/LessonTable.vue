<template>
  <div class="card shadow-sm">
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" @click="$emit('sort', 'id')" class="sortable">ID <i :class="getSortIcon('id')"></i></th>
              <th scope="col" @click="$emit('sort', 'name')" class="sortable">Tên Bài học <i :class="getSortIcon('name')"></i></th>
              <th scope="col" @click="$emit('sort', 'level')" class="sortable">Cấp độ <i :class="getSortIcon('level')"></i></th>
              <th scope="col" @click="$emit('sort', 'topicName')" class="sortable">Chủ đề <i :class="getSortIcon('topicName')"></i></th>
              <th scope="col">Nội dung</th>
              <th scope="col" @click="$emit('sort', 'updatedAt')" class="sortable">Cập nhật <i :class="getSortIcon('updatedAt')"></i></th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="lessons.length === 0">
                <td colspan="8" class="text-center text-muted py-4">Không tìm thấy bài học nào.</td>
            </tr>
            <tr v-for="lesson in lessons" :key="lesson.id">
              <td>{{ lesson.id }}</td>
              <td>{{ lesson.name }}</td>
              <td><span class="badge bg-primary-subtle text-primary">{{ lesson.level }}</span></td>
              <td>{{ lesson.topicName }}</td>
              <td>
                <span class="badge bg-info-subtle text-info me-1" v-if="lesson.hasVocabulary"><i class="bi bi-card-text"></i> Từ vựng</span>
                <span class="badge bg-success-subtle text-success me-1" v-if="lesson.hasGrammar"><i class="bi bi-spellcheck"></i> Ngữ pháp</span>
                <span class="badge bg-warning-subtle text-warning me-1" v-if="lesson.hasListening"><i class="bi bi-headset"></i> Nghe</span>
                <span class="badge bg-danger-subtle text-danger" v-if="lesson.hasExercises"><i class="bi bi-clipboard-check"></i> Bài tập</span>
              </td>
              <td>{{ formatDate(lesson.updatedAt) }}</td>
              <td>
                <span :class="['badge', lesson.status === 'published' ? 'bg-success' : 'bg-secondary']">
                  {{ lesson.status === 'published' ? 'Đã XB' : 'Nháp' }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-info me-2" @click="$emit('edit', lesson.id)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" @click="$emit('delete', lesson.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  lessons: {
    type: Array,
    required: true
  },
  sortByField: {
    type: String,
    required: true
  },
  sortDirection: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete', 'sort']);

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('vi-VN', options);
}

function getSortIcon(field) {
    if (props.sortByField === field) {
        return props.sortDirection === 'asc' ? 'bi bi-sort-up' : 'bi bi-sort-down';
    }
    return 'bi bi-sort-alpha-down';
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.75rem;
}

.table thead th {
  background-color: #e9f0f8;
  color: #333;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.table-hover tbody tr:hover {
  background-color: #f1f7fc;
}

.badge {
  font-size: 0.8em;
  padding: 0.4em 0.7em;
  border-radius: 0.5rem;
  white-space: nowrap;
}

.sortable {
    cursor: pointer;
    user-select: none;
}
.sortable i {
    font-size: 0.8em;
    margin-left: 5px;
}
</style>