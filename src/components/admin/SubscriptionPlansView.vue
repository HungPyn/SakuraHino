<template>
  <div class="subscription-plans-view-container">
    <div class="page-title-section mb-4">
      <h1 class="page-title"><i class="bi bi-gift-fill me-2"></i> Quản lý Gói đăng ký</h1>

    </div>

    <div class="toolbar-section mb-4">
      <div class="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm">
        <div class="search-input-wrapper position-relative">
          <i class="bi bi-search search-icon position-absolute"></i>
          <input
            type="text"
            class="form-control custom-search-input"
            placeholder="Tìm kiếm gói đăng ký..."
            v-model="searchKeyword"
            @input="handleSearch"
          />
        </div>
        <button class="btn add-button" @click="openAddPlanPopup">
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
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import SubscriptionPlanTable from '../subscription/SubscriptionPlanTable.vue';
import SubscriptionPlanPopup from '../subscription/SubscriptionPlanPopup.vue';
import Pagination from '../share/Pagination.vue';
import NotificationToast from '../share/NotificationToast.vue';
import { getSubscriptionPlans, addSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from '../../services/subscriptionService';

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
    const showPlanPopup = ref(false);
    const selectedPlan = ref(null); // null for add, object for edit

    const itemsPerPage = 10;
    const currentPage = ref(1);

    // Notification State
    const notificationMessage = ref('');
    const notificationType = ref('success');

    const showNotification = (message, type = 'success') => {
      notificationMessage.value = ''; // Clear first to ensure watch triggers
      notificationType.value = type;
      notificationMessage.value = message;
    };

    const filteredPlans = computed(() => {
      if (!searchKeyword.value) {
        return plans.value;
      }
      const lowerKeyword = searchKeyword.value.toLowerCase();
      return plans.value.filter(
        (plan) =>
          plan.name.toLowerCase().includes(lowerKeyword) ||
          plan.description.toLowerCase().includes(lowerKeyword) ||
          plan.duration.toLowerCase().includes(lowerKeyword)
      );
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredPlans.value.length / itemsPerPage);
    });

    const paginatedPlans = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredPlans.value.slice(start, end);
    });

    const handleSearch = (keyword) => {
      searchKeyword.value = keyword;
      currentPage.value = 1; // Reset to first page on search
    };

    const openAddPlanPopup = () => {
      selectedPlan.value = null; // Indicate add mode
      showPlanPopup.value = true;
    };

    const openEditPlanPopup = (plan) => {
      selectedPlan.value = plan; // Pass existing plan for edit mode
      showPlanPopup.value = true;
    };

    const closePlanPopup = () => {
      showPlanPopup.value = false;
      selectedPlan.value = null;
    };

    const savePlan = (planToSave) => {
      if (planToSave.id) {
        // Edit existing plan
        const updated = updateSubscriptionPlan(planToSave);
        if (updated) {
          const index = plans.value.findIndex(p => p.id === updated.id);
          if (index !== -1) {
            plans.value[index] = updated; // Update reactivity
          }
          showNotification('Cập nhật gói đăng ký thành công!', 'success');
        } else {
          showNotification('Lỗi: Không tìm thấy gói đăng ký để cập nhật.', 'error');
        }
      } else {
        // Add new plan
        const newPlan = addSubscriptionPlan(planToSave);
        plans.value.push(newPlan); // Add to local state
        showNotification('Thêm gói đăng ký mới thành công!', 'success');
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
        // Adjust current page if last item on page was deleted
        if (paginatedPlans.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
        }
      } else {
        showNotification('Không tìm thấy gói đăng ký để xóa.', 'error');
      }
    };

    return {
      plans,
      searchKeyword,
      showPlanPopup,
      selectedPlan,
      currentPage,
      totalPages,
      paginatedPlans,
      handleSearch,
      openAddPlanPopup,
      openEditPlanPopup,
      closePlanPopup,
      savePlan,
      confirmDeletePlan,
      notificationMessage,
      notificationType,
    };
  },
};
</script>

<style scoped>
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
}

.search-input-wrapper {
  width: 100%;
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

/* Modal/Popup specific styles (No backdrop blur) - Reused from CommunityView */
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
  .search-input-wrapper {
    max-width: 300px;
    margin-right: 1rem;
  }
  .add-button {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .subscription-plans-view-container {
    padding: 1rem;
  }
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
  .page-description {
    font-size: 0.9rem;
  }
  .toolbar-section .d-flex {
    flex-direction: column;
    align-items: stretch;
    padding: 0.8rem 1rem;
  }
  .search-input-wrapper {
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 0.8rem;
  }
  .add-button {
    width: 100%;
    justify-content: center;
  }
  .table-container {
    padding: 1rem;
  }
}
</style>