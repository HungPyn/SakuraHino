<template>
  <div class="card content-distribution-card">
    <div class="card-header">
      <h2 class="card-title">Phân bổ hoạt động</h2>
    </div>
    <div class="chart-container">
      <canvas ref="contentDistributionChartCanvas"></canvas>
    </div>
    <div class="legend-list">
      <div v-for="item in legendItems" :key="item.label" class="legend-item">
        <span class="legend-color-box" :style="{ backgroundColor: item.color }"></span>
        <span class="legend-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import Chart from 'chart.js/auto'; // Auto-registers core Chart.js components

export default defineComponent({
  name: 'ContentDistributionChart',
  setup() {
    const contentDistributionChartCanvas = ref(null);
    let contentDistributionChartInstance = null;

    const data = {
      labels: ['Từ vựng', 'Ngữ pháp', 'Bài nghe', 'Đề thi', 'Manga', 'Khác'],
      datasets: [
        {
          data: [25, 20, 15, 12, 10, 18], // Example percentages
          backgroundColor: [
            '#4CAF50', // Green
            '#2196F3', // Blue
            '#FFC107', // Amber
            '#FF9800', // Orange
            '#F44336', // Red
            '#9E9E9E', // Grey
          ],
          borderColor: 'var(--card-background)', // White border between segments
          borderWidth: 5,
          hoverOffset: 10, // Lift effect on hover
        },
      ],
    };

    const legendItems = ref([]);

    onMounted(() => {
      contentDistributionChartInstance = new Chart(contentDistributionChartCanvas.value, {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false, // Essential for responsive container sizing
          cutout: '70%', // Doughnut chart style
          plugins: {
            legend: {
              display: false, // Hide default legend to use custom one
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              titleColor: '#fff',
              bodyColor: '#fff',
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: function(context) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  // Display percentage in tooltip
                  const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                  const percentage = ((context.parsed / total) * 100).toFixed(1) + '%';
                  return label + percentage;
                },
              },
            },
          },
        },
      });

      // Manually create legend items for rendering in template based on chart data
      legendItems.value = data.datasets[0].backgroundColor.map((color, index) => ({
        label: data.labels[index],
        color: color,
      }));
    });

    onBeforeUnmount(() => {
      if (contentDistributionChartInstance) {
        contentDistributionChartInstance.destroy(); // Clean up chart instance
      }
    });

    return {
      contentDistributionChartCanvas,
      legendItems,
    };
  },
});
</script>

<style scoped>
.content-distribution-card {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  box-shadow: 0 4px 12px var(--shadow-light); /* Apply card shadow */
}

.card-header {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0;
}

.chart-container {
  position: relative;
  width: 250px; /* Fixed width for the chart */
  height: 250px; /* Fixed height to make it a perfect circle */
  margin-bottom: 20px;
}

/* Ensure canvas inside container fills its dimensions */
canvas {
  width: 100% !important;
  height: 100% !important;
}

.legend-list {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two columns for legend items */
  gap: 10px 20px; /* Gap between legend items */
  width: 100%;
  max-width: 300px; /* Limit legend width */
  margin-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color-box {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-right: 8px;
  flex-shrink: 0;
}

.legend-label {
  font-size: 14px;
  color: var(--text-dark);
  white-space: nowrap; /* Prevents label text wrapping */
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .chart-container {
    width: 220px;
    height: 220px;
  }
  .legend-list {
    gap: 8px 15px;
  }
  .legend-label {
    font-size: 13px;
  }
}

@media (max-width: 992px) {
  .chart-container {
    width: 200px;
    height: 200px;
  }
  .legend-list {
    grid-template-columns: 1fr; /* Single column for legend on smaller screens */
    max-width: 200px;
  }
}
@media (max-width: 768px) {
  .card-title {
    font-size: 16px;
  }
  .chart-container {
    width: 180px;
    height: 180px;
  }
  .legend-list {
    font-size: 12px;
    gap: 5px 10px;
  }
}
</style>
