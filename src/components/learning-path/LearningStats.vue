<template>
  <div class="row mb-4">
    <div class="col-md-3 col-sm-6 col-12 mb-3" v-for="stat in stats" :key="stat.label">
      <div :class="`stat-card card shadow-sm p-4 text-center border-start border-${stat.color} border-5`">
        <div class="card-body">
          <i :class="`bi ${stat.icon} mb-3 display-6 text-${stat.color}`"></i>
          <h4 class="card-title fw-bold mb-1">{{ stat.value }}</h4>
          <p class="card-text text-muted">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { stats } from '@/services/learningPathService.js'
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease; /* Hiệu ứng chuyển động mượt mà khi hover */
  border-radius: 0.75rem; /* Bo góc tròn hơn một chút */
  overflow: hidden; /* Đảm bảo mọi thứ bên trong card không tràn ra ngoài */
  background-color: #fff; /* Nền trắng sạch */
}

.stat-card:hover {
  transform: translateY(-5px); /* Nhấc nhẹ lên khi hover */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important; /* Bóng đổ rõ hơn khi hover */
}

.stat-card .card-body {
  padding: 1.5rem !important; /* Tăng padding bên trong card */
}

/* Kích thước icon và căn chỉnh */
.stat-card i.bi {
  font-size: 3rem !important; /* Tăng kích thước icon lên đáng kể (display-6) */
  margin-bottom: 1rem !important; /* Khoảng cách dưới icon */
  line-height: 1; /* Đảm bảo icon không chiếm quá nhiều chiều cao */
}

/* Kiểu chữ cho giá trị thống kê */
.stat-card .card-title {
  font-size: 2rem !important; /* Tăng kích thước số liệu */
  /* fw-bold đã được đặt trong template */
  color: #343a40; /* Màu chữ hơi tối hơn cho giá trị */
}

/* Kiểu chữ cho nhãn thống kê */
.stat-card .card-text {
  font-size: 0.95rem !important; /* Kích thước chữ cho nhãn */
  /* text-muted đã được đặt trong template, màu xám nhẹ */
  margin-top: 0.5rem; /* Khoảng cách trên nhãn */
}

/* Border left color based on Bootstrap utility classes */
.border-primary { border-color: var(--bs-primary) !important; }
.border-success { border-color: var(--bs-success) !important; }
.border-warning { border-color: var(--bs-warning) !important; }
.border-danger { border-color: var(--bs-danger) !important; }

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .stat-card {
    margin-bottom: 1rem; /* Khoảng cách giữa các card trên màn hình nhỏ */
  }
  .stat-card i.bi {
    font-size: 2.5rem !important;
  }
  .stat-card .card-title {
    font-size: 1.8rem !important;
  }
}
</style>