<template>
  <v-container fluid class="pa-8 jlpt-management-background">
    <!-- Header Section -->
    <v-row align="center" class="mb-6">
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold page-title">
          <span class="page-title-icon mr-3">📚</span> Quản Lý Luyện Thi JLPT
        </h1>
        <p class="text-subtitle-1 text-grey-darken-1 pl-10">
          Quản lý toàn bộ các đề thi JLPT, bao gồm đề thi thật và đề thi thử.
        </p>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end">
        <v-btn color="blue-darken-2" class="rounded-lg pa-4 add-button" size="large" @click="openForm()">
          <span class="btn-icon mr-2">➕</span> Thêm đề thi mới
        </v-btn>
      </v-col>
    </v-row>

    <!-- Summary Cards Section -->
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="3" rounded="xl" color="blue-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">📄 Tổng đề thi</div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ stats.total }}</div>
            </div>
            <v-icon size="48" color="blue-grey-lighten-2">mdi-file-document-outline</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="3" rounded="xl" color="green-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">🏆 Đề thi thật</div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ stats.real }}</div>
            </div>
            <v-icon size="48" color="green-lighten-2">mdi-trophy-outline</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="3" rounded="xl" color="purple-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">💡 Đề thi thử</div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ stats.mock }}</div>
            </div>
            <v-icon size="48" color="purple-lighten-2">mdi-lightbulb-outline</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="3" rounded="xl" color="orange-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">✅ Đề đã chấm</div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ stats.scored }}</div>
            </div>
            <v-icon size="48" color="orange-lighten-2">mdi-check-all</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- JLPT Test List Section -->
    <v-card class="main-content-card pa-4 rounded-xl elevation-3">
      <v-card-title class="card-title d-flex align-center mb-4">
        <span class="card-title-icon mr-2">📋</span>
        Danh Sách Đề Thi JLPT
      </v-card-title>
      <v-card-text>
        <JLPTTestList
          :tests="paginatedTests"
          @edit="openForm"
          @delete="confirmDeleteTest"
          @configure="openConfig"
        />
        <div v-if="tests.length === 0" class="text-center my-4">
          <v-alert type="info" variant="tonal">
            Không có đề thi nào để hiển thị. Hãy thêm một đề thi mới!
          </v-alert>
        </div>
        <div v-if="paginatedTests.length > 0" class="text-center mt-4">
          <v-pagination
            v-model="currentPage"
            :length="pageCount"
            :total-visible="5"
            rounded="circle"
            color="blue-darken-2"
          ></v-pagination>
        </div>
      </v-card-text>
    </v-card>

    <!-- JLPT Test Form Dialog (Popup for Add/Edit) -->
    <JLPTTestForm
      v-if="showForm"
      :editing="selectedTest"
      @close="closeForm"
      @save="saveTest"
    />

    <!-- Custom Confirmation Dialog for Delete (Popup for Delete) -->
    <ConfirmDialog
      v-model:show="showConfirmDialog"
      :title="confirmDialogTitle"
      :message="confirmDialogMessage"
      @confirm="handleDeleteConfirmed"
      @cancel="showConfirmDialog = false"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import JLPTTestList from '../../components/jlpt/JLPTTestList.vue'; // Adjust path
import JLPTTestForm from '../../components/jlpt/JLPTTestForm.vue'; // Adjust path
import ConfirmDialog from '../../components/exercise/ConfirmDialog.vue'; // Re-use ConfirmDialog

// Assume JLPTService provides data and logic (we'll define it below)
import JLPTService from '../../services/JLPTService.js';

const tests = ref([]);
const stats = ref({ total: 0, real: 0, mock: 0, scored: 0 });
const showForm = ref(false); // Controls visibility of the Add/Edit form dialog
const selectedTest = ref(null); // Holds the test object being edited

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 8; // Adjust as needed for your JLPTTestList layout

// Confirmation Dialog state
const showConfirmDialog = ref(false); // Controls visibility of the delete confirmation dialog
const confirmDialogTitle = ref('');
const confirmDialogMessage = ref('');
const testToDeleteId = ref(null); // ID of the test currently awaiting delete confirmation

// Computed property for pagination
const pageCount = computed(() => {
  return Math.ceil(tests.value.length / itemsPerPage);
});

const paginatedTests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return tests.value.slice(start, end);
});

// Watch currentPage to ensure it doesn't exceed pageCount when tests change
watch(pageCount, (newVal) => {
  if (currentPage.value > newVal && newVal > 0) {
    currentPage.value = newVal;
  } else if (newVal === 0) {
    currentPage.value = 1; // Reset to 1 if no tests
  }
});


const loadTests = () => {
  // Calls the service to get all test data and update local state
  tests.value = JLPTService.getAllTests();
  // Calls the service to get stats and update local state
  stats.value = JLPTService.getTestsStats();
};

const openForm = (test = null) => {
  // Sets selectedTest for editing, or null for adding new
  selectedTest.value = test;
  showForm.value = true; // Opens the Add/Edit form dialog
};

const closeForm = () => {
  showForm.value = false; // Closes the Add/Edit form dialog
  selectedTest.value = null; // Clears the selected test
};

const saveTest = (newTest) => {
  // Calls the service to save (add/update) the test
  JLPTService.saveTest(newTest);
  closeForm(); // Closes the form after saving
  loadTests(); // Reloads tests to update list and stats
};

// Opens the custom confirmation dialog before deleting
const confirmDeleteTest = (id, title) => {
  testToDeleteId.value = id; // Stores the ID of the test to be deleted
  confirmDialogTitle.value = 'Xác nhận xóa đề thi';
  confirmDialogMessage.value = `Bạn có chắc chắn muốn xóa đề thi "${title}" này không? Hành động này không thể hoàn tác.`;
  showConfirmDialog.value = true; // Displays the confirmation dialog
};

// Handles deletion after user confirms in the dialog
const handleDeleteConfirmed = () => {
  if (testToDeleteId.value !== null) {
    // Calls the service to delete the test
    JLPTService.deleteTest(testToDeleteId.value);
    loadTests(); // Reloads tests to update list and stats
    showConfirmDialog.value = false; // Closes the confirmation dialog
    testToDeleteId.value = null; // Resets the ID
  }
};

const openConfig = (test) => {
  // Placeholder for future configuration functionality
  alert(`Cấu hình đánh giá cho đề: ${test.title} (Chức năng này sẽ được phát triển sau)`);
};

// Lifecycle hook: Loads tests when the component is mounted
onMounted(loadTests);
</script>

<style scoped>
/* Base Styles for the Dashboard */
.jlpt-management-background {
  background-color: #F0F2F5; /* Màu nền xám nhạt */
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
}

/* Page Title Section */
.page-title {
  color: #333333;
  font-size: 2.2rem !important;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.page-title-icon {
  font-size: 2.8rem;
  line-height: 1;
  vertical-align: middle;
  transform: translateY(-2px);
}

/* Add Button */
.add-button {
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: none;
  transition: all 0.2s ease-in-out;
}
.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.btn-icon {
  font-size: 1.2rem;
  line-height: 1;
}

/* Summary Cards */
.summary-card {
  min-height: 140px;
  padding: 24px !important;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
}
.summary-card .text-h5 {
  margin-top: 8px;
}
.text-dark-emphasis {
  color: #333333 !important;
}
.text-medium-emphasis {
  color: #606060 !important;
}

/* Common Card Styles for Filters and List */
.main-content-card {
  background-color: #FFFFFF !important;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: none;
}
.card-title {
  color: #333333;
  font-weight: 700;
  font-size: 1.5rem !important;
  padding: 16px 24px;
  border-bottom: 1px solid #EEEEEE;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}
.card-title-icon {
  font-size: 1.8rem;
  line-height: 1;
  vertical-align: middle;
}

/* Pagination */
.v-pagination {
  margin: 20px auto;
}
.v-pagination :deep(.v-pagination__item) {
    font-weight: 600;
}
.v-pagination :deep(.v-pagination__item--active) {
    background-color: #2196F3 !important; /* Màu xanh primary */
    color: white !important;
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
}
.v-pagination :deep(.v-pagination__item:not(.v-pagination__item--active)) {
    background-color: #E3F2FD !important; /* Nền xanh nhạt cho các trang khác */
    color: #1976D2 !important; /* Chữ màu xanh đậm */
}
.v-pagination :deep(.v-pagination__item--is-empty) {
    background-color: transparent !important;
}

/* Responsive Adjustments */
@media (max-width: 960px) { /* md breakpoint */
  .d-flex.justify-end {
    justify-content: flex-start !important;
  }
  .add-button {
    width: 100%;
    margin-top: 15px;
  }
  .summary-card {
    height: auto;
    padding: 15px !important;
  }
  .main-content-card .v-col {
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }
}

@media (max-width: 600px) { /* sm breakpoint */
  .pa-8 {
    padding: 16px !important;
  }
  .page-title {
    font-size: 28px !important;
  }
  .page-title-icon {
    font-size: 2.2rem;
  }
  .text-subtitle-1 {
    font-size: 14px !important;
    padding-left: 0 !important; /* Remove padding for mobile */
  }
  .add-button {
    font-size: 14px;
    height: 48px !important;
  }
  .summary-card .text-h5 {
    font-size: 20px !important;
  }
}
</style>
