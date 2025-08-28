<template>
  <v-table class="leaderboard-table" hover>
    <thead>
      <tr>
        <th class="text-left">#</th>
        <th class="text-left">Học viên</th>
        <th class="text-left">Chuỗi streak</th>
        <th class="text-left">Huy hiệu</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="item.rank">
        <td>
          <v-avatar
            size="28"
            color="primary"
            class="text-white font-weight-bold"
          >
            {{ item.rank }}
          </v-avatar>
        </td>
        <td>{{ item.name }}</td>
        <td>{{ item.score }}</td>
        <td>
          <v-chip
            :color="getBadgeColor(index)"
            class="text-white"
            size="small"
            label
          >
            {{ getBadgeLabel(index) }}
          </v-chip>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
defineProps({
  data: Array,
});

function getBadgeColor(index) {
  const colors = ["amber", "blue", "grey"];
  return colors[index] || "grey";
}

function getBadgeLabel(index) {
  const labels = ["Vàng", "Bạc", "Đồng"];
  return labels[index] || "Thành viên";
}
</script>

<style scoped>
.leaderboard-table {
  border-spacing: 0;
  width: 100%;
}

th {
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #e0e0e0;
  padding: 8px;
}

td {
  padding: 12px 8px;
  border-bottom: 1px solid #f5f5f5;
  font-weight: 500;
}

td .v-avatar {
  font-size: 0.9rem;
}
</style>
