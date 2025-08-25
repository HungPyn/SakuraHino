<template>
  <div class="detail-container">
    <div class="modal-header">
      <h2 class="modal-title">Chi tiết Kết quả Thi</h2>
      <button @click="$emit('close')" class="close-btn">&times;</button>
    </div>
    <div class="detail-body">
      <div class="info-group">
        <span class="label">Người dùng:</span>
        <span class="value">{{ examResult.userName }}</span>
      </div>
      <div class="info-group">
        <span class="label">Kỳ thi:</span>
        <span class="value">{{ examResult.examName }}</span>
      </div>
      <div class="info-group">
        <span class="label">Chủ đề:</span>
        <span class="value">{{ examResult.topicName }}</span>
      </div>
      <div class="info-group">
        <span class="label">Điểm số:</span>
        <span class="value score-value">{{ examResult.score }}</span>
      </div>
      <div class="info-group">
        <span class="label">Ngày hoàn thành:</span>
        <span class="value">{{ examResult.completionDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  examResult: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.detail-container {
  padding: 0;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e6ed;
  padding-bottom: 15px;
  margin-bottom: 20px;
}
.modal-title {
  font-size: 1.8rem;
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 2.2rem;
  cursor: pointer;
  color: #bdc3c7;
}
.detail-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.info-group {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
}
.label {
  font-weight: 600;
  color: #34495e;
  width: 150px;
}
.value {
  color: #555;
  font-weight: 400;
}
.score-value {
  font-weight: bold;
  color: #3498db;
}
</style>