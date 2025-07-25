<template>
  <v-card class="stat-card rounded-xl elevation-3">
    <v-card-text class="d-flex align-center justify-space-between py-4">
      <div class="stat-content">
        <div class="stat-value font-weight-bold text-h5 mb-1 text-primary">{{ value }}</div>
        <div class="stat-title text-subtitle-2 text-grey-darken-2">{{ title }}</div>
      </div>
      <div class="stat-icon-wrapper" :style="{ backgroundColor: iconBgColor }">
        <span v-if="emoji" class="stat-emoji">{{ emoji }}</span>
        <i v-else :class="['bi', iconClass]" :style="{ color: iconColor }"></i>
      </div>
    </v-card-text>
    <v-card-actions class="px-4 pb-3">
      <v-chip
        size="small"
        :color="changePositive ? 'green' : 'red'"
        label
      >
        <i
          :class="['bi', changePositive ? 'bi-arrow-up-short' : 'bi-arrow-down-short']"
          class="mr-1"
          style="font-size: 1.1rem;"
        ></i>
        <span class="font-weight-medium">{{ changePercentage }}</span>
      </v-chip>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: String,
  value: [String, Number],
  changePercentage: String,
  changePositive: Boolean,
  // icon không còn là FontAwesome class mà là phần sau 'bi-'
  iconClass: String, // Ví dụ: 'person-fill' cho bi-person-fill
  emoji: String, // Emoji character (e.g., '👥')
  iconBgColor: String, // Background color for the icon circle
  iconColor: String // Color for Bootstrap icon
});
</script>

<style scoped>
.stat-card {
  background-color: #FFFFFF !important;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: none;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.stat-content {
  flex-grow: 1;
  text-align: left;
}

.stat-value {
  color: #333333;
  font-size: 1.8rem !important;
}

.stat-title {
  color: #616161;
  font-size: 0.95rem !important;
  line-height: 1.2;
}

.stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-left: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-emoji {
  font-size: 32px;
  line-height: 1;
}

/* Style cho Bootstrap Icons */
.stat-icon-wrapper i.bi {
  font-size: 30px; /* Kích thước Bootstrap icon */
  line-height: 1;
}
</style>