<template>
  <div class="community-view-container">
    <div class="page-title-section mb-4">
      <h1 class="page-title"><i class="bi bi-people-fill me-2"></i> Quản lý Cộng đồng</h1>
    
    </div>

    <div class="content-tabs mb-4">
      <ul class="nav nav-tabs custom-tabs">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'users' }" @click="setActiveTab('users')">
            <i class="bi bi-person-fill me-2"></i> Thành viên
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'violated-posts' }" @click="setActiveTab('violated-posts')">
            <i class="bi bi-file-earmark-ruled-fill me-2"></i> Bài viết vi phạm
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'suspicious-users' }" @click="setActiveTab('suspicious-users')">
            <i class="bi bi-patch-exclamation-fill me-2"></i> Người dùng đáng ngờ
          </a>
        </li>
      </ul>
    </div>

    <div class="tab-content custom-tab-content">
      <div v-if="activeTab === 'users'" class="tab-pane fade show active">
        <CommunityToolbar @search="handleUserSearch" />
        <CommunityTable
          :users="paginatedUsers"
          @edit="openEditUserPopup"
          @delete="confirmUserDelete"
        />
        <Pagination
          :current-page="userCurrentPage"
          :total-pages="userTotalPages"
          @page-changed="userCurrentPage = $event"
          class="mt-4"
        />
      </div>

      <div v-if="activeTab === 'violated-posts'" class="tab-pane fade show active">
        <CommunityToolbar @search="handleViolatedPostSearch" />
        <ViolatedPostsTable
          :posts="paginatedViolatedPosts"
          @viewDetails="openViewViolatedPostPopup"
          @resolve="confirmResolvePost"
          @reject="confirmRejectPost"
          @delete="confirmViolatedPostDelete"
        />
        <Pagination
          :current-page="violatedPostCurrentPage"
          :total-pages="violatedPostTotalPages"
          @page-changed="violatedPostCurrentPage = $event"
          class="mt-4"
        />
      </div>

      <div v-if="activeTab === 'suspicious-users'" class="tab-pane fade show active">
        <CommunityToolbar @search="handleSuspiciousUserSearch" />
        <SuspiciousUsersTable
          :users="paginatedSuspiciousUsers"
          @viewDetails="openViewSuspiciousUserPopup"
          @ban="confirmBanUser"
          @clear="confirmClearUser"
          @delete="confirmSuspiciousUserDelete"
        />
        <Pagination
          :current-page="suspiciousUserCurrentPage"
          :total-pages="suspiciousUserTotalPages"
          @page-changed="suspiciousUserCurrentPage = $event"
          class="mt-4"
        />
      </div>
    </div>

    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showUserPopup" class="modal custom-modal" tabindex="-1" :class="{ 'show-modal': showUserPopup }" @click.self="closeUserPopup">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <CommunityPopup
              :user="selectedUser"
              @close="closeUserPopup"
              @save="saveUser"
            />
          </div>
        </div>
      </transition>
    </Teleport>

    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showViolatedPostPopup" class="modal custom-modal" tabindex="-1" :class="{ 'show-modal': showViolatedPostPopup }" @click.self="closeViolatedPostPopup">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <ViolatedPostPopup
              :post="selectedViolatedPost"
              @close="closeViolatedPostPopup"
              @resolve="resolvePost"
              @reject="rejectPost"
              @delete="deleteViolatedPost"
            />
          </div>
        </div>
      </transition>
    </Teleport>

    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showSuspiciousUserPopup" class="modal custom-modal" tabindex="-1" :class="{ 'show-modal': showSuspiciousUserPopup }" @click.self="closeSuspiciousUserPopup">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <SuspiciousUserPopup
              :user="selectedSuspiciousUser"
              @close="closeSuspiciousUserPopup"
              @ban="banUser"
              @clear="clearUser"
              @delete="deleteSuspiciousUser"
            />
          </div>
        </div>
      </transition>
    </Teleport>

    <NotificationToast
      :message="notificationMessage"
      :type="notificationType"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import CommunityToolbar from '../community/CommunityToolbar.vue';
import CommunityTable from '../community/CommunityTable.vue';
import CommunityPopup from '../community/CommunityPopup.vue';
import ViolatedPostsTable from '../community/ViolatedPostsTable.vue';
import ViolatedPostPopup from '../community/ViolatedPostPopup.vue';
import SuspiciousUsersTable from '../community/SuspiciousUsersTable.vue';
import SuspiciousUserPopup from '../community/SuspiciousUserPopup.vue'; 
import Pagination from '../share/Pagination.vue';
import NotificationToast from '../share/NotificationToast.vue';

import { communityUsers, violatedPosts, suspiciousUsers } from '../../services/communityService';

export default {
  components: {
    CommunityToolbar,
    CommunityTable,
    CommunityPopup,
    ViolatedPostsTable,
    ViolatedPostPopup,
    SuspiciousUsersTable,
    SuspiciousUserPopup,
    Pagination,
    NotificationToast,
  },
  setup() {
    const activeTab = ref('users'); // 'users', 'violated-posts', 'suspicious-users'

    // Notification State
    const notificationMessage = ref('');
    const notificationType = ref('success');

    const showNotification = (message, type = 'success') => {
      notificationMessage.value = ''; // Clear first to ensure watch triggers
      notificationType.value = type;
      notificationMessage.value = message;
    };

    // Hàm để reset trang về 1 khi đổi tab
    const setActiveTab = (tabName) => {
      activeTab.value = tabName;
      // Reset current page for the newly active tab
      if (tabName === 'users') {
        userCurrentPage.value = 1;
      } else if (tabName === 'violated-posts') {
        violatedPostCurrentPage.value = 1;
      } else if (tabName === 'suspicious-users') {
        suspiciousUserCurrentPage.value = 1;
      }
    };


    // --- Community Users Logic ---
    const users = ref(communityUsers);
    const userSearchKeyword = ref('');
    const showUserPopup = ref(false);
    const selectedUser = ref(null); // Dùng cho sửa

    const userItemsPerPage = 10;
    const userCurrentPage = ref(1);

    const filteredUsers = computed(() => {
      if (!userSearchKeyword.value) {
        return users.value;
      }
      const lowerKeyword = userSearchKeyword.value.toLowerCase();
      return users.value.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerKeyword) ||
          user.email.toLowerCase().includes(lowerKeyword)
      );
    });

    const userTotalPages = computed(() => {
      return Math.ceil(filteredUsers.value.length / userItemsPerPage);
    });

    const paginatedUsers = computed(() => {
      const start = (userCurrentPage.value - 1) * userItemsPerPage;
      const end = start + userItemsPerPage;
      return filteredUsers.value.slice(start, end);
    });

    const handleUserSearch = (keyword) => {
      userSearchKeyword.value = keyword;
      userCurrentPage.value = 1; // Reset về trang 1 khi tìm kiếm
    };

    const openEditUserPopup = (user) => {
      selectedUser.value = user; // Truyền đối tượng người dùng để chỉnh sửa
      showUserPopup.value = true;
    };

    const closeUserPopup = () => {
      showUserPopup.value = false;
      selectedUser.value = null;
    };

    const saveUser = (userToSave) => {
      // Logic chỉ còn cho chỉnh sửa
      if (userToSave.id) {
        const index = users.value.findIndex((u) => u.id === userToSave.id);
        if (index !== -1) {
          users.value[index] = { ...userToSave };
          showNotification('Cập nhật thành viên thành công!', 'success');
        } else {
          showNotification('Lỗi: Không tìm thấy ID thành viên để cập nhật.', 'error');
        }
      } else {
        showNotification('Lỗi: ID thành viên không hợp lệ.', 'error');
      }
      closeUserPopup();
    };

    const confirmUserDelete = (userId) => {
      if (confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
        deleteUser(userId);
      } else {
        showNotification('Hủy thao tác xóa thành viên.', 'info');
      }
    };

    const deleteUser = (userId) => {
      const initialLength = users.value.length;
      users.value = users.value.filter((user) => user.id !== userId);
      if (users.value.length < initialLength) {
        showNotification('Xóa thành viên thành công!', 'success');
        // Adjust current page if last item on page was deleted
        if (paginatedUsers.value.length === 0 && userTotalPages.value > 0 && userCurrentPage.value > userTotalPages.value) {
           userCurrentPage.value = userTotalPages.value; // Chuyển về trang cuối cùng có dữ liệu
        } else if (paginatedUsers.value.length === 0 && userCurrentPage.value > 1) {
            userCurrentPage.value--;
        }
      } else {
        showNotification('Không tìm thấy thành viên để xóa.', 'error');
      }
    };

    // --- Violated Posts Logic ---
    const posts = ref(violatedPosts);
    const violatedPostSearchKeyword = ref('');
    const showViolatedPostPopup = ref(false);
    const selectedViolatedPost = ref(null);
    const violatedPostItemsPerPage = 10;
    const violatedPostCurrentPage = ref(1);

    const filteredViolatedPosts = computed(() => {
      if (!violatedPostSearchKeyword.value) {
        return posts.value;
      }
      const lowerKeyword = violatedPostSearchKeyword.value.toLowerCase();
      return posts.value.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerKeyword) ||
          post.author.toLowerCase().includes(lowerKeyword) ||
          post.reason.toLowerCase().includes(lowerKeyword)
      );
    });

    const violatedPostTotalPages = computed(() => {
      return Math.ceil(filteredViolatedPosts.value.length / violatedPostItemsPerPage);
    });

    const paginatedViolatedPosts = computed(() => {
      const start = (violatedPostCurrentPage.value - 1) * violatedPostItemsPerPage;
      const end = start + violatedPostItemsPerPage;
      return filteredViolatedPosts.value.slice(start, end);
    });

    const handleViolatedPostSearch = (keyword) => {
      violatedPostSearchKeyword.value = keyword;
      violatedPostCurrentPage.value = 1;
    };

    const openViewViolatedPostPopup = (post) => {
      selectedViolatedPost.value = post;
      showViolatedPostPopup.value = true;
    };

    const closeViolatedPostPopup = () => {
      showViolatedPostPopup.value = false;
      selectedViolatedPost.value = null;
    };

    const updatePostStatus = (postId, newStatus, successMsg) => {
      const index = posts.value.findIndex(p => p.id === postId);
      if (index !== -1) {
        posts.value[index].status = newStatus;
        showNotification(successMsg, 'success');
        closeViolatedPostPopup();
      } else {
        showNotification('Không tìm thấy bài viết.', 'error');
      }
    };

    const confirmResolvePost = (postId) => {
      if (confirm('Bạn có chắc chắn muốn đánh dấu bài viết này là đã giải quyết?')) {
        resolvePost(postId);
      } else {
        showNotification('Hủy thao tác giải quyết bài viết.', 'info');
      }
    };

    const resolvePost = (postId) => {
      updatePostStatus(postId, 'resolved', 'Bài viết đã được đánh dấu là đã giải quyết.');
    };

    const confirmRejectPost = (postId) => {
      if (confirm('Bạn có chắc chắn muốn bác bỏ báo cáo của bài viết này?')) {
        rejectPost(postId);
      } else {
        showNotification('Hủy thao tác bác bỏ báo cáo bài viết.', 'info');
      }
    };

    const rejectPost = (postId) => {
      updatePostStatus(postId, 'rejected', 'Báo cáo bài viết đã được bác bỏ.');
    };

    const confirmViolatedPostDelete = (postId) => {
      if (confirm('Bạn có chắc chắn muốn xóa bài viết vi phạm này?')) {
        deleteViolatedPost(postId);
      } else {
        showNotification('Hủy thao tác xóa bài viết vi phạm.', 'info');
      }
    };

    const deleteViolatedPost = (postId) => {
      const initialLength = posts.value.length;
      posts.value = posts.value.filter(post => post.id !== postId);
      if (posts.value.length < initialLength) {
        showNotification('Xóa bài viết vi phạm thành công!', 'success');
        closeViolatedPostPopup();
        if (paginatedViolatedPosts.value.length === 0 && violatedPostTotalPages.value > 0 && violatedPostCurrentPage.value > violatedPostTotalPages.value) {
            violatedPostCurrentPage.value = violatedPostTotalPages.value;
        } else if (paginatedViolatedPosts.value.length === 0 && violatedPostCurrentPage.value > 1) {
            violatedPostCurrentPage.value--;
        }
      } else {
        showNotification('Không tìm thấy bài viết để xóa.', 'error');
      }
    };


    // --- Suspicious Users Logic ---
    const suspiciousUsersList = ref(suspiciousUsers);
    const suspiciousUserSearchKeyword = ref('');
    const showSuspiciousUserPopup = ref(false);
    const selectedSuspiciousUser = ref(null);
    const suspiciousUserItemsPerPage = 10;
    const suspiciousUserCurrentPage = ref(1);

    const filteredSuspiciousUsers = computed(() => {
      if (!suspiciousUserSearchKeyword.value) {
        return suspiciousUsersList.value;
      }
      const lowerKeyword = suspiciousUserSearchKeyword.value.toLowerCase();
      return suspiciousUsersList.value.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerKeyword) ||
          user.email.toLowerCase().includes(lowerKeyword) ||
          user.detectionReason.toLowerCase().includes(lowerKeyword)
      );
    });

    const suspiciousUserTotalPages = computed(() => {
      return Math.ceil(filteredSuspiciousUsers.value.length / suspiciousUserItemsPerPage);
    });

    const paginatedSuspiciousUsers = computed(() => {
      const start = (suspiciousUserCurrentPage.value - 1) * suspiciousUserItemsPerPage;
      const end = start + suspiciousUserItemsPerPage;
      return filteredSuspiciousUsers.value.slice(start, end);
    });

    const handleSuspiciousUserSearch = (keyword) => {
      suspiciousUserSearchKeyword.value = keyword;
      suspiciousUserCurrentPage.value = 1;
    };

    const openViewSuspiciousUserPopup = (user) => {
      selectedSuspiciousUser.value = user;
      showSuspiciousUserPopup.value = true;
    };

    const closeSuspiciousUserPopup = () => {
      showSuspiciousUserPopup.value = false;
      selectedSuspiciousUser.value = null;
    };

    const updateSuspiciousUserStatus = (userId, newStatus, successMsg) => {
      const index = suspiciousUsersList.value.findIndex(u => u.id === userId);
      if (index !== -1) {
        suspiciousUsersList.value[index].status = newStatus;
        showNotification(successMsg, 'success');
        closeSuspiciousUserPopup();
      } else {
        showNotification('Không tìm thấy người dùng.', 'error');
      }
    };

    const confirmBanUser = (userId) => {
      if (confirm('Bạn có chắc chắn muốn cấm người dùng này? Hành động này không thể hoàn tác.')) {
        banUser(userId);
      } else {
        showNotification('Hủy thao tác cấm người dùng.', 'info');
      }
    };

    const banUser = (userId) => {
      updateSuspiciousUserStatus(userId, 'banned', 'Người dùng đã bị cấm thành công.');
    };

    const confirmClearUser = (userId) => {
      if (confirm('Bạn có chắc chắn muốn xóa trạng thái vi phạm của người dùng này?')) {
        clearUser(userId);
      } else {
        showNotification('Hủy thao tác xóa trạng thái vi phạm của người dùng.', 'info');
      }
    };

    const clearUser = (userId) => {
      updateSuspiciousUserStatus(userId, 'cleared', 'Trạng thái vi phạm của người dùng đã được xóa.');
    };

    const confirmSuspiciousUserDelete = (userId) => {
      if (confirm('Bạn có chắc chắn muốn xóa người dùng đáng ngờ này khỏi danh sách? Điều này sẽ không xóa tài khoản người dùng thực tế.')) {
        deleteSuspiciousUser(userId);
      } else {
        showNotification('Hủy thao tác xóa người dùng đáng ngờ.', 'info');
      }
    };

    const deleteSuspiciousUser = (userId) => {
      const initialLength = suspiciousUsersList.value.length;
      suspiciousUsersList.value = suspiciousUsersList.value.filter(user => user.id !== userId);
      if (suspiciousUsersList.value.length < initialLength) {
        showNotification('Xóa người dùng đáng ngờ thành công!', 'success');
        closeSuspiciousUserPopup();
         if (paginatedSuspiciousUsers.value.length === 0 && suspiciousUserTotalPages.value > 0 && suspiciousUserCurrentPage.value > suspiciousUserTotalPages.value) {
            suspiciousUserCurrentPage.value = suspiciousUserTotalPages.value;
        } else if (paginatedSuspiciousUsers.value.length === 0 && suspiciousUserCurrentPage.value > 1) {
            suspiciousUserCurrentPage.value--;
        }
      } else {
        showNotification('Không tìm thấy người dùng đáng ngờ để xóa.', 'error');
      }
    };

    return {
      activeTab,
      setActiveTab, // Thêm hàm này vào return

      users,
      userSearchKeyword,
      showUserPopup,
      selectedUser,
      userCurrentPage,
      userTotalPages,
      paginatedUsers,
      handleUserSearch,
      openEditUserPopup,
      closeUserPopup,
      saveUser,
      confirmUserDelete,

      posts,
      violatedPostSearchKeyword,
      showViolatedPostPopup,
      selectedViolatedPost,
      violatedPostCurrentPage,
      violatedPostTotalPages,
      paginatedViolatedPosts,
      handleViolatedPostSearch,
      openViewViolatedPostPopup,
      closeViolatedPostPopup,
      confirmResolvePost,
      confirmRejectPost,
      confirmViolatedPostDelete,
      resolvePost,
      rejectPost,
      deleteViolatedPost,

      suspiciousUsersList,
      suspiciousUserSearchKeyword,
      showSuspiciousUserPopup,
      selectedSuspiciousUser,
      suspiciousUserCurrentPage,
      suspiciousUserTotalPages,
      paginatedSuspiciousUsers,
      handleSuspiciousUserSearch,
      openViewSuspiciousUserPopup,
      closeSuspiciousUserPopup,
      confirmBanUser,
      confirmClearUser,
      confirmSuspiciousUserDelete,
      banUser,
      clearUser,
      deleteSuspiciousUser,

      notificationMessage,
      notificationType,
    };
  },
};
</script>

<style scoped>
.community-view-container {
  padding: 2rem;
  background-color: #f0f2f5;
  min-height: calc(100vh - 80px); /* Adjust based on your header/footer */
  color: #344767;
}

.page-title-section {
  text-align: left; /* Căn trái */
  margin-bottom: 2.5rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Căn trái */
  margin-bottom: 0.5rem;
}

.page-title i {
  font-size: 2.8rem;
  color: #007bff;
}

.page-description {
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0; /* Bỏ margin auto để căn trái */
}

/* Tabs styling */
.content-tabs {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: flex-start; /* Căn trái */
  border-bottom: none; /* Remove default border */
}

.custom-tabs .nav-item {
  margin: 0 0.5rem;
}

.custom-tabs .nav-link {
  color: #6c757d;
  font-weight: 600;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.custom-tabs .nav-link i {
  font-size: 1.1rem;
  margin-right: 0.5rem;
}

.custom-tabs .nav-link.active {
  color: #007bff;
  background-color: #e9f2ff;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.15);
}

.custom-tabs .nav-link:hover:not(.active) {
  color: #0056b3;
  background-color: #f0f8ff;
}

.custom-tab-content {
  margin-top: 1.5rem; /* Space between tabs and content */
}

/* Modal/Popup specific styles (No backdrop blur) */
.modal.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  background-color: transparent;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Khi popup được hiển thị */
.modal.custom-modal.show-modal {
  opacity: 1;
  pointer-events: auto;
}

.modal.custom-modal .modal-dialog {
  margin: 1.75rem auto;
  max-width: 800px;
  transform: translateY(-50px);
  opacity: 0;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  pointer-events: none;
  z-index: 1051;
}

/* Khi modal wrapper có class show-modal (tức là popup đang hiển thị) thì dialog mới hiện ra */
.modal.custom-modal.show-modal .modal-dialog {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}

/* Vẫn giữ nguyên transition cho hiệu ứng */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-dialog,
.modal-fade-leave-active .modal-dialog {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.modal-fade-enter-from .modal-dialog {
  transform: translateY(-50px);
  opacity: 0;
}
.modal-fade-leave-to .modal-dialog {
  transform: translateY(-50px);
  opacity: 0;
}

@media (max-width: 992px) {
  .page-title {
    font-size: 2rem;
  }
  .page-title i {
    font-size: 2.2rem;
  }
  .page-description {
    font-size: 1rem;
  }
  .custom-tabs .nav-link {
    padding: 0.7rem 1.2rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .community-view-container {
    padding: 1rem;
  }
  .page-title {
    font-size: 1.8rem;
    flex-direction: column; /* Giữ nguyên flex-direction column cho responsive nếu muốn icon nằm trên text */
    text-align: left; /* Căn trái */
    align-items: flex-start; /* Căn trái */
  }
  .page-title i {
    font-size: 2rem;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  .page-description {
    font-size: 0.9rem;
  }
  .content-tabs {
    flex-direction: column;
    padding: 0.5rem;
    align-items: flex-start; /* Căn trái */
  }
  .custom-tabs .nav-item {
    margin: 0.2rem 0;
    width: 100%;
  }
  .custom-tabs .nav-link {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    justify-content: flex-start; /* Căn trái */
  }
}
</style>