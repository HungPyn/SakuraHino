<template>
  <v-container fluid class="japanese-learning-analytics-dashboard pa-8">
    <v-row align="center" class="mb-6">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold page-title">
          <span class="page-title-icon mr-3">📚</span> Thống kê
        </h1>
        <p class="text-subtitle-1 text-grey-darken-1 pl-10">
         Thống kê chi tiết
        </p>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end">
        <v-select
          v-model="timeFilter"
          :items="['30 ngày qua', '7 ngày qua', 'Tháng này', 'Năm nay']"
          label="Thời gian"
          density="compact"
          variant="outlined"
          hide-details
          class="time-filter rounded-lg"
          prepend-inner-icon="🗓️"
        />
      </v-col>
    </v-row>

    <NewStatCards :data="statCardsData" />

    <v-card class="dashboard-card mt-12 pa-4 rounded-xl elevation-3">
      <v-card-title class="card-title d-flex align-center">
        <span class="card-title-icon mr-2">📊</span>
        Biểu đồ tổng hợp - Người dùng & Bài học & Doanh thu
      </v-card-title>
      <v-card-text>
        <CombinedBarLineChart :chart-data="userGrowthData" style="height: 350px;" />
      </v-card-text>
    </v-card>

    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card class="dashboard-card pa-4 rounded-xl elevation-3">
          <v-card-title class="card-title d-flex align-center">
            <span class="card-title-icon mr-2">🎯</span>
            Phân bố trình độ
          </v-card-title>
          <v-card-text>
            <LevelDistributionChart :chart-data="levelDistributionData" style="height: 250px;" />
          </v-card-text>
        </v-card>

        <v-card class="dashboard-card mt-6 pa-4 rounded-xl elevation-3">
          <v-card-title class="card-title d-flex align-center">
            <span class="card-title-icon mr-2">🧠</span>
            Tiến độ kỹ năng
          </v-card-title>
          <v-card-text>
            <SkillProgressList :skills="skillProgressData" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="dashboard-card pa-4 rounded-xl elevation-3">
          <v-card-title class="card-title d-flex align-center">
            <span class="card-title-icon mr-2">🏆</span>
            Bảng hiệu suất chi tiết
          </v-card-title>
          <v-card-text>
            <PerformanceTable :data="performanceData" />
          </v-card-text>
        </v-card>

        <v-card class="dashboard-card mt-6 pa-4 rounded-xl elevation-3">
          <v-card-title class="card-title d-flex align-center">
            <span class="card-title-icon mr-2">👑</span>
            Bảng xếp hạng học viên
          </v-card-title>
          <v-card-text>
            <LeaderboardTable :data="leaderboardData" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card class="dashboard-card pa-4 rounded-xl elevation-3" style="height: 100%;">
          <v-card-title class="card-title d-flex align-center">
            <span class="card-title-icon mr-2">⏰</span>
            Hoạt động gần đây
          </v-card-title>
          <v-card-text>
            <RecentActivitiesCard :activities="recentActivitiesData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <MiniStatCards :data="miniStatCardsData" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

// Import các component biểu đồ và thống kê
import CombinedBarLineChart from '@/components/dashboard/charts/CombinedBarLineChart.vue'
import LevelDistributionChart from '@/components/dashboard/charts/LevelDistributionChart.vue'
import SkillProgressList from '@/components/dashboard/statistics/SkillProgressList.vue'
import PerformanceTable from '@/components/dashboard/statistics/PerformanceTable.vue'
import LeaderboardTable from '@/components/dashboard/statistics/LeaderboardTable.vue'
import RecentActivitiesCard from '@/components/dashboard/statistics/RecentActivitiesCard.vue'
import MiniStatCards from '@/components/dashboard/statistics/MiniStatCards.vue'
import NewStatCards from '@/components/dashboard/statistics/NewStatCards.vue' // Đảm bảo component này đã được tùy chỉnh với emoji

// Biến reactive cho bộ lọc thời gian
const timeFilter = ref('30 ngày qua')

// Dữ liệu cho NewStatCards (đã được tinh chỉnh để phù hợp với emoji trong component con)
const statCardsData = [
  {
    title: 'Tổng học viên',
    value: 1680,
    changePercentage: '12.5%',
    changePositive: true,
    icon: '🧑‍🤝‍🧑', // Emoji cho tổng học viên
    bgColor: 'linear-gradient(135deg, #42a5f5, #478ed1)',
    iconColor: '#ffffff'
  },
  {
    title: 'Bài học đã hoàn thành',
    value: 7520,
    changePercentage: '5.2%',
    changePositive: true,
    icon: '📚', // Emoji cho bài học đã hoàn thành
    bgColor: 'linear-gradient(135deg, #ab47bc, #8e24aa)',
    iconColor: '#ffffff'
  },
  {
    title: 'Doanh thu tháng này',
    value: '92 triệu VNĐ',
    changePercentage: '8.3%',
    changePositive: false,
    icon: '💰', // Emoji cho doanh thu
    bgColor: 'linear-gradient(135deg, #fbc02d, #f9a825)',
    iconColor: '#ffffff'
  }
];

// Dữ liệu cho CombinedBarLineChart
const userGrowthData = {
  labels: ['Tháng 11', 'Tháng 12', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
  datasets: [
    {
      label: 'Người dùng mới',
      data: [10, 20, 30, 40, 35, 10, 15, 20],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      yAxisID: 'y',
      type: 'bar'
    },
    {
      label: 'Bài học',
      data: [5, 18, 28, 10, 20, 25, 30, 40],
      backgroundColor: 'rgba(255, 206, 86, 0.6)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1,
      yAxisID: 'y',
      type: 'bar'
    },
    {
      label: 'Doanh thu (triệu VNĐ)',
      data: [3, 5, 7, 10, 12, 14, 18, 25],
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderWidth: 2,
      fill: false,
      yAxisID: 'y1',
      tension: 0.4,
      type: 'line'
    }
  ]
}

// Dữ liệu cho LevelDistributionChart
const levelDistributionData = {
  labels: ['N5', 'N4', 'N3', 'N2', 'N1'],
  datasets: [
    {
      label: 'Học viên',
      data: [30, 25, 20, 15, 10],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }
  ]
}

// Dữ liệu cho SkillProgressList
const skillProgressData = [
  { skill: 'Ngữ pháp', progress: 80 },
  { skill: 'Từ vựng', progress: 65 },
  { skill: 'Nghe hiểu', progress: 50 }
]

// Dữ liệu cho RecentActivitiesCard
const recentActivitiesData = [
  { title: 'Bạn A đã hoàn thành bài nghe N5', time: '5 phút trước' },
  { title: 'Bạn B đạt cấp độ N4', time: '30 phút trước' },
  { title: 'Bạn C đăng nhập lại sau 7 ngày', time: '1 giờ trước' },
  { title: 'Bạn D hoàn thành phần luyện từ vựng', time: '2 giờ trước' },
  { title: 'Bạn E vừa bắt đầu học ngữ pháp N3', time: 'Hôm qua' }
]

// Dữ liệu cho PerformanceTable
const performanceData = [
  {
    name: 'Hoàng Nguyên Phúc',
    lessonsCompleted: 75,
    accuracy: '95%',
    speed: 88
  },
  {
    name: 'Khổng Minh Tiến Anh',
    lessonsCompleted: 60,
    accuracy: '68%',
    speed: 65
  },
  {
    name: 'Nguyễn Trí Khôi',
    lessonsCompleted: 40,
    accuracy: '59%',
    speed: 35
  },
  {
    name: 'Lê Thu Huyền',
    lessonsCompleted: 40,
    accuracy: '59%',
    speed: 35
  }
]

// Dữ liệu cho LeaderboardTable
const leaderboardData = [
  { rank: 1, name: 'Nguyễn Thị Trinh', score: 980 },
  { rank: 2, name: 'Vũ Văn Hùng', score: 920 },
  { rank: 3, name: 'Hoàng Ngọc Vương', score: 860 },
  { rank: 4, name: 'Nguyễn Hữu Dũng', score: 900 }
]

// Dữ liệu cho MiniStatCards (đã được tinh chỉnh để phù hợp với emoji trong component con)
const miniStatCardsData = [
  {
    icon: '➕🧑‍🎓', // Emoji cho học viên mới
    value: '120',
    label: 'Học viên mới',
    bg: 'linear-gradient(135deg, #42a5f5, #1e88e5)'
  },
  {
    icon: '✅📖', // Emoji cho bài học hoàn thành
    value: '85',
    label: 'Bài học hoàn thành',
    bg: 'linear-gradient(135deg, #66bb6a, #43a047)'
  },
  {
    icon: '⏳', // Emoji cho thời gian học
    value: '2h 30m',
    label: 'Thời gian học',
    bg: 'linear-gradient(135deg, #ffb74d, #fb8c00)'
  },
  {
    icon: '💯', // Emoji cho tiến độ hoàn thành
    value: '95%',
    label: 'Tiến độ hoàn thành',
    bg: 'linear-gradient(135deg, #ab47bc, #8e24aa)'
  }
]

// Dữ liệu newStartCard đã bị dư thừa, giữ lại statCardsData và miniStatCardsData vì chúng được sử dụng.
// const newStartCard = [ ... ] // Removed as it's not used and duplicates statCardsData intent.

</script>

<style scoped>
/* Base Styles for the Dashboard */
.japanese-learning-analytics-dashboard {
  background-color: #F0F2F5; /* Màu nền xám nhạt đồng bộ */
  min-height: calc(100vh - 64px);
  font-family: 'Roboto', sans-serif;
}

/* Page Title Section */
.page-title {
  color: #333333;
  font-size: 2.2rem !important; /* Điều chỉnh lại kích thước cho cân đối */
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.page-title-icon {
  font-size: 2.8rem; /* Larger emoji for main title */
  line-height: 1;
  vertical-align: middle;
  transform: translateY(-2px);
}
.text-grey-darken-1 {
  color: #616161 !important; /* Điều chỉnh màu chữ xám đậm hơn một chút */
}

/* Time Filter Select */
.time-filter {
  max-width: 200px;
}
.time-filter :deep(.v-field) {
  border-radius: 12px; /* Bo tròn input filter */
  background-color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.time-filter :deep(.v-field__prepend-inner span) {
    font-size: 1.2rem; /* Kích thước emoji trong input filter */
    margin-top: 2px;
}

/* Common Card Styles */
.dashboard-card {
  background-color: #FFFFFF !important;
  border-radius: 16px; /* Bo tròn mạnh hơn cho vẻ mềm mại */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08); /* Đổ bóng sâu hơn, hiện đại hơn */
  border: none; /* Bỏ viền */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.dashboard-card:hover {
  transform: translateY(-3px); /* Nâng nhẹ khi hover */
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12); /* Đổ bóng sâu hơn khi hover */
}

.card-title {
  color: #333333;
  font-weight: 700; /* Đậm hơn */
  font-size: 1.5rem !important; /* Lớn hơn một chút */
  padding: 16px 24px;
  border-bottom: 1px solid #EEEEEE;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}
.card-title-icon {
  font-size: 1.8rem; /* Kích thước icon tiêu đề thẻ */
  line-height: 1;
  vertical-align: middle;
}

/* Table Styling (General for Performance and Leaderboard) */
.performance-table,
.leaderboard-table {
  color: #333333;
  /* Sử dụng :deep() để style các phần tử con của v-data-table */
}
.performance-table :deep(thead th),
.leaderboard-table :deep(thead th) {
  background-color: #E8F0FE !important; /* Nền header xanh nhạt hơn */
  color: #1A237E !important; /* Chữ màu xanh đậm */
  font-weight: 700 !important;
  font-size: 0.95rem !important; /* Hơi nhỏ hơn một chút */
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 12px 16px !important;
  border-bottom: 1px solid #D1D9E6;
}
.performance-table :deep(tbody td),
.leaderboard-table :deep(tbody td) {
  color: #455A64;
  padding: 10px 16px !important;
  border-bottom: 1px solid #ECEFF1;
}
.performance-table :deep(tbody tr:last-child td),
.leaderboard-table :deep(tbody tr:last-child td) {
  border-bottom: none; /* Bỏ border cuối cùng */
}
.performance-table :deep(tbody tr:hover),
.leaderboard-table :deep(tbody tr:hover) {
  background-color: #F5F9FF !important; /* Hiệu ứng hover xanh nhạt */
}

/* Recent Activities Card */
/* Đảm bảo component RecentActivitiesCard đã được cập nhật để sử dụng các class này nếu cần */
.activity-item {
  padding: 10px 0;
  border-bottom: 1px solid #F5F5F5;
  color: #333333 !important;
}
.activity-item:last-child {
  border-bottom: none;
}
.activity-title {
  font-weight: 500;
  color: #333333 !important;
}
.activity-subtitle {
  font-size: 0.85rem;
  color: #666666 !important;
}

/* Styles for MiniStatCards (assuming it uses these classes) */
.mini-stat-card {
  background-color: #FFFFFF !important;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  height: 120px; /* Chiều cao cố định */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.mini-stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
}
.mini-stat-icon {
  font-size: 3rem; /* Lớn hơn cho emoji trong mini stat card */
  line-height: 1;
  color: #FFFFFF; /* Icon color from prop, but emoji is already colored */
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2)); /* Thêm bóng cho emoji */
}
.mini-stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333333;
  margin-top: 8px;
}
.mini-stat-label {
  font-size: 0.9rem;
  color: #666666;
  text-align: center;
}
</style>