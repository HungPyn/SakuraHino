<template>
  <v-card class="mini-stat-card-item rounded-xl elevation-3" :style="{ background: bg }">
    <v-card-text class="d-flex flex-column justify-center align-center pa-4">
      <div v-if="icon || emoji" class="mini-stat-icon-wrapper mb-2">
        <span v-if="emoji" class="mini-stat-emoji">{{ emoji }}</span>
        <i v-else-if="icon" :class="['bi', icon]" class="mini-stat-bootstrap-icon"></i>
      </div>

      <div class="mini-stat-value text-h5 font-weight-bold text-white">{{ value }}</div>
      <div class="mini-stat-label text-subtitle-2 text-white text-center">{{ label }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  icon: {
    type: String, // Bootstrap icon class (e.g., 'bi-person-add')
    default: null
  },
  emoji: {
    type: String, // Emoji character (e.g., '🧑‍🎓')
    default: null
  },
  value: [String, Number],
  label: String,
  bg: String // Background gradient string
});
</script>

<style scoped>
.mini-stat-card-item {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white; /* Đảm bảo chữ màu trắng trên nền màu */
  min-height: 120px; /* Duy trì chiều cao */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); /* Bóng rõ hơn */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.mini-stat-card-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.mini-stat-card-item .v-card-text {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1; /* Đảm bảo nội dung nằm trên lớp mờ */
}

/* Lớp mờ ở góc trên bên trái (hiệu ứng như trong ảnh) */
.mini-stat-card-item::before {
  content: '';
  position: absolute;
  top: -20%;
  left: -20%;
  width: 80%;
  height: 80%;
  background: rgba(255, 255, 255, 0.15); /* Màu trắng trong suốt */
  border-radius: 50%; /* Hình tròn */
  filter: blur(10px); /* Làm mờ */
  transform: translate(-50%, -50%);
  z-index: 0;
}

.mini-stat-icon-wrapper {
  background: rgba(255, 255, 255, 0.2); /* Nền mờ cho icon */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-stat-emoji {
  font-size: 28px;
  line-height: 1;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
}

.mini-stat-bootstrap-icon {
  font-size: 28px;
  color: white;
  line-height: 1;
}

.mini-stat-value {
  font-size: 2.2rem !important; /* Giá trị lớn hơn */
  line-height: 1.2;
}

.mini-stat-label {
  font-size: 0.9rem !important;
  opacity: 0.9;
}
</style>