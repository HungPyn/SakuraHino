<template>
  <v-row class="mini-stat-cards" dense>
    <v-col
      v-for="(item, index) in data"
      :key="index"
      cols="12"
      md="6"
      class="d-flex"
    >
      <v-card
        class="mini-stat-card"
        :style="{ background: item.bg }"
        elevation="4"
      >
        <div class="icon-wrapper">
          <v-icon size="32" color="white">{{ item.icon }}</v-icon>
        </div>
        <div class="info">
          <div class="value">{{ item.value }}</div>
          <div class="label">{{ item.label }}</div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.mini-stat-card {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 20px 24px;
  border-radius: 20px;
  color: white;
  min-height: 90px;
  transition: transform 0.2s ease;
}
.mini-stat-card:hover {
  transform: translateY(-2px);
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  min-width: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  background-color: rgba(255, 255, 255, 0.2);
}

.info .value {
  font-size: 24px;
  font-weight: 700;
}
.info .label {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
}
</style>
