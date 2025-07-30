<template>
  <header class="admin-header">
    <div class="search-bar">
      <font-awesome-icon icon="fas fa-search" class="search-icon" />
      <input type="text" placeholder="Tìm kiếm..." class="search-input" />
    </div>
    <div class="header-right">
      <span class="current-date">{{ currentDate }}</span>
      <div class="icon-buttons"></div>

      <!-- Dropdown Bootstrap -->
      <div class="dropdown">
        <div
          class="user-profile dropdown-toggle d-flex align-items-center"
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style="cursor: pointer"
        >
          <img
            src="../img/admin_picture.png"
            alt="Admin Avatar"
            class="user-avatar"
            style="width: 40px; height: 40px; border-radius: 50%"
          />
          <div class="user-info ms-2">
            <span class="user-name d-block">Admin</span>
            <span class="user-role d-block text-muted">Quản trị viên</span>
          </div>
        </div>
        <!-- Dropdown Menu -->
        <ul
          class="dropdown-menu dropdown-menu-end"
          aria-labelledby="userDropdown"
        >
          <li>
            <button class="dropdown-item" @click="logout">Đăng xuất</button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import authService from "../../services/authService";
import { useRouter } from "vue-router";

const router = useRouter();

const currentDate = ref("");
let intervalId = null;

const updateDate = () => {
  currentDate.value = format(new Date(), "EEEE, 'Ngày' dd 'Tháng' MM,yyyy", {
    locale: vi,
  });
};
const logout = async () => {
  await authService.logOut();
  router.push("/");
};

onMounted(() => {
  updateDate();
  intervalId = setInterval(updateDate, 60000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between; /* Space out search bar and right section */
  align-items: center;
  background-color: var(--card-background);
  padding: 25px 30px; /* Generous padding */
  border-radius: var(--border-radius-card);
  box-shadow: 0 2px 8px var(--shadow-light);
  margin-bottom: 30px; /* Space below the header */
  flex-wrap: wrap; /* Allows items to wrap on smaller screens */
  gap: 15px; /* Gap between elements when wrapped */
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: var(
    --background-light
  ); /* Light background for search bar */
  border-radius: var(--border-radius-button);
  padding: 10px 15px;
  width: 300px; /* Fixed width for search bar for consistency */
}

.search-icon {
  color: var(--text-light);
  margin-right: 10px;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  color: var(--text-dark);
  flex-grow: 1; /* Allows input to fill available space */
  padding: 0;
}

.search-input::placeholder {
  color: var(--text-medium);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 25px; /* Space between date, icon buttons, and user profile */
}

.current-date {
  font-size: 15px;
  color: var(--text-medium);
  font-weight: 500;
  white-space: nowrap; /* Prevents date from wrapping */
}

.icon-buttons {
  display: flex;
  gap: 15px; /* Space between notification and question icons */
}

.icon-button {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-circle); /* Perfect circle buttons */
  background-color: var(--background-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--text-medium);
  transition: background-color 0.2s, color 0.2s;
}

.icon-button:hover {
  background-color: var(--border-color);
  color: var(--primary-color);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(
    --primary-color
  ); /* Primary color for notification badge */
  color: var(--text-white);
  font-size: 10px;
  font-weight: 700;
  border-radius: var(--border-radius-circle);
  padding: 3px 6px;
  min-width: 20px; /* Ensures badge is visible even for single digit */
  text-align: center;
  line-height: 1; /* Vertically centers text */
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px; /* Space between avatar and text */
  cursor: pointer;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: var(--border-radius-circle);
  object-fit: cover;
  border: 2px solid var(--border-color); /* Subtle border around avatar */
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
}

.user-role {
  font-size: 13px;
  color: var(--text-light);
}

.dropdown-icon {
  font-size: 14px;
  color: var(--text-medium);
  margin-left: 5px;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .search-bar {
    width: 250px; /* Slightly smaller search bar on medium screens */
  }
  .header-right {
    gap: 20px;
  }
  .current-date {
    font-size: 14px;
  }
  .icon-button {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }
  .user-avatar {
    width: 40px;
    height: 40px;
  }
  .user-name {
    font-size: 15px;
  }
  .user-role {
    font-size: 12px;
  }
  .admin-header {
    padding: 20px 25px; /* Adjust header padding */
  }
}

@media (max-width: 992px) {
  .admin-header {
    flex-direction: column; /* Stack items vertically on tablets */
    align-items: flex-start; /* Align stacked items to the left */
    padding: 15px 20px; /* Adjust padding */
  }
  .search-bar {
    width: 100%; /* Full width search bar */
    margin-bottom: 15px;
  }
  .header-right {
    width: 100%; /* Full width for right section */
    justify-content: space-between; /* Distribute items horizontally */
    gap: 15px;
  }
  .current-date {
    order: 1; /* Puts date first in its group */
    margin-right: auto; /* Pushes other items to the right */
  }
  .user-profile {
    order: 3; /* Puts user profile last */
    margin-left: 0; /* Reset margin */
  }
  .icon-buttons {
    order: 2; /* Keeps icon buttons in the middle */
    margin-left: auto; /* Pushes icon buttons to the right */
  }
}

@media (max-width: 768px) {
  .admin-header {
    padding: 10px 15px;
  }
  .search-bar {
    padding: 8px 12px;
  }
  .search-input {
    font-size: 14px;
  }
  .current-date {
    font-size: 13px;
  }
  .user-avatar {
    width: 35px;
    height: 35px;
  }
  .user-name {
    font-size: 14px;
  }
  .user-role {
    font-size: 11px;
  }
  .icon-button {
    width: 30px;
    height: 30px;
    font-size: 15px;
  }
  .notification-badge {
    font-size: 9px;
    padding: 2px 5px;
    min-width: 18px;
  }
}
</style>
