<template>
  <v-container fluid class="japanese-learning-analytics-dashboard pa-8">
    <v-row align="center" class="mb-6">
      <v-col cols="12" md="12">
        <h1 class="text-h4 font-weight-bold page-title">
          <span class="page-title-icon mr-3">📚</span> Thống kê
        </h1>
        <p class="text-subtitle-1 text-grey-darken-1 pl-10">
          Thống kê chi tiết
        </p>
      </v-col>
    </v-row>

    <NewStatCards :data="statCardsData" />

    <!-- <v-card class="dashboard-card mt-12 pa-4 rounded-xl elevation-3">
      <v-card-title class="card-title d-flex align-center">
        <span class="card-title-icon mr-2">📊</span>
        Biểu đồ tổng hợp - Người dùng & Bài học & Doanh thu
      </v-card-title>
      <v-card-text>
        <CombinedBarLineChart
          :chart-data="userGrowthData"
          style="height: 350px"
        />
      </v-card-text>
    </v-card> -->

    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card class="dashboard-card pa-4 rounded-xl elevation-3">
          <v-card-title class="card-title d-flex align-center">
            <span class="card-title-icon mr-2">🎯</span>
            Phân bố trình độ
          </v-card-title>
          <v-card-text>
            <LevelDistributionChart
              :chart-data="levelDistributionData"
              style="height: 250px"
            />
          </v-card-text>
        </v-card>

        <v-card class="dashboard-card mt-6 pa-4 rounded-xl elevation-3">
          <v-card-title class="card-title d-flex align-center">
            <span class="card-title-icon mr-2">🧠</span>
            Thống kê người dùng
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
            Bảng xếp hạng chuỗi
          </v-card-title>
          <v-card-text>
            <PerformanceTable :data="performanceData" />
          </v-card-text>
        </v-card>

        <v-card class="dashboard-card mt-6 pa-4 rounded-xl elevation-3">
          <v-card-title class="card-title d-flex align-center">
            <span class="card-title-icon mr-2">👑</span>
            Bảng xếp hạng exp
          </v-card-title>
          <v-card-text>
            <LeaderboardTable :data="leaderboardData" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- <v-row class="mt-6">
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
        <PendingTasksCard :tasks="pendingTasksData" />
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script setup>
// Import các component biểu đồ và thống kê
import CombinedBarLineChart from "@/components/dashboard/charts/CombinedBarLineChart.vue";
import LevelDistributionChart from "@/components/dashboard/charts/LevelDistributionChart.vue";
import SkillProgressList from "@/components/dashboard/statistics/SkillProgressList.vue";
import PerformanceTable from "@/components/dashboard/statistics/PerformanceTable.vue";
import LeaderboardTable from "@/components/dashboard/statistics/LeaderboardTable.vue";
import RecentActivitiesCard from "@/components/dashboard/statistics/RecentActivitiesCard.vue";
import NewStatCards from "@/components/dashboard/statistics/NewStatCards.vue";

import { ref, onMounted } from "vue";
import userService from "@/services/userService";
import lessonService from "@/services/lessonService";

// Dữ liệu ban đầu (3 card sau fix cứng)
const statCardsData = ref([
  {
    title: "Tổng người dùng",
    value: "0",
    changePercentage: null,
    changePositive: true,
    icon: "fas fa-users",
    iconBgColor: "#e8f0fe",
    iconColor: "#1a73e8",
    emoji: "👥",
  },
  {
    title: "Bài học đã tạo",
    value: "0",
    changePercentage: null,
    changePositive: true,
    icon: "fas fa-file-alt",
    iconBgColor: "#e6ffe6",
    iconColor: "#28a745",
    emoji: "📝",
  },
  {
    title: "Bài học hoạt động",
    value: "0",
    changePercentage: null,
    changePositive: true,
    icon: "fas fa-graduation-cap",
    iconBgColor: "#fff0e6",
    iconColor: "#ff9800",
    emoji: "🎓",
  },
  {
    title: "Đăng ký mới trong tháng",
    value: "842",
    changePercentage: "2.4%",
    changePositive: false,
    icon: "fas fa-user-plus",
    iconBgColor: "#ffe6e6",
    iconColor: "#dc3545",
    emoji: "🆕",
  },
]);

// Hàm load API cho card "Tổng người dùng"
async function loadUserStatsThisMonth() {
  try {
    const res = await userService.getTotalUsersWithPercentThisMonth();
    const data = res.data;

    // update card 0
    statCardsData.value[3].value = data.totalUsers.toLocaleString();
    statCardsData.value[3].changePercentage = data.percentChange + "%";
    statCardsData.value[3].changePositive = data.percentChange > 0;
  } catch (err) {
    console.error("Lỗi khi load thống kê người dùng:", err);
  }
}

// Hàm load API cho card "Tổng người dùng"
async function loadUserStats() {
  try {
    const res = await userService.getTotalUsersWithPercent();
    const data = res.data;

    // update card 0
    statCardsData.value[0].value = data.totalUsers.toLocaleString();
    statCardsData.value[0].changePercentage = data.percentChange + "%";
    statCardsData.value[0].changePositive = data.percentChange > 0;
  } catch (err) {
    console.error("Lỗi khi load thống kê người dùng:", err);
  }
}

// Hàm load API cho card "Tổng bài học"
async function loadLessonStats() {
  try {
    const res = await lessonService.getTotalLessonStatics();
    const data = res.data;
    console.log(res);
    if (!data) {
      console.warn("API trả về không có data cho bài học");
      return;
    }

    statCardsData.value[1].value = data.totalLesson?.toLocaleString() || "0";
    statCardsData.value[1].changePercentage =
      data.percentChange != null ? data.percentChange.toFixed(1) + "%" : null;
    statCardsData.value[1].changePositive = data.percentChange > 0;
  } catch (err) {
    console.error("Lỗi khi load thống kê bài học:", err);
  }
}

// Hàm load API cho card "Tổng bài học public"
async function loadLessonStatsPublic() {
  try {
    const res = await lessonService.getTotalLessonStaticsByPublic();
    const data = res.data;
    console.log(res);
    if (!data) {
      console.warn("API trả về không có data cho bài học");
      return;
    }

    statCardsData.value[2].value = data.totalLesson?.toLocaleString() || "0";
    statCardsData.value[2].changePercentage =
      data.percentChange != null ? data.percentChange.toFixed(1) + "%" : null;
    statCardsData.value[2].changePositive = data.percentChange > 0;
  } catch (err) {
    console.error("Lỗi khi load thống kê bài học:", err);
  }
}

// Dữ liệu cho CombinedBarLineChart
const userGrowthData = ref({
  labels: [
    "Tháng 11",
    "Tháng 12",
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
  ],
  datasets: [
    {
      label: "Người dùng mới",
      data: [10, 20, 30, 40, 35, 10, 15, 20],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
      yAxisID: "y",
      type: "bar",
    },
    {
      label: "Bài học",
      data: [5, 18, 28, 10, 20, 25, 30, 40],
      backgroundColor: "rgba(255, 206, 86, 0.6)",
      borderColor: "rgba(255, 206, 86, 1)",
      borderWidth: 1,
      yAxisID: "y",
      type: "bar",
    },
    {
      label: "Doanh thu (triệu VNĐ)",
      data: [3, 5, 7, 10, 12, 14, 18, 25],
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderWidth: 2,
      fill: false,
      yAxisID: "y1",
      tension: 0.4,
      type: "line",
    },
  ],
});

// Dữ liệu cho LevelDistributionChart
const levelDistributionData = ref({
  labels: ["N5", "N4", "N3", "N2", "N1"],
  datasets: [
    {
      label: "Học viên",
      data: [30, 25, 20, 15, 10],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
    },
  ],
});

// Dữ liệu cho SkillProgressList
const skillProgressData = ref([
  { skill: "Ngữ pháp", progress: 80 },
  { skill: "Từ vựng", progress: 65 },
  { skill: "Nghe hiểu", progress: 50 },
]);

// Dữ liệu cho RecentActivitiesCard
const recentActivitiesData = ref([
  { title: "Bạn A đã hoàn thành bài nghe N5", time: "5 phút trước" },
  { title: "Bạn B đạt cấp độ N4", time: "30 phút trước" },
  { title: "Bạn C đăng nhập lại sau 7 ngày", time: "1 giờ trước" },
  { title: "Bạn D hoàn thành phần luyện từ vựng", time: "2 giờ trước" },
  { title: "Bạn E vừa bắt đầu học ngữ pháp N3", time: "Hôm qua" },
]);

// Dữ liệu cho PerformanceTable

const performanceData = ref([]);
const getTopStreak = async () => {
  const data = await userService.getLongStreaks(); // API trả về mảng người dùng

  // Chuyển data API sang format giống leaderboardData
  const mappedData = data.map((user, index) => ({
    rank: index + 1,
    name: user.name,
    score: user.longStreak,
  }));

  // Gán vào leaderboardData
  performanceData.value = mappedData;
  console.log("LeaderboardData sau khi gán:", leaderboardData.value);
};
const leaderboardData = ref([]);

const getTopExp = async () => {
  const data = await userService.getExpScoreStats(); // API trả về mảng người dùng

  // Chuyển data API sang format giống leaderboardData
  const mappedData = data.map((user, index) => ({
    rank: index + 1,
    name: user.name,
    score: user.expScore,
  }));

  // Gán vào leaderboardData
  leaderboardData.value = mappedData;
  console.log("LeaderboardData sau khi gán:", leaderboardData.value);
};
// Dữ liệu cho LeaderboardTable

// Dữ liệu cho PendingTasksCard
const pendingTasksData = ref([
  { title: "Kiểm tra bài tập ngữ pháp N4", dueDate: "Hôm nay, 17:00" },
  { title: "Duyệt nội dung bài học mới", dueDate: "Ngày mai, 10:00" },
  { title: "Phản hồi bình luận của học viên", dueDate: "Ngày mai, 14:00" },
  { title: "Chuẩn bị tài liệu cho buổi webinar", dueDate: "Thứ 2, 09:00" },
]);

onMounted(() => {
  getTopExp();
  loadUserStatsThisMonth();
  loadUserStats();
  loadLessonStats();
  loadLessonStatsPublic();
  getTopStreak();
});
</script>

<style scoped>
/* Base Styles for the Dashboard */
.japanese-learning-analytics-dashboard {
  background-color: #f0f2f5; /* Màu nền xám nhạt đồng bộ */
  min-height: calc(100vh - 64px);
  font-family: "Roboto", sans-serif;
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

/* Common Card Styles */
.dashboard-card {
  background-color: #ffffff !important;
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
  border-bottom: 1px solid #eeeeee;
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
}
.performance-table :deep(thead th),
.leaderboard-table :deep(thead th) {
  background-color: #e8f0fe !important; /* Nền header xanh nhạt hơn */
  color: #1a237e !important; /* Chữ màu xanh đậm */
  font-weight: 700 !important;
  font-size: 0.95rem !important; /* Hơi nhỏ hơn một chút */
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 12px 16px !important;
  border-bottom: 1px solid #d1d9e6;
}
.performance-table :deep(tbody td),
.leaderboard-table :deep(tbody td) {
  color: #455a64;
  padding: 10px 16px !important;
  border-bottom: 1px solid #eceff1;
}
.performance-table :deep(tbody tr:last-child td),
.leaderboard-table :deep(tbody tr:last-child td) {
  border-bottom: none; /* Bỏ border cuối cùng */
}
.performance-table :deep(tbody tr:hover),
.leaderboard-table :deep(tbody tr:hover) {
  background-color: #f5f9ff !important; /* Hiệu ứng hover xanh nhạt */
}

/* Recent Activities Card */
.activity-item {
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
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
</style>
