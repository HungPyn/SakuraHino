<template>
  <div class="card activity-chart-card">
    <div class="card-header">
      <h2 class="card-title">📝 Người dùng đăng ký</h2>
      <div class="time-filters">
        <button
          v-for="period in timePeriods"
          :key="period.value"
          @click="selectTimePeriod(period.value)"
          :class="{ active: selectedPeriod === period.value }"
        >
          {{ period.label }}
        </button>
      </div>
    </div>
    <div class="chart-container">
      <canvas ref="activityChartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch, onBeforeUnmount } from 'vue';
import Chart from 'chart.js/auto'; // Auto-registers core Chart.js components

export default defineComponent({
  name: 'ActivityChart',
  setup() {
    const activityChartCanvas = ref(null);
    let activityChartInstance = null;
    const selectedPeriod = ref('30days'); // Default selected period

    const timePeriods = [
      { label: '7 ngày', value: '7days' },
      { label: '30 ngày', value: '30days' },
      { label: '90 ngày', value: '90days' },
    ];

    // Function to generate mock chart data based on the selected period
    const fetchData = (period) => {
      let labels = [];
      let newUsersData = [];
      let totalUsersData = [];

      const today = new Date();
      // Helper to format date as 'D/M'
      const getFormattedDate = (date) => `${date.getDate()}/${date.getMonth() + 1}`;

      if (period === '7days') {
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          labels.push(getFormattedDate(d));
          newUsersData.push(Math.floor(Math.random() * 50) + 10);
          totalUsersData.push(Math.floor(Math.random() * 70) + 20);
        }
      } else if (period === '30days') {
        // Data points adjusted to visually match the provided image
        labels = ['19/5', '', '30/5', '', '16/6']; // Labels from image
        newUsersData = [120, 180, 160, 210, 190]; // Bar data
        totalUsersData = [320, 360, 410, 450, 480]; // Line data
      } else if (period === '90days') {
        for (let i = 2; i >= 0; i--) { // 3 data points for 3 months
          const d = new Date(today);
          d.setMonth(today.getMonth() - i);
          labels.push(`${d.getMonth() + 1}/${d.getFullYear()}`);
          newUsersData.push(Math.floor(Math.random() * 200) + 100);
          totalUsersData.push(Math.floor(Math.random() * 250) + 150);
        }
      }

      return { labels, newUsersData, totalUsersData };
    };
const updateChart = () => {
  const { labels, newUsersData, totalUsersData } = fetchData(selectedPeriod.value);

  const rootStyles = getComputedStyle(document.documentElement);
  const textMedium = rootStyles.getPropertyValue('--text-medium').trim();
  const fontFamilySans = rootStyles.getPropertyValue('--font-family-sans').trim();
  const borderColor = rootStyles.getPropertyValue('--border-color').trim();

  if (activityChartInstance) {
    activityChartInstance.data.labels = labels;
    activityChartInstance.data.datasets[0].data = newUsersData;
    activityChartInstance.data.datasets[1].data = totalUsersData;
    activityChartInstance.update();
  } else {
    activityChartInstance = new Chart(activityChartCanvas.value, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Người dùng mới',
            data: newUsersData,
            backgroundColor: 'rgba(26, 115, 232, 0.8)',
            borderRadius: 6,
            barThickness: 25,
          },
          {
            type: 'line',
            label: 'Tổng đăng nhập',
            data: totalUsersData,
            borderColor: '#28a745',
            backgroundColor: 'transparent',
            tension: 0.4,
            pointBackgroundColor: '#28a745',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#28a745',
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              boxHeight: 8,
              color: textMedium,
              font: {
                size: 14,
                family: fontFamilySans,
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              title: function (context) {
                return `Ngày ${context[0].label}`;
              },
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.parsed.y;
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              display: false,
            },
            ticks: {
              color: textMedium,
              font: {
                family: fontFamilySans,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: borderColor,
            },
            ticks: {
              color: textMedium,
              font: {
                family: fontFamilySans,
              },
              callback: function (value) {
                if (Number.isInteger(value)) {
                  return value;
                }
                return null;
              },
            },
          },
        },
      },
    });
  }
};


    const selectTimePeriod = (period) => {
      selectedPeriod.value = period;
    };

    // Watch for changes in selectedPeriod and trigger chart update
    watch(selectedPeriod, () => {
      updateChart();
    });

    onMounted(() => {
      updateChart(); // Initial chart render on component mount
    });

    onBeforeUnmount(() => {
      if (activityChartInstance) {
        activityChartInstance.destroy(); // Clean up chart instance to prevent memory leaks
      }
    });

    return {
      activityChartCanvas,
      selectedPeriod,
      timePeriods,
      selectTimePeriod,
    };
  },
});
</script>

<style scoped>
.activity-chart-card {
  grid-column: span 2; /* Occupies 2 columns in a grid layout */
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px var(--shadow-light); /* Apply card shadow */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0;
}

.time-filters button {
  padding: 8px 15px;
  border-radius: var(--border-radius-button);
  background-color: var(--button-default-bg);
  color: var(--text-medium);
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px; /* Space between filter buttons */
  transition: background-color 0.2s, color 0.2s;
}

.time-filters button:hover {
  background-color: var(--button-hover-bg);
}

.time-filters button.active {
  background-color: var(--primary-color);
  color: var(--text-white);
}

.chart-container {
  position: relative;
  width: 100%;
  height: 350px; /* Fixed height for the chart container */
  max-height: 400px; /* Max height to prevent excessive stretching on large screens */
  margin: 0 auto; /* Center the container if its actual content is smaller */
}

/* Important: Ensure the canvas inside the container fills its dimensions */
canvas {
  width: 100% !important;
  height: 100% !important;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .card-title {
    font-size: 17px;
  }
  .time-filters button {
    padding: 7px 12px;
    font-size: 13px;
  }
  .chart-container {
    height: 300px; /* Adjust height for medium screens */
  }
}

@media (max-width: 992px) {
  .activity-chart-card {
    grid-column: span 1; /* Occupy single column on smaller screens */
  }
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  .card-title {
    margin-bottom: 10px;
  }
  .time-filters {
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-left: 0;
  }
  .time-filters button {
    flex-grow: 1;
    margin: 0 4px; /* Adjust margin for stacked buttons */
    padding: 8px;
  }
  .chart-container {
    height: 280px; /* Further adjust height */
  }
}

@media (max-width: 768px) {
  .card-title {
    font-size: 16px;
  }
  .time-filters button {
    font-size: 12px;
    padding: 6px;
  }
  .chart-container {
    height: 250px; /* Smallest height */
  }
}
</style>
