<template>
  <div class="badge-view-container">
    <div class="badge-header">
      <h1 class="badge-title">
        <i class="bi bi-award-fill text-warning me-2"></i> Quản lý Huy hiệu
      </h1>
      <button class="btn btn-primary btn-add-new" @click="openAddPopup">
        <i class="bi bi-plus-circle me-2"></i> Thêm huy hiệu mới
      </button>
    </div>

    <div class="card badge-toolbar-card mb-4">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div class="search-input-group flex-grow-1 me-3">
          <input
            type="text"
            class="form-control search-input"
            placeholder="Tìm kiếm theo tên hoặc mô tả huy hiệu..."
            v-model="keyword"
            @input="onSearch"
          />
          <i class="bi bi-search search-icon"></i>
        </div>

        <div class="items-per-page-group">
          <label for="itemsPerPage" class="me-2 text-muted">Mục mỗi trang:</label>
          <select id="itemsPerPage" v-model="itemsPerPage" class="form-select form-select-sm" @change="currentPage = 1">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card badge-table-card">
      <div class="card-body p-0">
        <BadgeTable
          :badges="paginatedBadges"
          @edit="openEditPopup"
          @delete="deleteBadge"
          @view="openViewPopup"
        />
      </div>
    </div>

    <div class="d-flex justify-content-center mt-4">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="handlePageChange"
      />
    </div>


    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showPopup" class="modal-backdrop custom-backdrop fade show" @click.self="closePopup"></div>
      </transition>
      <transition name="modal-fade">
        <div v-if="showPopup" class="modal custom-modal" tabindex="-1" style="display: block;">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
              <BadgePopup
                :badge="selectedBadge"
                :mode="popupMode"
                @save="saveBadge"
                @close="closePopup"
              />
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <NotificationToast
      ref="notificationToast"
      :message="toastMessage"
      :type="toastType"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
// import BadgeToolbar from '../badges/BadgeToolbar.vue'; // Toolbar đã được tích hợp vào đây, có thể bỏ import này nếu BadgeToolbar chỉ chứa search và items per page.
import BadgeTable from '../badges/BadgeTable.vue';
import BadgePopup from '../badges/BadgePopup.vue';
import badgeService from '../../services/badgeService';
import NotificationToast from '../share/NotificationToast.vue';
import Pagination from '../share/Pagination.vue';

export default {
  components: {
    // BadgeToolbar, // Nếu bạn đã bỏ component Toolbar, hãy bỏ comment dòng này
    BadgeTable,
    BadgePopup,
    Pagination,
    NotificationToast
  },
  setup() {
    const badges = ref([]);
    const showPopup = ref(false);
    const selectedBadge = ref(null);
    const keyword = ref('');
    const popupMode = ref('add');

    // Pagination states
    const currentPage = ref(1);
    const itemsPerPage = ref(10); // Default items per page

    // Dữ liệu cho Toast Notification
    const notificationToast = ref(null);
    const toastMessage = ref('');
    const toastType = ref('success');

    const loadBadges = async () => {
      try {
        badges.value = await badgeService.getAll();
        // Reset to first page after loading/reloading badges
        // Chỉ reset nếu current page vượt quá tổng số trang mới
        if (currentPage.value > totalPages.value && totalPages.value > 0) {
            currentPage.value = totalPages.value;
        } else if (totalPages.value === 0) { // Nếu không có badge nào
            currentPage.value = 1;
        }
      } catch (error) {
        console.error("Lỗi khi tải huy hiệu:", error);
        showToast('Không thể tải huy hiệu!', 'error');
      }
    };

    const openAddPopup = () => {
      selectedBadge.value = null;
      popupMode.value = 'add';
      showPopup.value = true;
    };

    const openEditPopup = (badge) => {
      selectedBadge.value = { ...badge };
      popupMode.value = 'edit';
      showPopup.value = true;
    };

    const openViewPopup = (badge) => {
      selectedBadge.value = { ...badge };
      popupMode.value = 'detail';
      showPopup.value = true;
    };

    const closePopup = () => {
      showPopup.value = false;
      selectedBadge.value = null;
    };

    const saveBadge = async (badge) => {
      let message = '';
      let success = true;
      try {
        if (badge.id) {
          await badgeService.update(badge);
          message = 'Cập nhật huy hiệu thành công!';
        } else {
          // Gán một ID tạm thời nếu backend không tự tạo ID
          // Trong môi trường thực tế, ID sẽ được trả về từ server
          // Đây là logic giả định cho frontend
          const newId = badges.value.length > 0 ? Math.max(...badges.value.map(b => b.id)) + 1 : 1;
          await badgeService.add({ ...badge, id: newId });
          message = 'Thêm huy hiệu mới thành công!';
        }
        await loadBadges();
      } catch (error) {
        console.error("Lỗi khi lưu huy hiệu:", error);
        message = 'Lưu huy hiệu thất bại!';
        success = false;
      } finally {
        closePopup();
        showToast(message, success ? 'success' : 'error');
      }
    };

    const deleteBadge = async (id) => {
      if (confirm('Bạn có chắc muốn xóa huy hiệu này?')) {
        let message = '';
        let success = true;
        try {
          await badgeService.remove(id);
          message = 'Xóa huy hiệu thành công!';
          // Sau khi xóa, tải lại danh sách và điều chỉnh trang nếu cần
          await loadBadges(); // loadBadges đã có logic điều chỉnh currentPage
        } catch (error) {
          console.error("Lỗi khi xóa huy hiệu:", error);
          message = 'Xóa huy hiệu thất bại!';
          success = false;
        } finally {
          showToast(message, success ? 'success' : 'error');
        }
      }
    };

    const onSearch = () => { // Đã bỏ tham số text vì v-model đã cập nhật keyword.value
      currentPage.value = 1; // Reset to first page on search
    };

    // Filtered badges based on search keyword
    const filteredBadges = computed(() => {
      if (!keyword.value) return badges.value;
      const lowerKeyword = keyword.value.toLowerCase();
      return badges.value.filter((b) =>
        b.name.toLowerCase().includes(lowerKeyword) ||
        (b.description && b.description.toLowerCase().includes(lowerKeyword))
      );
    });

    // Computed properties for pagination
    const totalPages = computed(() => {
      return Math.ceil(filteredBadges.value.length / itemsPerPage.value);
    });

    const paginatedBadges = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredBadges.value.slice(start, end);
    });

    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    const showToast = (message, type = 'success') => {
      toastMessage.value = message;
      toastType.value = type;
      if (notificationToast.value) {
        notificationToast.value.show();
      }
    };

    // Load badges when component is mounted
    loadBadges();

    return {
      badges,
      showPopup,
      selectedBadge,
      keyword,
      popupMode,
      // filteredBadges, // Không cần expose cái này vì paginatedBadges đã sử dụng nó
      currentPage,
      itemsPerPage,
      totalPages,
      paginatedBadges,
      openAddPopup,
      openEditPopup,
      openViewPopup,
      deleteBadge,
      saveBadge,
      closePopup,
      onSearch,
      handlePageChange,
      notificationToast,
      toastMessage,
      toastType
    };
  }
};
</script>

<style scoped>
.badge-view-container {
  padding: 1.5rem 2rem;
  background-color: #f8fafd;
  min-height: calc(100vh - 60px);
}

/* Header Section */
.badge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.badge-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0;
  line-height: 1.2;
}

.btn-add-new {
  background-color: #007bff;
  border-color: #007bff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
}

.btn-add-new:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3);
}

.btn-add-new i {
  font-size: 1.1em;
  vertical-align: middle;
}

/* Toolbar Card (Search Input and Items per page) */
.badge-toolbar-card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  padding: 0.75rem 1.25rem;
}

.search-input-group {
  position: relative;
  max-width: 400px;
}

.search-input {
  border-radius: 0.5rem;
  padding-left: 2.5rem;
  border: 1px solid #ced4da;
  transition: all 0.2s ease;
  height: 45px;
  font-size: 1rem;
  color: #495057;
}

.search-input:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  outline: none;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
}

.items-per-page-group {
    display: flex;
    align-items: center;
    margin-left: auto; /* Push to the right */
}

.items-per-page-group .form-select {
    width: auto; /* Auto width based on content */
    min-width: 80px; /* Minimum width for select */
    border-radius: 0.5rem;
    height: 45px; /* Match search input height */
    font-size: 1rem;
    padding-left: 0.75rem;
    padding-right: 2rem; /* Space for dropdown arrow */
}


/* Table Card */
.badge-table-card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

/* Override default Bootstrap modal styling for custom look */
.custom-modal.modal {
  background-color: transparent; /* Remove default modal background */
  pointer-events: none; /* Allow clicks to pass through initially */
  opacity: 0; /* Hidden by default */
  transition: opacity 0.3s ease;
  display: flex; /* Use flexbox for centering */
  align-items: center;
  justify-content: center;
}

/* Show modal */
.custom-modal.modal[style*="display: block"] {
  opacity: 1;
  pointer-events: auto; /* Re-enable pointer events when shown */
}

.custom-modal .modal-dialog {
  max-width: 90%;
  transform: translateY(-50px); /* Initial transform for animation */
  opacity: 0; /* Initial opacity for animation */
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  pointer-events: none; /* Disable pointer events on dialog until shown */
}

/* Show modal-dialog when custom-modal has display: block */
.custom-modal.modal[style*="display: block"] .modal-dialog {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto; /* Enable pointer events when shown */
}

/* Custom backdrop */
.modal-backdrop.custom-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  z-index: 1040; /* Lower than modal */
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-backdrop.custom-backdrop.show {
  opacity: 1;
}

.custom-modal .modal-content {
  border-radius: 1rem;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Transition for Teleport (optional but good for consistency) */
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


/* Responsive adjustments */
@media (max-width: 768px) {
  .badge-view-container {
    padding: 1rem;
  }
  .badge-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  .badge-title {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }
  .btn-add-new {
    width: 100%;
    text-align: center;
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
  .badge-toolbar-card .card-body {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input-group {
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
    margin-right: 0 !important; /* Override me-3 */
  }
  .items-per-page-group {
    width: 100%;
    margin-left: 0; /* Remove auto margin */
    justify-content: flex-end; /* Align right on small screens */
  }
  .items-per-page-group label {
      white-space: nowrap; /* Prevent label from wrapping */
  }
  .items-per-page-group .form-select {
      flex-grow: 0; /* Don't grow */
      max-width: 120px; /* Limit width of select box */
  }
}

@media (max-width: 576px) {
  .badge-title {
    font-size: 1.5rem;
  }
}
</style>