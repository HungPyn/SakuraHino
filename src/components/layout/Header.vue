<template>
  <header class="admin-header">
    <!-- <div class="search-bar">
      <font-awesome-icon icon="fas fa-search" class="search-icon" />
      <input type="text" placeholder="Tìm kiếm..." class="search-input" />
    </div> -->

    <div class="header-right">
      <span class="current-date">{{ currentDate }}</span>

      <!-- Custom Dropdown -->
      <div class="dropdown-wrapper" ref="dropdownRef">
        <button class="btn user-profile" @click="toggleDropdown">
          <img src="../img/admin_picture.png" alt="Admin" class="user-avatar" />
          <div class="user-info ms-2 text-start">
            <span class="user-name">Admin</span>
            <span class="user-role text-muted">Quản trị viên</span>
          </div>
        </button>

        <ul v-if="showDropdown" class="dropdown-menu dropdown-menu-end show">
          <li>
            <button class="dropdown-item" @click="logout">Đăng xuất</button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "vue-router";
import authService from "../../services/authService";

const router = useRouter();
const currentDate = ref("");
const showDropdown = ref(false);
const dropdownRef = ref(null);

const updateDate = () => {
  currentDate.value = format(new Date(), "EEEE, 'Ngày' dd 'Tháng' MM, yyyy", {
    locale: vi,
  });
};

const logout = async () => {
  await authService.logOut();
  router.push("/");
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  updateDate();
  window.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.admin-header {
  display: flex;
  justify-content: flex-end; /* đẩy tất cả về phải */
  align-items: center;
  background-color: var(--card-background);
  padding: 15px 30px;
  border-radius: var(--border-radius-card);
  box-shadow: 0 2px 8px var(--shadow-light);
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 15px;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: var(--background-light);
  border-radius: var(--border-radius-button);
  padding: 10px 15px;
  width: 300px;
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
  flex-grow: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 25px;
}

.current-date {
  font-size: 15px;
  color: var(--text-medium);
  font-weight: 500;
  white-space: nowrap;
}

.dropdown-wrapper {
  position: relative;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color);
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: left;
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

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 1000;
  display: block;
  min-width: 160px;
  margin-top: 10px;
  padding: 0.5rem 0;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 10px 20px;
  font-size: 14px;
  color: var(--text-dark);
  cursor: pointer;
  background: none;
  border: none;
  text-align: left;
  width: 100%;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}
</style>
