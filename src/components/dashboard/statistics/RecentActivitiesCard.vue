<template>
  <div class="recent-activities-container">
    <div
      v-for="(activity, index) in activities"
      :key="index"
      class="activity-card"
      :class="'border-' + activity.type"
    >
      <div class="activity-header">
        <v-icon :class="'activity-icon text-' + activity.type" size="20">
          {{ iconMap[activity.type] || 'fa-info-circle' }}
        </v-icon>
        <div class="activity-text">
          <div class="activity-title">{{ activity.title }}</div>
          <div class="activity-time">{{ activity.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activities: {
    type: Array,
    required: true
  }
})

// Map icon theo loại hoạt động
const iconMap = {
  complete: 'fa-check-circle',
  levelup: 'fa-graduation-cap',
  login: 'fa-sign-in-alt',
  practice: 'fa-book',
  start: 'fa-play-circle'
}
</script>

<style scoped>
.recent-activities-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

/* Scrollbar */
.recent-activities-container::-webkit-scrollbar {
  width: 6px;
}
.recent-activities-container::-webkit-scrollbar-thumb {
  background-color: #cfd8dc;
  border-radius: 3px;
}

.activity-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 12px 16px;
  border-left: 4px solid #1976d2;
  transition: background-color 0.2s ease;
}
.activity-card:hover {
  background-color: #f1f1f1;
}

.activity-header {
  display: flex;
  align-items: center;
}

.activity-icon {
  margin-right: 12px;
}

/* Color themes */
.text-complete {
  color: #4caf50;
}
.border-complete {
  border-left-color: #4caf50;
}
.text-levelup {
  color: #3f51b5;
}
.border-levelup {
  border-left-color: #3f51b5;
}
.text-login {
  color: #00acc1;
}
.border-login {
  border-left-color: #00acc1;
}
.text-practice {
  color: #ff9800;
}
.border-practice {
  border-left-color: #ff9800;
}
.text-start {
  color: #9c27b0;
}
.border-start {
  border-left-color: #9c27b0;
}

.activity-title {
  font-weight: 600;
  font-size: 15px;
  color: #333;
}

.activity-time {
  font-size: 13px;
  color: #888;
  margin-top: 2px;
}
</style>
