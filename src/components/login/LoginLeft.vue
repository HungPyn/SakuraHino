<template>
  <div class="login-left-panel">
    <div class="logo-container">
      <img src="../img/download.png" alt="Home Icon" class="home-icon" />
    </div>
    <!-- <h2 class="welcome-title">Chào mừng quay trở lại!</h2> -->
    <p class="welcome-text">
     SakuraHino
    </p>
    <ul class="features-list">
      <li><i class="feature-icon icon-users"></i> Quản lý học viên hiệu quả</li>
      <li><i class="feature-icon icon-edit"></i> Tạo và chỉnh sửa bài học</li>
      <li><i class="feature-icon icon-chart"></i> Theo dõi tiến độ học tập</li>
      <li><i class="feature-icon icon-report"></i> Báo cáo chi tiết và thống kê</li>
    </ul>
  </div>
</template>

<script setup>
// Không có logic JavaScript trong component này
</script>

<style scoped>
.login-left-panel {
  flex: 1;
  background: linear-gradient(135deg, #7f7fd5, #86a8e7, #91eae4);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  position: relative;
  overflow: hidden;
}

.home-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.welcome-title {
  font-size: 2.5rem;
  margin-bottom: 15px;
  font-weight: 700;
  line-height: 1.2;
}

.welcome-text {
  font-size: 1.8rem;
  line-height: 1.6;
  margin-bottom: 30px;
  max-width: 400px;
  opacity: 0.9;
  color: rgb(216, 112, 181);
  margin-bottom: 15px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  width: 100%;
  max-width: 350px;
}

.features-list li {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 1rem;
  font-weight: 500;
}

.feature-icon {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.icon-users::before { content: "👥"; }
.icon-edit::before { content: "✍️"; }
.icon-chart::before { content: "📈"; }
.icon-report::before { content: "📄"; }
</style>