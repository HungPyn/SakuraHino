<template>
  <v-row v-if="tests.length > 0">
    <v-col
      v-for="test in tests"
      :key="test.id"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <v-card class="jlpt-test-card" elevation="2" rounded="lg">
        <v-card-text class="d-flex flex-column pa-4">
          <div class="d-flex justify-space-between align-start mb-2">
            <div class="d-flex flex-column flex-grow-1 mr-2">
              <h3 class="text-subtitle-1 font-weight-bold text-dark-emphasis mb-1">{{ test.title }}</h3>
              <v-chip
                size="x-small"
                class="font-weight-medium mb-1"
                :color="getLevelColor(test.level)"
              >
                Cấp độ {{ test.level }}
              </v-chip>
              <span class="text-caption text-medium-emphasis">Loại: {{ test.type === 'real' ? 'Đề thi thật' : 'Đề thi thử' }}</span>
              <span class="text-caption text-medium-emphasis">Năm: {{ test.year }}</span>
            </div>
            <div class="d-flex flex-column flex-shrink-0">
              <v-btn
                icon
                size="small"
                variant="text"
                color="blue-lighten-1"
                @click.stop="$emit('edit', test)"
                class="action-btn"
              >
                <span class="action-emoji">✏️</span>
                <v-tooltip activator="parent" location="top">Chỉnh sửa</v-tooltip>
              </v-btn>
              <v-btn
                icon
                size="small"
                variant="text"
                color="red-lighten-1"
                @click.stop="$emit('delete', test.id, test.title)"
                class="action-btn"
              >
                <span class="action-emoji">🗑️</span>
                <v-tooltip activator="parent" location="top">Xóa</v-tooltip>
              </v-btn>
            </div>
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="d-flex justify-space-between align-center text-caption text-medium-emphasis">
            <span>Đã chấm: {{ test.scored ? '✅ Có' : '❌ Không' }}</span>
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              class="rounded-pill"
              @click.stop="$emit('configure', test)"
            >
              Cấu hình
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-alert v-else type="info" variant="tonal" class="my-4">
    Không có đề thi nào để hiển thị.
  </v-alert>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  tests: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['edit', 'delete', 'configure']);

const getLevelColor = (level) => {
  switch (level) {
    case 'N5': return 'green-lighten-1';
    case 'N4': return 'light-blue-lighten-1';
    case 'N3': return 'teal-lighten-1';
    case 'N2': return 'orange-lighten-1';
    case 'N1': return 'red-lighten-1';
    default: return 'grey';
  }
};
</script>

<style scoped>
.jlpt-test-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid #e0e0e0;
}
.jlpt-test-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
}

.text-dark-emphasis {
  color: #333333 !important;
}
.text-medium-emphasis {
  color: #606060 !important;
}

.action-btn {
  min-width: 36px !important;
  width: 36px !important;
  height: 36px !important;
  padding: 0 !important;
  box-shadow: none !important;
  transition: all 0.2s ease-in-out;
}
.action-btn:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}
.action-emoji {
  font-size: 1.1rem;
  line-height: 1;
}
</style>
