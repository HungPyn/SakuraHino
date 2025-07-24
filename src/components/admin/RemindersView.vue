<template>
  <div class="reminder-view-container">
    <ReminderToolbar @add="openAdd" @search="onSearch" @update-per-page="updatePerPage" />

    <ReminderTable
      :reminders="paginatedReminders"
      @edit="openEdit"
      @delete="removeReminder"
    />

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
import { reminders as staticData } from '../../services/remindersService';
import NotificationToast from '../share/NotificationToast.vue';
import Pagination from '../share/Pagination.vue'; // Import Pagination component

export default {
  components: {
    ReminderToolbar,
    ReminderTable,
    ReminderPopup,
    NotificationToast,
    Pagination, // Register Pagination component
  },
  data() {
    return {
      reminders: [...staticData],
      showPopup: false,
      selectedReminder: null,
      page: 1,
      perPage: 5,
      searchKeyword: '', // Thêm trạng thái tìm kiếm

      // Toast state
      toastMessage: '',
      toastVisible: false,
      toastType: 'success',
    };
  },
  computed: {
    filteredReminders() {
      if (!this.searchKeyword) {
        return this.reminders;
      }
      const lowerKeyword = this.searchKeyword.toLowerCase();
      return this.reminders.filter(reminder =>
        reminder.type.toLowerCase().includes(lowerKeyword) ||
        (reminder.status && reminder.status.toLowerCase().includes(lowerKeyword)) // Tìm kiếm cả theo trạng thái
      );
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
      this.selectedReminder = null;
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
        // Find the maximum existing ID and add 1, or start from 1 if no reminders
        const maxId = this.reminders.length > 0 ? Math.max(...this.reminders.map(r => r.id)) : 0;
        reminder.id = maxId + 1;
        this.reminders.unshift(reminder); // Add to the beginning
        this.page = 1; // Reset to first page to see the newly added item
        this.showToast('Thêm mới thành công!', 'success');
      }
      this.closePopup();
    },
    removeReminder(id) {
      this.reminders = this.reminders.filter((r) => r.id !== id);
      this.showToast('Xóa thành công!', 'warning');
      // Adjust page if current page becomes empty after deletion
      if (this.page > this.totalPages && this.totalPages > 0) {
        this.page = this.totalPages;
      } else if (this.totalPages === 0) {
        this.page = 1; // If all items are deleted, go to page 1
      }
    },
    // Methods for Toolbar interactions
    onSearch(keyword) {
      this.searchKeyword = keyword;
      this.page = 1; // Reset to first page on new search
    },
    updatePerPage(value) {
      this.perPage = value;
      this.page = 1; // Reset to first page when items per page changes
    },
    // Pagination handler from Pagination component
    handlePageChange(newPage) {
      this.page = newPage;
    }
  },
};
</script>

<style scoped>
.reminder-view-container {
  padding: 1.5rem 2rem;
  background-color: #f8fafd;
  min-height: calc(100vh - 60px);
}
</style>