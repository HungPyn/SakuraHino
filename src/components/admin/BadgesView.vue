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
      <div class="card-body d-flex align-items-center justify-content-between flex-wrap">
        <div class="search-input-group flex-grow-1 me-3 mb-2 mb-md-0">
          <input
            type="text"
            class="form-control search-input"
            placeholder="Tìm kiếm theo tên hoặc mô tả huy hiệu..."
            v-model="keyword"
            @input="onSearch"
          />
          <i class="bi bi-search search-icon"></i>
        </div>

        <BadgeFilter
          v-model:filterType="filterType"
          v-model:filterStatus="filterStatus"
          v-model:filterDateRange="filterDateRange"
          @reset-filters="resetAdvancedFilters"
        />

        <!-- <div class="items-per-page-group ms-md-3">
          <label for="itemsPerPage" class="me-2 text-muted">Mục mỗi trang:</label>
          <select id="itemsPerPage" v-model="itemsPerPage" class="form-select form-select-sm" @change="currentPage = 1">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div> -->
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
        <p v-if="paginatedBadges.length === 0" class="text-center text-muted py-4 m-0">Không có huy hiệu nào phù hợp với bộ lọc.</p>
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

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import badgeService from '../../services/badgeService'; // Đảm bảo import đúng service
import BadgeFilter from '../badges/BadgeFilter.vue'; // Component bộ lọc cho huy hiệu
import BadgeTable from '../badges/BadgeTable.vue'; // Component bảng hiển thị huy hiệu
import BadgePopup from '../badges/BadgePopup.vue'; // Component popup thêm/sửa/xem huy hiệu
import Pagination from '../share/Pagination.vue'; // Component phân trang
import NotificationToast from '../share/NotificationToast.vue'; // Component toast thông báo

const allBadges = ref([]);
const keyword = ref('');
const filterType = ref('all');
const filterStatus = ref('all');
const filterDateRange = ref('all'); // Bộ lọc thời gian cho huy hiệu
const itemsPerPage = ref(10);
const currentPage = ref(1);
const showPopup = ref(false);
const selectedBadge = ref(null);
const popupMode = ref(''); // 'add', 'edit', 'view'

const notificationToast = ref(null);
const toastMessage = ref('');
const toastType = ref('');

const loadBadges = async () => {
  try {
    allBadges.value = await badgeService.getAll();
  } catch (error) {
    console.error("Lỗi khi tải huy hiệu:", error);
    showToast('Lỗi khi tải huy hiệu.', 'error');
  }
};

const showToast = (message, type) => {
  toastMessage.value = message;
  toastType.value = type;
  notificationToast.value.show();
};

const filteredBadges = computed(() => {
  let filtered = allBadges.value;

  // 1. Lọc theo từ khóa tìm kiếm
  if (keyword.value) {
    const lowerKeyword = keyword.value.toLowerCase();
    filtered = filtered.filter(badge =>
      badge.name.toLowerCase().includes(lowerKeyword) ||
      badge.description.toLowerCase().includes(lowerKeyword)
    );
  }

  // 2. Lọc theo loại (type)
  if (filterType.value !== 'all') {
    filtered = filtered.filter(badge => badge.type === filterType.value);
  }

  // 3. Lọc theo trạng thái (status)
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(badge => badge.status === filterStatus.value);
  }

  // 4. Lọc theo khoảng thời gian tạo (createdAt)
  if (filterDateRange.value !== 'all') {
    const now = new Date();
    let cutOffDate = new Date();

    switch (filterDateRange.value) {
      case 'today':
        cutOffDate.setHours(0, 0, 0, 0);
        break;
      case '7days':
        cutOffDate.setDate(now.getDate() - 7);
        cutOffDate.setHours(0, 0, 0, 0);
        break;
      case '30days':
        cutOffDate.setDate(now.getDate() - 30);
        cutOffDate.setHours(0, 0, 0, 0);
        break;
      case '90days':
        cutOffDate.setDate(now.getDate() - 90);
        cutOffDate.setHours(0, 0, 0, 0);
        break;
      // 'all' đã được xử lý ở if đầu tiên
    }

    filtered = filtered.filter(badge => {
      const badgeDate = new Date(badge.createdAt);
      return badgeDate >= cutOffDate && badgeDate <= now;
    });
  }

  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredBadges.value.length / itemsPerPage.value);
});

const paginatedBadges = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredBadges.value.slice(start, end);
});

const onSearch = () => {
  currentPage.value = 1; // Reset về trang 1 khi tìm kiếm
};

const resetAdvancedFilters = () => {
  filterType.value = 'all';
  filterStatus.value = 'all';
  filterDateRange.value = 'all';
  currentPage.value = 1; // Reset về trang 1 khi đặt lại bộ lọc
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const openAddPopup = () => {
  selectedBadge.value = {};
  popupMode.value = 'add';
  showPopup.value = true;
};

const openEditPopup = (badge) => {
  selectedBadge.value = { ...badge }; // Tạo bản sao để không ảnh hưởng trực tiếp dữ liệu gốc
  popupMode.value = 'edit';
  showPopup.value = true;
};

const openViewPopup = (badge) => {
  selectedBadge.value = { ...badge };
  popupMode.value = 'view';
  showPopup.value = true;
};

const closePopup = () => {
  showPopup.value = false;
  selectedBadge.value = null;
};

const saveBadge = async (badgeData, mode) => {
  try {
    if (mode === 'add') {
      await badgeService.add(badgeData);
      showToast('Thêm huy hiệu thành công!', 'success');
    } else { // 'edit'
      await badgeService.update(badgeData);
      showToast('Cập nhật huy hiệu thành công!', 'success');
    }
    closePopup();
    loadBadges(); // Tải lại danh sách huy hiệu sau khi lưu
  } catch (error) {
    console.error(`Lỗi khi ${mode} huy hiệu:`, error);
    showToast(`Lỗi khi ${mode} huy hiệu.`, 'error');
  }
};

const deleteBadge = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa huy hiệu này?')) {
    try {
      await badgeService.remove(id);
      showToast('Xóa huy hiệu thành công!', 'success');
      loadBadges(); // Tải lại danh sách huy hiệu
    } catch (error) {
      console.error("Lỗi khi xóa huy hiệu:", error);
      showToast('Lỗi khi xóa huy hiệu.', 'error');
    }
  }
};

// Theo dõi các bộ lọc để tải lại dữ liệu khi chúng thay đổi
watch([filterType, filterStatus, filterDateRange], () => {
  currentPage.value = 1; // Đặt lại trang về 1 khi bộ lọc thay đổi
});

onMounted(() => {
  loadBadges();
});
</script>

<style scoped>
.badge-view-container {
  padding: 1.5rem 2rem;
  background-color: #f8fafd;
  min-height: calc(100vh - 60px);
}

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
}

.btn-add-new {
  background-color: #007bff;
  border-color: #007bff;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}

.btn-add-new:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
}

.badge-toolbar-card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

.search-input-group {
  position: relative;
  max-width: 400px;
}

.search-input {
  border-radius: 0.5rem;
  padding-left: 2.5rem;
  height: 45px;
  border-color: #e0e0e0;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.filter-group label,
.items-per-page-group label {
  font-weight: 500;
  color: #555;
  white-space: nowrap;
}

.filter-group .form-select,
.items-per-page-group .form-select {
  border-radius: 0.5rem;
  height: 45px;
  font-size: 0.95rem;
  border-color: #e0e0e0;
}

.filter-group .form-select:focus,
.items-per-page-group .form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.badge-table-card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden; /* Ensures rounded corners for the table */
  background-color: #ffffff;
}

/* Custom modal backdrop and modal styles */
.modal-backdrop.custom-backdrop {
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1040;
}

.modal.custom-modal {
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal.custom-modal .modal-content {
  border-radius: 0.75rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  border: none;
  overflow: hidden;
}

/* Transition styles for modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
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
  }

  .badge-title {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  .btn-add-new {
    width: 100%;
    margin-bottom: 1rem;
  }

  .badge-toolbar-card .card-body {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input-group {
    max-width: 100%;
    margin-right: 0 !important;
    margin-bottom: 1rem !important;
  }

  .filter-group,
  .items-per-page-group {
    width: 100%;
    margin-left: 0 !important;
    margin-bottom: 1rem;
  }

  .filter-group select,
  .items-per-page-group select {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .badge-title {
    font-size: 1.5rem;
  }
}
</style>