<template>
  <div class="login-page-wrapper">
    <div class="login-container">
      <LoginLeft />
      <LoginRight @login-success="handleLoginSuccess" />
    </div>
  </div>
</template>

<script setup>
import LoginLeft from '@/components/login/LoginLeft.vue';
import LoginRight from '@/components/login/LoginRight.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLoginSuccess = () => {
  localStorage.setItem('isLogin', 'true');
  router.push('/admin/dashboard');
};
</script>

<style scoped>
/* Container tổng thể để căn giữa và có nền nhẹ */
.login-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5; /* Nền nhẹ toàn trang */
  padding: 20px; /* Padding nhỏ nếu màn hình nhỏ hơn max-width */
}

.login-container {
  display: flex;
  background-color: #ffffff; /* Nền trắng cho toàn bộ card */
  border-radius: 16px;
  overflow: hidden; /* Quan trọng để bo góc và bóng đổ hoạt động đúng */
  max-width: 900px; /* Kích thước tổng thể phù hợp với hình */
  width: 100%; /* Đảm bảo nó chiếm đủ chiều rộng trong max-width */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* Bóng đổ nhẹ hơn và lan rộng hơn */
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .login-container {
    flex-direction: column; /* Chuyển sang cột trên màn hình nhỏ */
    max-width: 450px; /* Chỉ giữ chiều rộng của panel phải */
  }
}

@media (max-width: 576px) {
  .login-page-wrapper {
    padding: 0;
  }
  .login-container {
    border-radius: 0; /* Bỏ bo góc trên màn hình rất nhỏ */
    height: 100vh; /* Chiếm toàn bộ chiều cao */
    max-width: 100%;
  }
}
</style>