<template>
  <div class="login-right-panel">
    <div class="login-content-wrapper">
      <h2 class="login-title">Đăng nhập Admin</h2>
      <p class="login-subtitle">Nhập thông tin để tiếp tục</p>

      <div class="admin-role-badge">QUẢN TRỊ VIÊN</div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Tên đăng nhập</label>
          <div class="input-with-icon">
            <i class="input-icon icon-user-circle"></i>
            <input
              type="text"
              id="username"
              v-model="username"
              placeholder="Nhập tên đăng nhập"
              required
              class="form-control"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <div class="input-with-icon">
            <i class="input-icon icon-lock"></i>
            <input
              :type="passwordFieldType"
              id="password"
              v-model="password"
              placeholder="Nhập mật khẩu"
              required
              class="form-control"
            />
            <i
              :class="[
                'toggle-password-icon',
                showPassword ? 'icon-eye-slash' : 'icon-eye',
              ]"
              @click="togglePasswordVisibility"
            ></i>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" /> Ghi nhớ đăng nhập
          </label>
          <a href="#" class="forgot-password">Quên mật khẩu?</a>
        </div>

        <button type="submit" class="btn btn-login">Đăng nhập</button>
      </form>

      <div class="divider">
        <span>Chức năng chính</span>
      </div>

      <div class="main-functions">
        <div class="function-item">
          <i class="function-icon icon-users-alt"></i>
          <span>Học viên</span>
        </div>
        <div class="function-item">
          <i class="function-icon icon-book"></i>
          <span>Bài học</span>
        </div>
        <div class="function-item">
          <i class="function-icon icon-chart-line"></i>
          <span>Báo cáo</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import authService from "@/services/authService";
import { jwtDecode } from "jwt-decode"; // ✅ ĐÚNG với phiên bản mới
import { useToast } from "vue-toastification";

const toast = useToast(); // Sử dụng Toast từ thư viện toastify hoặc tương tự
const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);
//ghi nhớ đăng nhập
if (localStorage.getItem("rememberMe") === "true") {
  username.value = localStorage.getItem("username") || "";
  password.value = localStorage.getItem("password") || "";
  rememberMe.value = true;
}
const passwordFieldType = ref("password");

const emits = defineEmits(["login-success"]); // Định nghĩa emit event

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
  passwordFieldType.value = showPassword.value ? "text" : "password";
};

const handleLogin = async () => {
  try {
    const data = await authService.login(username.value, password.value);
    const token = data.token;
    const jwtDecodedToken = jwtDecode(token);
    const role = jwtDecodedToken.role;
    const userId = jwtDecodedToken.userId;

    if (role === "ADMIN") {
      localStorage.setItem("token", token); // Lưu token vào localStorage
      localStorage.setItem("userId", userId); // Lưu userId vào localStorage
      console.log("Đã lưu token:", localStorage.getItem("token"));
      console.log("Đã lưu User ID:", localStorage.getItem("userId"));
      if (rememberMe.value) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("username", username.value);
        localStorage.setItem("password", password.value);
      } else {
        localStorage.removeItem("rememberMe");
      }
      emits("login-success"); // Gửi event lên component cha
    } else {
      toast.error("Bạn không có quyền truy cập vào trang này!");
      return;
    }
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message);
    toast.error(error.message || "Tên đăng nhập hoặc mật khẩu không đúng!");
  }

  // if (username.value === "Ntrinh" && password.value === "052003") {
  //   alert("Đăng nhập thành công!");
  //   emits("login-success"); // Gửi event lên component cha
  // } else {
  //   alert("Tên đăng nhập hoặc mật khẩu không đúng!");
  // }
};
</script>

<style scoped>
/* Biến màu sắc cho panel bên phải và các phần tử chung */
:root {
  --primary-gradient-start: #8e2de2; /* Tím */
  --primary-gradient-end: #4a00e0; /* Tím đậm hơn */
  --primary-color-light: #f1e9fb; /* Màu tím nhạt cho badge */
  --text-dark: #333;
  --text-light: #666;
  --border-color: #e0e0e0;
  --input-bg: #f9f9f9;
  --button-bg: linear-gradient(to right, #6a0dad, #8e2de2); /* Gradient tím */
  --button-text-color: #fff;
}

.login-right-panel {
  flex: 1; /* Chiếm 1 phần không gian */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #ffffff; /* Nền trắng cho panel này */
  /* Bo góc chỉ ở panel bên phải */
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
}

.login-content-wrapper {
  width: 100%;
  max-width: 400px; /* Giới hạn chiều rộng nội dung bên trong panel */
  text-align: center;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 10px;
}

.login-subtitle {
  color: var(--text-light);
  margin-bottom: 25px;
  font-size: 0.95rem;
}

.admin-role-badge {
  background-color: var(--primary-color-light);
  color: var(--primary-gradient-start);
  font-weight: 600;
  padding: 8px 15px;
  border-radius: 25px;
  display: inline-block;
  margin-bottom: 30px;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  font-size: 1.1rem;
}
/* Placeholder icons for inputs */
.icon-user-circle::before {
  content: "👤";
}
.icon-lock::before {
  content: "🔒";
}
.icon-eye::before {
  content: "👁️";
}
.icon-eye-slash::before {
  content: "🚫";
}

.form-control {
  width: 100%;
  padding: 12px 12px 12px 45px; /* Thêm padding cho icon */
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--input-bg);
  color: var(--text-dark);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-gradient-start);
  box-shadow: 0 0 0 3px rgba(106, 13, 173, 0.1);
}

.toggle-password-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  cursor: pointer;
  font-size: 1.1rem;
  transition: color 0.2s ease;
}

.toggle-password-icon:hover {
  color: var(--text-dark);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  color: var(--text-light);
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.forgot-password {
  color: var(--primary-gradient-start);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-login {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  background: var(--button-bg);
  color: var(--button-text-color);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 5px 15px rgba(var(--primary-gradient-end), 0.3);
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(var(--primary-gradient-end), 0.4);
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 30px 0;
  color: var(--text-light);
  font-size: 0.9rem;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.divider:not(:empty)::before {
  margin-right: 0.25em;
}

.divider:not(:empty)::after {
  margin-left: 0.25em;
}

.main-functions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: var(--text-light);
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.function-item:hover {
  color: var(--primary-gradient-start);
}

.function-icon {
  background-color: var(--primary-color-light);
  color: var(--primary-gradient-start);
  border-radius: 12px;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.2rem;
  margin-bottom: 10px;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.function-item:hover .function-icon {
  background-color: rgba(var(--primary-gradient-start), 0.2);
}
/* Placeholder icons for main functions */
.icon-users-alt::before {
  content: "🧑‍💻";
}
.icon-book::before {
  content: "📚";
}
.icon-chart-line::before {
  content: "📊";
}

/* Responsive adjustments for right panel */
@media (max-width: 992px) {
  .login-right-panel {
    border-radius: 0; /* Bỏ bo góc khi chuyển sang cột */
    border-top-left-radius: 16px; /* Bo góc trên bên trái khi ở dưới */
    border-top-right-radius: 16px; /* Bo góc trên bên phải khi ở dưới */
    padding: 30px 20px;
  }
  .login-title {
    font-size: 1.8rem;
  }
  .form-options {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
}

@media (max-width: 576px) {
  .login-right-panel {
    border-radius: 0; /* Bỏ bo góc hoàn toàn trên màn hình rất nhỏ */
    padding: 20px;
  }
}
</style>
