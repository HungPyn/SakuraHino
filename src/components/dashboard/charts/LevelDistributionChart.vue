<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  chartData: {
    type: Object,
    default: () => ({ labels: [], datasets: [] })
  }
})

let chartInstance = null
const canvas = ref(null)

onMounted(render)
watch(() => props.chartData, render)

function render() {
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(canvas.value.getContext('2d'), {
    type: 'doughnut',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  })
}
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
