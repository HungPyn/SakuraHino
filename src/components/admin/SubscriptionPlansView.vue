<template>
  <div class="subscription-plans-view-container">
    <div class="page-title-section mb-4">
      <h1 class="page-title"><i class="bi bi-gift-fill me-2"></i> Quản lý Gói đăng ký</h1>
    </div>

    <div class="toolbar-section mb-4">
      <div class="d-flex flex-wrap align-items-center bg-white p-3 rounded-3 shadow-sm">
        <div class="search-input-wrapper position-relative me-3 mb-2 mb-md-0 flex-grow-1">
          <i class="bi bi-search search-icon position-absolute"></i>
          <input
            type="text"
            class="form-control custom-search-input"
            placeholder="Tìm kiếm gói đăng ký..."
            v-model="searchKeyword"
            @input="handleSearch"
          />
        </div>

        <div class="filter-group d-flex align-items-center me-3 mb-2 mb-md-0">
          <label for="filterStatus" class="form-label mb-0 me-2 text-muted">Trạng thái:</label>
          <select id="filterStatus" class="form-select custom-select" v-model="filterStatus" @change="handleFilterChange">
            <option value="all">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        <div class="filter-group d-flex align-items-center me-3 mb-2 mb-md-0">
          <label for="filterDuration" class="form-label mb-0 me-2 text-muted">Thời hạn:</label>
          <select id="filterDuration" class="form-select custom-select" v-model="filterDuration" @change="handleFilterChange">
            <option value="all">Tất cả</option>
            <option value="monthly">Hàng tháng</option>
            <option value="quarterly">Hàng quý</option>
            <option value="yearly">Hàng năm</option>
          </select>
        </div>

        <button class="btn btn-outline-secondary reset-button me-3 mb-2 mb-md-0" @click="resetFilters">
          <i class="bi bi-arrow-counterclockwise me-1"></i> Đặt lại
        </button>

        <button class="btn add-button mb-2 mb-md-0" @click="openAddPlanPopup">
          <i class="bi bi-plus-lg me-2"></i> Thêm gói mới
        </button>
      </div>
    </div>

    <div class="table-container">
      <SubscriptionPlanTable
        :plans="paginatedPlans"
        @edit="openEditPlanPopup"
        @delete="confirmDeletePlan"
      />
      <p v-if="paginatedPlans.length === 0" class="text-center text-muted py-4 m-0">
        Không có gói đăng ký nào phù hợp với bộ lọc.
      </p>
    </div>

    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="currentPage = $event"
      class="mt-4"
    />

    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showPlanPopup" class="modal custom-modal" tabindex="-1" :class="{ 'show-modal': showPlanPopup }" @click.self="closePlanPopup">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <SubscriptionPlanPopup
              :plan="selectedPlan"
              @close="closePlanPopup"
              @save="savePlan"
            />
          </div>
        </div>
      </transition>
    </Teleport>

    <NotificationToast
      :message="notificationMessage"
      :type="notificationType"
      ref="notificationToast"
    />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'; // Import watch
import SubscriptionPlanTable from '../subscription/SubscriptionPlanTable.vue';
import SubscriptionPlanPopup from '../subscription/SubscriptionPlanPopup.vue';
import Pagination from '../share/Pagination.vue';
import NotificationToast from '../share/NotificationToast.vue';
import { getSubscriptionPlans, addSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from '../../services/subscriptionService';
import { debounce } from 'lodash'; // Import debounce

export default {
  components: {
    SubscriptionPlanTable,
    SubscriptionPlanPopup,
    Pagination,
    NotificationToast,
  },
  setup() {
    const plans = ref(getSubscriptionPlans());
    const searchKeyword = ref('');
    const filterStatus = ref('all');   // Thêm ref cho trạng thái lọc
    const filterDuration = ref('all'); // Thêm ref cho thời hạn lọc
    const showPlanPopup = ref(false);
    const selectedPlan = ref(null);

    const itemsPerPage = 10;
    const currentPage = ref(1);

    const notificationMessage = ref('');
    const notificationType = ref('success');
    const notificationToast = ref(null); // Ref để truy cập NotificationToast

    const showNotification = (message, type = 'success') => {
      notificationMessage.value = message;
      notificationType.value = type;
      // Sử dụng nextTick hoặc watch để đảm bảo component con đã sẵn sàng
      if (notificationToast.value) {
        notificationToast.value.show();
      } else {
        // Fallback nếu notificationToast chưa sẵn sàng (hiếm khi xảy ra)
        console.warn("NotificationToast ref not available. Message:", message);
      }
    };

    // Use debounce for search input
    const debouncedSearch = debounce((keyword) => {
        searchKeyword.value = keyword;
        currentPage.value = 1; // Reset to first page on search
    }, 300);

    const handleSearch = (event) => {
      debouncedSearch(event.target.value);
    };

    const filteredPlans = computed(() => {
      let filtered = plans.value;

      // 1. Filter by search keyword
      if (searchKeyword.value) {
        const lowerKeyword = searchKeyword.value.toLowerCase();
        filtered = filtered.filter(
          (plan) =>
            plan.name.toLowerCase().includes(lowerKeyword) ||
            plan.description.toLowerCase().includes(lowerKeyword) ||
            plan.duration.toLowerCase().includes(lowerKeyword) // Include duration in search
        );
      }

      // 2. Filter by status
      if (filterStatus.value !== 'all') {
        filtered = filtered.filter(plan => plan.status === filterStatus.value);
      }

      // 3. Filter by duration
      if (filterDuration.value !== 'all') {
        filtered = filtered.filter(plan => plan.duration === filterDuration.value);
      }

      return filtered;
    });

    // Watch for changes in filteredPlans to reset currentPage if needed
    watch(filteredPlans, (newVal) => {
        if (newVal.length === 0 && currentPage.value > 1) {
            currentPage.value = 1; // Or set to totalPages if it changes
        } else if (currentPage.value > totalPages.value && totalPages.value > 0) {
            currentPage.value = totalPages.value;
        } else if (totalPages.value === 0) {
            currentPage.value = 1; // If no plans left, ensure page is 1
        }
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredPlans.value.length / itemsPerPage);
    });

    const paginatedPlans = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredPlans.value.slice(start, end);
    });

    // Handle filter changes (status or duration)
    const handleFilterChange = () => {
      currentPage.value = 1; // Reset to first page when filters change
    };

    const openAddPlanPopup = () => {
      selectedPlan.value = null; // Indicate add mode
      showPlanPopup.value = true;
    };

    const openEditPlanPopup = (plan) => {
      selectedPlan.value = { ...plan }; // Create a copy for editing
      showPlanPopup.value = true;
    };

    const closePlanPopup = () => {
      showPlanPopup.value = false;
      selectedPlan.value = null; // Clear selected plan after closing
    };

    const savePlan = (planToSave) => {
      if (planToSave.id) {
        // Edit existing plan
        const updated = updateSubscriptionPlan(planToSave);
        if (updated) {
          const index = plans.value.findIndex(p => p.id === updated.id);
          if (index !== -1) {
            // Update the plan reactivity in the array
            plans.value[index] = updated;
          }
          showNotification('Cập nhật gói đăng ký thành công!', 'success');
        } else {
          showNotification('Lỗi: Không tìm thấy gói đăng ký để cập nhật.', 'error');
        }
      } else {
        // Add new plan
        const newPlan = addSubscriptionPlan(planToSave);
        plans.value.push(newPlan); // Add to local state (at the end for simplicity)
        showNotification('Thêm gói đăng ký mới thành công!', 'success');
        // If adding new plan, re-evaluate filtered/paginated plans
        // and potentially move to the last page or first page
        currentPage.value = 1; // Reset to page 1 to see new plan
      }
      closePlanPopup();
    };

    const confirmDeletePlan = (planId) => {
      if (confirm('Bạn có chắc chắn muốn xóa gói đăng ký này? Thao tác này không thể hoàn tác.')) {
        deletePlan(planId);
      } else {
        showNotification('Hủy thao tác xóa gói đăng ký.', 'info');
      }
    };

    const deletePlan = (planId) => {
      const deleted = deleteSubscriptionPlan(planId);
      if (deleted) {
        plans.value = plans.value.filter(p => p.id !== planId); // Update local state
        showNotification('Xóa gói đăng ký thành công!', 'success');
        // Adjust current page if last item on page was deleted or page becomes empty
        if (paginatedPlans.value.length === 0 && currentPage.value > 1) {
            currentPage.value--;
        } else if (totalPages.value === 0) { // If all plans deleted
            currentPage.value = 1;
        }
      } else {
        showNotification('Không tìm thấy gói đăng ký để xóa.', 'error');
      }
    };

    const resetFilters = () => {
      searchKeyword.value = '';
      filterStatus.value = 'all';
      filterDuration.value = 'all';
      currentPage.value = 1; // Reset page
    };


    return {
      plans,
      searchKeyword,
      filterStatus,
      filterDuration,
      showPlanPopup,
      selectedPlan,
      currentPage,
      totalPages,
      paginatedPlans,
      handleSearch,
      handleFilterChange, // Export the new handler
      resetFilters,      // Export the new reset function
      openAddPlanPopup,
      openEditPlanPopup,
      closePlanPopup,
      savePlan,
      confirmDeletePlan,
      notificationMessage,
      notificationType,
      notificationToast, // Export the ref
    };
  },
};
</script>

<style scoped>
/* Existing styles ( giữ nguyên và thêm vào những cái mới nếu cần) */
.subscription-plans-view-container {
  padding: 2rem;
  background-color: #f0f2f5;
  min-height: calc(100vh - 80px); /* Adjust based on your header/footer */
  color: #344767;
}

.page-title-section {
  text-align: left;
  margin-bottom: 2.5rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
  margin: 0;
}

.toolbar-section {
  margin-bottom: 2.5rem;
}

.toolbar-section .d-flex {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  padding: 1rem 1.5rem;
  align-items: center;
  /* flex-wrap: wrap; // Đã thêm ở template */
}

.search-input-wrapper {
  /* width: 100%; Removed fixed width, now flex-grow-1 */
  max-width: 400px;
  margin-right: 1.5rem; /* Space between search and button */
}

.search-icon {
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
}

.custom-search-input {
  padding: 0.75rem 1rem 0.75rem 2.8rem;
  border-radius: 0.5rem;
  border: 1px solid #ced4da;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  color: #343a40;
}

.custom-search-input::placeholder {
  color: #a0a0a0;
}

.custom-search-input:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  outline: none;
}

/* New styles for filters */
.filter-group {
  white-space: nowrap; /* Prevent label and select from wrapping separately */
}

.filter-group .form-label {
  font-weight: 500;
  color: #555;
}

.custom-select {
  border-radius: 0.5rem;
  height: 45px;
  font-size: 0.95rem;
  border-color: #e0e0e0;
}

.custom-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.reset-button {
  background-color: #f8f9fa;
  border-color: #dee2e6;
  color: #495057;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.reset-button:hover {
  background-color: #e2e6ea;
  border-color: #dae0e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-button {
  background-color: #28a745; /* Success green */
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  white-space: nowrap; /* Prevent text wrapping */
}

.add-button:hover {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.add-button i {
  font-size: 1.1rem;
}

.table-container {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  overflow-x: auto;
}

/* Modal/Popup specific styles */
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

.modal.custom-modal.show-modal {
  opacity: 1;
  pointer-events: auto;
}

.modal.custom-modal .modal-dialog {
  margin: 1.75rem auto;
  max-width: 800px; /* Or adjust as needed */
  transform: translateY(-50px);
  opacity: 0;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  pointer-events: none;
  z-index: 1051;
}

.modal.custom-modal.show-modal .modal-dialog {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}

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
  .toolbar-section .d-flex {
    flex-direction: column;
    align-items: stretch;
    padding: 0.8rem 1rem;
  }
  .search-input-wrapper {
    max-width: 100%;
    margin-right: 0 !important;
    margin-bottom: 1rem !important;
  }
  .filter-group {
    width: 100%;
    margin-bottom: 1rem !important;
    justify-content: flex-start; /* Align filters to left */
  }
  .add-button, .reset-button {
    width: 100%;
    justify-content: center;
    margin-right: 0 !important;
    margin-bottom: 0.8rem !important; /* Adjust margin if needed */
  }
  .table-container {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .page-title {
    font-size: 1.8rem;
    flex-direction: column;
    align-items: flex-start;
  }
  .page-title i {
    font-size: 2rem;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }
  .filter-group .form-label {
    margin-bottom: 0.5rem;
  }
}
</style>