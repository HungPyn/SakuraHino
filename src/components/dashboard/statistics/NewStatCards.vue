<template>
  <v-row>
    <v-col cols="12" sm="6" md="3" v-for="(card, i) in data" :key="i">
      <v-card class="dashboard-card pa-4 d-flex align-center" :style="{ borderLeft: `4px solid ${card.color}` }">
        <v-icon :color="card.color" class="mr-3">{{ card.icon }}</v-icon>
        <div>
          <div class="text-h6 font-weight-bold">{{ card.value }}</div>
          <div class="subtitle-2">{{ card.title }}</div>
        </div>
        <div class="ml-auto text-sm" :class="card.percentage >= 0 ? 'text-success' : 'text-error'">
          {{ card.percentage >= 0 ? '+' : '' }}{{ card.percentage }}%
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  data: { type: Array, default: () => [] }
})
</script>
