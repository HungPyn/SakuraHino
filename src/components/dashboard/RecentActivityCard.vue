<template>
  <div class="card recent-activity-card">
    <div class="card-header">
      <h2 class="card-title">🔬 Hoạt động gần đây</h2>
      <button class="view-all-btn">Xem tất cả</button>
    </div>
    <ul class="activity-list">
      <li v-for="(activity, index) in activities" :key="index" class="activity-item">
        <div class="activity-icon-wrapper" :style="{ backgroundColor: activity.iconBgColor }">
          <font-awesome-icon :icon="activity.icon" :style="{ color: activity.iconColor }" class="activity-icon" />
        </div>
        <div class="activity-details">
          <p class="activity-text" v-html="activity.text"></p>
          <span class="activity-time">{{ activity.time }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'RecentActivityCard',
  setup() {
    const activities = ref([
      {
        icon: 'fas fa-user-plus',
        iconBgColor: '#e8f0fe',
        iconColor: '#1a73e8',
        text: '<strong>Nguyễn Văn A</strong> đã đăng ký gói Premium <br> Gói học 12 tháng - Thanh toán qua Visa',
        time: '10 phút trước',
      },
      {
        icon: 'fas fa-book',
        iconBgColor: '#e6ffe6', // Light green
        iconColor: '#28a745', // Green
        text: 'Admin đã thêm 50 từ vựng mới <br> Chủ đề: Ẩm thực - Cấp độ N4',
        time: '45 phút trước',
      },
      {
        icon: 'fas fa-flag',
        iconBgColor: '#fff0e6', // Light orange
        iconColor: '#ff9800', // Orange
        text: 'Báo cáo vi phạm mới <br> Bình luận không phù hợp trong bài "Ngữ pháp N3"',
        time: '2 giờ trước',
      },
      {
        icon: 'fas fa-check-circle',
        iconBgColor: '#e0f7fa', // Light cyan
        iconColor: '#00bcd4', // Cyan
        text: 'Cập nhật bài kiểm tra N5 <br> Thêm 20 câu hỏi mới vào đề thi thử',
        time: '5 giờ trước',
      },
      {
        icon: 'fas fa-upload',
        iconBgColor: '#e8f0fe',
        iconColor: '#1a73e8',
        text: 'Đã tải lên bài thi JLPT N3 <br> Đã lên đề thi JLPT N3 kỳ tháng 7/2025',
        time: '3 giờ trước',
      },
      {
        icon: 'fas fa-comment-dots',
        iconBgColor: '#e0f7fa',
        iconColor: '#00bcd4',
        text: 'Bình luận mới cần duyệt <br> Có 5 bình luận mới đang chờ kiểm duyệt',
        time: '5 giờ trước',
      },
    ]);

    return {
      activities,
    };
  },
});
</script>

<style scoped>
.recent-activity-card {
  box-shadow: 0 4px 12px var(--shadow-light);
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0;
}

.view-all-btn {
  font-size: 14px;
  color: var(--primary-color);
  font-weight: 500;
  transition: color 0.2s;
}

.view-all-btn:hover {
  color: #1660cc;
  text-decoration: underline;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1; /* Allow list to grow and fill space */
  overflow-y: auto; /* Enable scrolling for activity list */
  max-height: 350px; /* Limit height for consistent layout */
}

.activity-item {
  display: flex;
  align-items: flex-start; /* Align icon with the top of text */
  margin-bottom: 20px;
}

.activity-item:last-child {
  margin-bottom: 0;
}

.activity-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-circle);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 15px;
}

.activity-icon {
  font-size: 18px;
}

.activity-details {
  flex-grow: 1;
}

.activity-text {
  font-size: 15px;
  color: var(--text-dark);
  margin-bottom: 5px;
  line-height: 1.4;
}

.activity-text strong {
  font-weight: 600;
}

.activity-time {
  font-size: 13px;
  color: var(--text-light);
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .card-title {
    font-size: 17px;
  }
  .view-all-btn {
    font-size: 13px;
  }
  .activity-icon-wrapper {
    width: 35px;
    height: 35px;
    margin-right: 12px;
  }
  .activity-icon {
    font-size: 16px;
  }
  .activity-text {
    font-size: 14px;
  }
  .activity-time {
    font-size: 12px;
  }
  .activity-list {
      max-height: 300px;
  }
}

@media (max-width: 768px) {
  .card-title {
    font-size: 16px;
  }
  .activity-list {
      max-height: 250px;
  }
}
</style>
