<template>
  <v-row class="stat-cards-grid">
    <v-col
      v-for="(card, index) in data"
      :key="index"
      cols="12"
      sm="6"
      md="3"
    >
      <StatCard
        :title="card.title"
        :value="card.value"
        :change-percentage="card.changePercentage"
        :change-positive="card.changePositive"
        :icon="card.icon"
        :emoji="card.emoji"
        :icon-bg-color="card.iconBgColor"
        :icon-color="card.iconColor"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import StatCard from '../StatCard.vue'; // Đảm bảo đường dẫn đúng

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.stat-cards-grid {
  /* Có thể thêm các style grid container nếu cần */
  margin-top: 16px; /* Khoảng cách với phần tử phía trên */
}
</style>