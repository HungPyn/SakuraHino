<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h3 class="text-h6 font-weight-bold mb-4">Tiến độ kỹ năng</h3>
        <div v-for="(skill, index) in skills" :key="index">
          <v-row align="center" class="mb-3">
            <v-col cols="12">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="font-weight-medium">{{ skill.skill }}</span>
                <span class="text-caption">{{ skill.progress }}%</span>
              </div>
              <v-progress-linear
                :model-value="skill.progress"
                height="10"
                :color="getColor(skill.skill)"
                rounded
              />
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps({
  skills: {
    type: Array,
    required: true
  }
})

const getColor = (skillName) => {
  switch (skillName) {
    case 'Ngữ pháp':
      return 'deep-purple accent-4'
    case 'Từ vựng':
      return 'indigo'
    case 'Nghe hiểu':
      return 'cyan darken-2'
    default:
      return 'primary'
  }
}
</script>

<style scoped>
.v-progress-linear {
  width: 100%;
}
</style>
