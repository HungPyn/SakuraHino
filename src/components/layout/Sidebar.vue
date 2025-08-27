<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="../img/logo (1).png" alt="SakuraHino Logo" class="logo" />
      <span class="app-name">SakuraHino</span>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <!-- General Overview Category -->
        <!-- <li class="nav-item">
          <router-link to="/admin/dashboard" class="nav-link" active-class="active">
            <i class="bi bi-speedometer2 nav-icon"></i>
            Tổng quan
          </router-link>
        </li> -->
        <li class="nav-item">
          <router-link
            to="/admin/statistics"
            class="nav-link"
            active-class="active"
          >
            <i class="bi bi-bar-chart-line nav-icon"></i>
            Thống kê
          </router-link>
        </li>

        <!-- Content Management Section -->
        <li class="nav-item category-title">Quản lý nội dung</li>
        <li class="nav-item">
          <router-link to="/admin/topic" class="nav-link" active-class="active">
            <i class="bi bi-journal-text nav-icon"></i>
            Chủ đề
          </router-link>
        </li>
        <!-- <li class="nav-item">
          <router-link
            to="/admin/personal-path"
            class="nav-link"
            active-class="active"
          >
            <i class="bi bi-map nav-icon"></i>
            Lộ trình học cá nhân
          </router-link>
        </li> -->
        <!-- <li class="nav-item">
          <router-link
            to="/admin/badges"
            class="nav-link"
            active-class="active"
          >
            <i class="bi bi-award nav-icon"></i>
            Huy hiệu người dùng
          </router-link>
        </li> -->
        <!-- <li class="nav-item">
          <router-link
            to="/admin/reminders"
            class="nav-link"
            active-class="active"
          >
            <i class="bi bi-bell nav-icon"></i>
            Nhắc nhở
          </router-link>
        </li> -->
        <!-- <li class="nav-item">
          <router-link to="/admin/entertainment" class="nav-link" active-class="active">
            <i class="bi bi-controller nav-icon"></i>
            Giải trí
          </router-link>
        </li> -->
        <li class="nav-item">
          <router-link
            to="/admin/learningHistory"
            class="nav-link"
            active-class="active"
          >
            <i class="bi bi-clock-history nav-icon"></i>
            Lịch sử học tập
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            to="/admin/character"
            class="nav-link"
            active-class="active"
          >
            <i class="bi bi-pencil-square nav-icon"></i>
            Luyện viết
          </router-link>
        </li>

        <!-- <li class="nav-item">
  <router-link
    to="/admin/exam"
    class="nav-link"
    active-class="active"
  >
    <i class="bi bi-journal-check nav-icon"></i>
   Thi
  </router-link>
</li> -->

        <!-- <li class="nav-item">
          <router-link
            to="/admin/community"
            class="nav-link"
            active-class="active"
          >
            <i class="bi bi-people nav-icon"></i>
            Cộng đồng
          </router-link>
        </li> -->

        <!-- User Management Section -->
        <li class="nav-item category-title">Quản lý người dùng</li>
        <li class="nav-item">
          <router-link to="/admin/user" class="nav-link" active-class="active">
            <i class="bi bi-person nav-icon"></i>
            Quản lý người dùng
          </router-link>
        </li>
        <!-- <li class="nav-item">
          <router-link
            to="/admin/packages"
            class="nav-link"
            active-class="active"
          >
            <i class="bi bi-box-seam nav-icon"></i>
            Quản lý Gói & Đăng ký
          </router-link>
        </li> -->

        <!-- System Settings Section
        <li class="nav-item category-title">Cài đặt hệ thống</li>
        <li class="nav-item">
          <router-link
            to="/admin/settings-general"
            class="nav-link"
            active-class="active"
          >
            <i class="bi bi-gear nav-icon"></i>
            Cài đặt chung
          </router-link>
        </li> -->
      </ul>
    </nav>
  </aside>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Sidebar",
});
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: var(--card-background);
  border-right: 1px solid var(--border-color);
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 10px;
}

.logo {
  height: 45px;
  width: auto;
  margin-right: 15px;
  border-radius: var(--border-radius-tag);
}

.app-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark);
}

.sidebar-nav {
  flex-grow: 1;
}

.nav-item {
  margin-bottom: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-radius: var(--border-radius-button);
  color: var(--text-medium);
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.nav-icon {
  font-size: 18px;
  margin-right: 15px;
  width: 20px;
  text-align: center;
}

.category-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-light);
  text-transform: uppercase;
  margin-top: 25px;
  margin-bottom: 15px;
  padding: 0 15px;
}

@media (max-width: 992px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding: 20px;
  }
  .sidebar-header {
    justify-content: center;
    margin-bottom: 20px;
  }
  .sidebar-nav ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px 15px;
  }
  .sidebar-nav li {
    flex-basis: auto;
  }
  .category-title {
    display: none;
  }
  .nav-link {
    font-size: 15px;
    padding: 8px 12px;
  }
  .nav-icon {
    font-size: 16px;
    margin-right: 10px;
  }
}

@media (max-width: 768px) {
  .logo {
    height: 35px;
  }
  .app-name {
    font-size: 20px;
  }
  .sidebar-header {
    margin-bottom: 15px;
  }
  .sidebar-nav ul {
    gap: 8px 10px;
  }
  .nav-link {
    font-size: 14px;
    padding: 7px 10px;
  }
  .nav-icon {
    font-size: 15px;
    margin-right: 8px;
  }
}
</style>
