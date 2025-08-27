<template>
  <div>
    <h2>Bảng {{ type }}</h2>
    <div class="kana-grid">
      <div v-for="char in chars" :key="char.id" class="kana-item">
        <span class="kana-char">{{ char.char }}</span>
        <span class="kana-romanji">{{ char.romanji }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  chars: Array,
  type: String
});
</script>

<style scoped>
h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
}
.kana-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
}
.kana-item {
  background-color: #f7f9fc;
  border: 1px solid #e0e6ed;
  border-radius: 10px; /* Bo tròn hơn */
  padding: 20px; /* Lớn hơn */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}
.kana-item:hover {
  transform: translateY(-8px) scale(1.05); /* Hiệu ứng nổi bật hơn */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background-color: #eaf3ff; /* Thay đổi màu nền khi hover */
}
.kana-char {
  font-size: 3.5rem; /* To hơn */
  font-weight: 700;
  color: #3498db;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
}
.kana-romanji {
  font-size: 1rem;
  color: #7f8c8d;
  margin-top: 10px;
}
</style>