<template>
  <v-table class="performance-table" hover>
    <thead>
      <tr>
        <th class="text-left" style="width: 60px;">#</th>
        <th class="text-left">Học viên</th>
        <th class="text-left">Bài học đã hoàn thành</th>
        <th class="text-left">Độ chính xác</th>
        <th class="text-left">Tốc độ học</th>
        <th class="text-left">Đánh giá</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <td>
          <v-avatar size="32" :color="getRankColor(index)" class="rank-avatar">
            <span class="white--text font-weight-bold">{{ index + 1 }}</span>
          </v-avatar>
        </td>
        <td class="font-weight-medium">{{ item.name }}</td>
        <td>{{ item.lessonsCompleted }}</td>
        <td>
          <v-chip :color="getAccuracyColor(item.accuracy)" dark small>
            {{ item.accuracy }}
          </v-chip>
        </td>
        <td>
          <v-progress-linear
            :model-value="item.speed"
            height="10"
            rounded
            :color="item.speed > 70 ? 'green' : item.speed > 40 ? 'orange' : 'red'"
            class="mr-2"
          />
          <small>{{ item.speed }}%</small>
        </td>
        <td>
          <v-chip :color="isPass(item.accuracy) ? 'green' : 'red'" small dark>
            {{ isPass(item.accuracy) ? 'Đạt' : 'Không đạt' }}
          </v-chip>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
defineProps({
  data: Array
})

const getAccuracyColor = (accuracyStr) => {
  const value = parseInt(accuracyStr)
  if (value >= 90) return 'green'
  if (value >= 70) return 'orange'
  return 'red'
}

const isPass = (accuracyStr) => parseInt(accuracyStr) >= 70

const getRankColor = (index) => {
  switch (index) {
    case 0: return 'deep-orange accent-4'
    case 1: return 'amber darken-2'
    case 2: return 'blue lighten-2'
    default: return 'grey darken-1'
  }
}
</script>

<style scoped>
.performance-table th {
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #E0E0E0;
  padding: 8px;
}

.performance-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #F5F5F5;
  font-weight: 500;
}

.performance-table tr:hover {
  background-color: #FAFAFA;
}

.rank-avatar {
  font-size: 0.85rem;
  font-weight: bold;
  color: white;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
