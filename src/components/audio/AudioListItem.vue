<template>
  <!-- Main card container for each audio item in the list -->
  <v-card
    class="audio-list-item-card"
    :class="{ 'audio-list-item-card-active': isActive }"
    elevation="2"
    rounded="lg"
    @click="emit('select', audio)"
  >
    <v-card-text class="d-flex flex-column pa-4">
      <div class="d-flex justify-space-between align-start mb-2">
        <div class="d-flex flex-column flex-grow-1 mr-2">
          <!-- Title and Play/Active Indicator -->
          <div class="d-flex align-center mb-1">
            <v-icon
              v-if="isActive"
              :color="isPlaying ? 'primary' : 'grey-darken-1'"
              size="small"
              class="mr-2"
            >
              {{ isPlaying ? 'mdi-volume-high' : 'mdi-music-box-multiple' }}
            </v-icon>
            <h3 class="text-subtitle-1 font-weight-bold text-dark-emphasis flex-grow-1">
              {{ audio.title }}
            </h3>
          </div>
          <!-- Level, Author, Duration -->
          <div class="d-flex align-center text-caption text-medium-emphasis">
            <v-chip
              size="x-small"
              class="font-weight-medium mr-2"
              :color="getLevelColor(audio.level)"
            >
              {{ audio.level }}
            </v-chip>
            <span class="mr-2">{{ audio.author }}</span>
            <span>⏱️ {{ audio.duration }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex align-center flex-shrink-0">
          <v-btn
            icon
            size="small"
            variant="text"
            color="blue-lighten-1"
            @click.stop="$emit('edit', audio)"
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
            @click.stop="$emit('delete', audio.id, audio.title)"
            class="action-btn"
          >
            <span class="action-emoji">🗑️</span>
            <v-tooltip activator="parent" location="top">Xóa</v-tooltip>
          </v-btn>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="d-flex justify-space-between align-center text-caption text-medium-emphasis mt-2 pt-2 border-t border-grey-lighten-3">
        <span>👁️ {{ audio.views || '0' }} lượt xem</span>
        <span>📅 {{ formatDate(audio.createdAt) }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  audio: {
    type: Object,
    required: true,
  },
  isActive: { // Prop to indicate if this item is currently selected/active in the main player
    type: Boolean,
    default: false,
  },
  isPlaying: { // Prop to indicate if the currently active audio is playing
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['edit', 'delete', 'select']); // Added 'select' event

// Utility function to get color for level chip
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

// Utility function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};
</script>

<style scoped>
.audio-list-item-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease;
  border: 1px solid #e0e0e0; /* Default border */
  cursor: pointer; /* Indicate clickable */
}

.audio-list-item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
}

.audio-list-item-card-active {
  border: 2px solid #2196F3 !important; /* Primary color border when active */
  box-shadow: 0 4px 10px rgba(33, 150, 243, 0.2) !important; /* Slight shadow to highlight active */
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
  background-color: rgba(var(--v-theme-primary), 0.05); /* Slight background on hover */
}

.action-emoji {
  font-size: 1.1rem; /* Adjust emoji size in buttons */
  line-height: 1;
}
</style>
