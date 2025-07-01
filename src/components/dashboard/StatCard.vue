<template>
  <div class="card stat-card" :style="{ background: bgColor }">
    <div class="icon-container" :style="{ background: iconBgColor }">
      <font-awesome-icon :icon="icon" class="main-icon" :style="{ color: iconColor }" />
    </div>
    <div class="stat-content">
      <div class="stat-title">{{ title }}</div>
      <div class="stat-value">{{ value }}</div>
      <div class="stat-change" :class="changeType">
        <font-awesome-icon :icon="changeIcon" class="change-icon" />
        {{ changePercentage }} so với tháng trước
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'StatCard',
  props: {
    title: String,
    value: [String, Number],
    changePercentage: String,
    changePositive: Boolean,
    icon: String,
    iconBgColor: String,
    iconColor: String
  },
  setup(props) {
    const changeType = computed(() => (props.changePositive ? 'positive' : 'negative'));
    const changeIcon = computed(() => (props.changePositive ? 'fas fa-arrow-up' : 'fas fa-arrow-down'));
    return { changeType, changeIcon };
  }
});
</script>

<style scoped>
.stat-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  border-radius: 16px;
  color: white;
  background: #f5f5f5;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}
.icon-container {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  background: var(--icon-bg, #e0e0e0);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.main-icon {
  font-size: 28px;
}
.stat-content {
  flex: 1;
}
.stat-title {
  font-size: 15px;
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
}
.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #2d2d2d;
  margin-bottom: 6px;
}
.stat-change {
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
}
.stat-change.positive {
  color: #28a745;
}
.stat-change.negative {
  color: #dc3545;
}
.change-icon {
  margin-right: 6px;
  font-size: 13px;
}
</style>
