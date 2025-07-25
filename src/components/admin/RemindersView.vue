<template>
  <div class="reminder-view-container">
    <div class="reminder-header">
      <h1 class="reminder-title">
        <i class="bi bi-bell-fill text-primary me-2"></i> Quản lý Nhắc nhở
      </h1>
      <button class="btn btn-primary btn-add-new" @click="openAdd">
        <i class="bi bi-plus-circle me-2"></i> Thêm nhắc nhở mới
      </button>
    </div>

    <ReminderToolbar
      @add="openAdd"
      @search="onSearch"
      @update-per-page="updatePerPage"
      @filter-type="onFilterType"
      @filter-status="onFilterStatus"
      @reset-filters="onResetFilters"
    />

    <ReminderTable
      :reminders="paginatedReminders"
      @edit="openEdit"
      @delete="removeReminder"
    />
    <p v-if="paginatedReminders.length === 0" class="text-center text-muted py-4 m-0">Không có nhắc nhở nào phù hợp với bộ lọc.</p>


    <ReminderPopup
      v-if="showPopup"
      :reminder="selectedReminder"
      @close="closePopup"
      @save="saveReminder"
    />

    <NotificationToast
      v-if="toastVisible"
      :message="toastMessage"
      :type="toastType"
      ref="toast"
    />

    <div class="d-flex justify-content-center mt-4">
      <Pagination
        :current-page="page"
        :total-pages="totalPages"
        @page-changed="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import ReminderToolbar from '../reminders/ReminderToolbar.vue';
import ReminderTable from '../reminders/ReminderTable.vue';
import ReminderPopup from '../reminders/ReminderPopup.vue';
import { reminders as staticData } from '../../services/remindersService'; // Assuming this is your mock data
import NotificationToast from '../share/NotificationToast.vue';
import Pagination from '../share/Pagination.vue';

export default {
  components: {
    ReminderToolbar,
    ReminderTable,
    ReminderPopup,
    NotificationToast,
    Pagination,
  },
  data() {
    return {
      reminders: [...staticData], // Make sure this is loaded dynamically or through a service call if needed
      showPopup: false,
      selectedReminder: null,
      page: 1,
      perPage: 5,
      searchKeyword: '',
      filterType: 'all',    // New state for type filter
      filterStatus: 'all',  // New state for status filter

      // Toast state
      toastMessage: '',
      toastVisible: false,
      toastType: 'success',
    };
  },
  computed: {
    filteredReminders() {
      let filtered = this.reminders;

      // 1. Filter by search keyword
      if (this.searchKeyword) {
        const lowerKeyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(reminder =>
          (reminder.title && reminder.title.toLowerCase().includes(lowerKeyword)) || // Search by title
          (reminder.type && reminder.type.toLowerCase().includes(lowerKeyword)) ||   // Search by type
          (reminder.status && reminder.status.toLowerCase().includes(lowerKeyword))  // Search by status
        );
      }

      // 2. Filter by type
      if (this.filterType !== 'all') {
        filtered = filtered.filter(reminder => reminder.type === this.filterType);
      }

      // 3. Filter by status
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(reminder => reminder.status === this.filterStatus);
      }

      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredReminders.length / this.perPage);
    },
    paginatedReminders() {
      const start = (this.page - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredReminders.slice(start, end);
    },
  },
  methods: {
    openAdd() {
      this.selectedReminder = {
        id: null,
        title: '',
        description: '',
        dueDate: '',
        type: 'other', // Default type
        status: 'pending' // Default status
      };
      this.showPopup = true;
    },
    openEdit(item) {
      this.selectedReminder = { ...item };
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
    showToast(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.toastVisible = true;
      this.$nextTick(() => {
        this.$refs.toast?.show?.();
      });
    },
    saveReminder(reminder) {
      if (reminder.id) {
        const index = this.reminders.findIndex((r) => r.id === reminder.id);
        if (index !== -1) {
          this.reminders.splice(index, 1, reminder);
          this.showToast('Cập nhật thành công!', 'info');
        }
      } else {
        const maxId = this.reminders.length > 0 ? Math.max(...this.reminders.map(r => r.id)) : 0;
        reminder.id = maxId + 1;
        this.reminders.unshift(reminder);
        this.page = 1;
        this.showToast('Thêm mới thành công!', 'success');
      }
      this.closePopup();
    },
    removeReminder(id) {
      this.reminders = this.reminders.filter((r) => r.id !== id);
      this.showToast('Xóa thành công!', 'warning');
      if (this.page > this.totalPages && this.totalPages > 0) {
        this.page = this.totalPages;
      } else if (this.totalPages === 0) {
        this.page = 1;
      }
    },
    onSearch(keyword) {
      this.searchKeyword = keyword;
      this.page = 1; // Reset to first page on new search
    },
    onFilterType(type) {
      this.filterType = type;
      this.page = 1; // Reset to first page on filter change
    },
    onFilterStatus(status) {
      this.filterStatus = status;
      this.page = 1; // Reset to first page on filter change
    },
    onResetFilters() {
      this.searchKeyword = '';
      this.filterType = 'all';
      this.filterStatus = 'all';
      this.page = 1;
    },
    updatePerPage(value) {
      this.perPage = value;
      this.page = 1; // Reset to first page when items per page changes
    },
    handlePageChange(newPage) {
      this.page = newPage;
    }
  },
  // If you are loading data from a service, consider using mounted() to fetch it
  mounted() {
    // Example: Fetch reminders from a service if you had an async one
    // remindersService.getAll().then(data => {
    //   this.reminders = data;
    // });
  }
};
</script>

<style scoped>
.reminder-view-container {
  padding: 1.5rem 2rem;
  background-color: #f8fafd;
  min-height: calc(100vh - 60px);
}

.reminder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.reminder-title {
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

/* Add some margin to the table if needed to separate it from toolbar */
.reminder-table {
    margin-top: 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .reminder-view-container {
    padding: 1rem;
  }

  .reminder-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .reminder-title {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  .btn-add-new {
    width: 100%;
    margin-bottom: 1rem;
  }
}

@media (max-width: 576px) {
  .reminder-title {
    font-size: 1.5rem;
  }
}
</style>