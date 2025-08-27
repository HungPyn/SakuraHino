<template>
  <div>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  stacked: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#333",
        font: { size: 14 },
      },
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Thời gian",
        color: "#333",
      },
      ticks: {
        color: "#333",
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Số lượng",
        color: "#333",
      },
      ticks: {
        color: "#333",
      },
    },
  },
};
</script>

<style scoped></style>
