<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="../img/logo (1).png" alt="SakuraHino Logo" class="logo" />
      <span class="app-name">SakuraHino</span>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <!-- General Overview Category -->
        <li class="nav-item">
          <router-link to="/admin/dashboard" class="nav-link" active-class="active">
            <font-awesome-icon icon="fas fa-tachometer-alt" class="nav-icon" />
            Tổng quan
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/statistics" class="nav-link" active-class="active">
            <font-awesome-icon icon="fas fa-chart-bar" class="nav-icon" />
            Thống kê
          </router-link>
        </li>

        <!-- Content Management Section -->
        <li class="nav-item category-title">Quản lý nội dung</li>
        <li class="nav-item">
          <router-link to="/admin/vocabulary" class="nav-link" active-class="active">
            <font-awesome-icon icon="fas fa-language" class="nav-icon" />
            Từ vựng & Flashcard
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/grammar" class="nav-link" active-class="active">
            <font-awesome-icon icon="fas fa-pencil-alt" class="nav-icon" />
            Bài giảng Ngữ pháp
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/exercises" class="nav-link" active-class="active">
            <font-awesome-icon icon="fas fa-dumbbell" class="nav-icon" />
            Bài tập & Luyện tập
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/listening" class="nav-link" active-class="active">
            <font-awesome-icon icon="fas fa-headphones-alt" class="nav-icon" />
            Audio & Luyện nghe
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/exams" class="nav-link" active-class="active">
            <font-awesome-icon icon="fas fa-file-signature" class="nav-icon" />
            Đề thi & Kiểm tra
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/manga-dialogue" class="nav-link" active-class="active">
            <font-awesome-icon icon="fas fa-comments" class="nav-icon" />
            Giải trí
          </router-link>
        </li>

        <!-- User Management Section -->
        <li class="nav-item category-title">Quản lý người dùng</li>
        <li class="nav-item">
          <router-link to="/admin/users" class="nav-link" active-class="active">
            <font-awesome-icon icon="fas fa-user-friends" class="nav-icon" />
            Học viên
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/packages" class="nav-link" active-class="active">
            <font-awesome-icon icon="fas fa-box-open" class="nav-icon" />
            Quản lý Gói & Đăng ký
          </router-link>
        </li>

        <!-- Reports & Statistics Section -->
        <li class="nav-item category-title">Báo cáo & Thống kê</li>
        <li class="nav-item">
            <router-link to="/admin/reports/general" class="nav-link" active-class="active">
                <font-awesome-icon icon="fas fa-chart-line" class="nav-icon" />
                Báo cáo tổng quan
            </router-link>
        </li>

        <!-- System Settings Section -->
        <li class="nav-item category-title">Cài đặt hệ thống</li>
        <li class="nav-item">
            <router-link to="/admin/settings/general" class="nav-link" active-class="active">
                <font-awesome-icon icon="fas fa-cog" class="nav-icon" />
                Cài đặt chung
            </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Sidebar',
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
  height: 100vh; /* Full height of viewport */
  position: sticky; /* Keeps sidebar fixed when scrolling */
  top: 0;
  overflow-y: auto; /* Allows content within sidebar to scroll */
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
  border-radius: var(--border-radius-tag); /* Small radius for logo background */
}

.app-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark);
}

.sidebar-nav {
  flex-grow: 1; /* Navigation takes up remaining space */
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
  width: 20px; /* Fixed width for consistent icon alignment */
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

/* Responsive adjustments */
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
    display: none; /* Hide category titles on smaller screens */
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
