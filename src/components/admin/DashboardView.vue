<template>
  
  <div class="dashboard-view">
    <h1 class="page-title">
      <span class="page-title-icon mr-3">🗂️</span> Tổng quan hệ thống
    </h1>
    <p class="page-description">Chào mừng trở lại! Đây là tổng quan hoạt động của hệ thống.</p>

    <section class="stat-cards-grid grid-container">
      <StatCard
        title="Tổng người dùng"
        value="12,845"
        change-percentage="8.2%"
        :change-positive="true"
        icon="fas fa-users"
        icon-bg-color="#e8f0fe"
        icon-color="#1a73e8"
      />
      <StatCard
        title="Nội dung đã tạo"
        value="3,721"
        change-percentage="12.5%"
        :change-positive="true"
        icon="fas fa-file-alt"
        icon-bg-color="#e6ffe6"
        icon-color="#28a745"
      />
      <StatCard
        title="Gói học đang hoạt động"
        value="24"
        change-percentage="3.8%"
        :change-positive="true"
        icon="fas fa-graduation-cap"
        icon-bg-color="#fff0e6"
        icon-color="#ff9800"
      />
      <StatCard
        title="Đăng ký mới trong tháng"
        value="842"
        change-percentage="2.4%"
        :change-positive="false"
        icon="fas fa-user-plus"
        icon-bg-color="#ffe6e6"
        icon-color="#dc3545"
      />
    </section>

    <section class="charts-grid grid-container">
      <ActivityChart />
      <ContentDistributionChart />
    </section>

    <section class="activity-tasks-grid grid-container">
      <RecentActivityCard />
      <PendingTasksCard />
    </section>

    <section class="recent-content-section">
      <RecentContentCard />
    </section>

    <v-dialog v-model="dialog" max-width="600px" transition="dialog-bottom-transition">
      <v-card class="rounded-xl elevation-8 dialog-card">
        <v-toolbar color="blue-darken-2" dark flat class="rounded-t-xl">
          <v-toolbar-title class="text-h6 font-weight-bold pl-3">
            <span class="dialog-title-icon mr-2">📝</span> Thêm/Chỉnh sửa Mục
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeDialog">
            <span class="text-h6">❌</span>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-6">
          <v-form ref="formRef" @submit.prevent="saveItem">
            <v-text-field
              label="Tên"
              v-model="form.name"
              variant="outlined"
              class="rounded-lg mb-4"
              density="comfortable"
            ></v-text-field>
            <v-textarea
              label="Mô tả"
              v-model="form.description"
              variant="outlined"
              class="rounded-lg mb-4"
              rows="3"
              density="comfortable"
            ></v-textarea>
            </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 bg-grey-lighten-4 rounded-b-xl d-flex justify-end">
          <v-btn color="grey-darken-1" variant="flat" class="rounded-lg px-6 py-3" @click="closeDialog">
            Hủy
          </v-btn>
          <v-btn color="blue-darken-2" variant="elevated" class="rounded-lg px-6 py-3" @click="saveItem">
            Lưu
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import StatCard from '@/components/dashboard/StatCard.vue';
import ActivityChart from '@/components/dashboard/ActivityChart.vue';
import ContentDistributionChart from '@/components/dashboard/ContentDistributionChart.vue';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard.vue';
import PendingTasksCard from '@/components/dashboard/PendingTasksCard.vue';
import RecentContentCard from '@/components/dashboard/RecentContentCard.vue';

export default defineComponent({
  name: 'DashboardView',
  components: {
    StatCard,
    ActivityChart,
    ContentDistributionChart,
    RecentActivityCard,
    PendingTasksCard,
    RecentContentCard,
  },
  data() {
    return {
      dialog: false, // Control hiển thị/ẩn popup
      form: { // Dữ liệu form (ví dụ)
        name: '',
        description: '',
      },
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    saveItem() {
      // Xử lý logic lưu dữ liệu
      console.log('Dữ liệu đã lưu:', this.form);
      this.closeDialog();
    },
  },
});
</script>

<style scoped>
/* Base Styles for the Dashboard */
.dashboard-view {
  padding: 10px 0; /* Adjust padding if needed, main-content already has it */
  font-family: 'Roboto', sans-serif; /* Thêm font chữ mềm mại */
}

/* Page Title Section */
.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 5px;
  display: flex;
  align-items: center; /* Canh giữa icon và text */
}
.page-title-icon {
  font-size: 1.5em; /* Lớn hơn một chút */
  margin-right: 8px;
}

.page-description {
  font-size: 16px;
  color: var(--text-medium);
  margin-bottom: 30px;
}

/* Stat Cards Section */
.stat-cards-grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-bottom: 30px;
  gap: 20px; /* Thêm khoảng cách giữa các card */
}

/* Charts Section */
.charts-grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: 30px;
  gap: 20px; /* Thêm khoảng cách giữa các chart */
}

/* Activity & Tasks Section */
.activity-tasks-grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: 30px;
  gap: 20px; /* Thêm khoảng cách giữa các card */
}

/* Recent Content Section */
.recent-content-section {
    /* This section will take full width, so no grid needed here if it's the only item */
    margin-bottom: 30px; /* Space after the section */
}

/* Popup CRUD Styling (Quan trọng) */
.dialog-card {
  overflow: hidden; /* Đảm bảo bo tròn không bị tràn */
}

.v-toolbar.rounded-t-xl {
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
}

.dialog-card .v-card-text {
  padding: 30px !important; /* Tăng padding bên trong dialog */
  background-color: #F8F9FA; /* Nền hơi xám cho phần nội dung */
}

.dialog-card .v-card-actions {
  border-top: 1px solid #EEEEEE;
  padding: 20px 30px !important; /* Tăng padding */
}

/* Input styling trong dialog */
.v-dialog .v-text-field,
.v-dialog .v-textarea {
  background-color: #FFFFFF !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Đổ bóng nhẹ cho input trong dialog */
}

/* Style cho icon trong tiêu đề dialog */
.dialog-title-icon {
  font-size: 1.3em;
  vertical-align: middle;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .page-title {
    font-size: 26px;
  }
  .page-description {
    font-size: 15px;
    margin-bottom: 25px;
  }
  .stat-cards-grid, .charts-grid, .activity-tasks-grid {
    gap: 20px;
    margin-bottom: 25px;
  }
}

@media (max-width: 992px) {
  .page-title {
    font-size: 24px;
  }
  .page-description {
    font-size: 14px;
    margin-bottom: 20px;
  }
  .stat-cards-grid, .charts-grid, .activity-tasks-grid {
    grid-template-columns: 1fr; /* Stack all cards vertically */
    gap: 15px;
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 22px;
  }
  .page-description {
    font-size: 13px;
    margin-bottom: 15px;
  }
}
</style>