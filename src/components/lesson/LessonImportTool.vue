<template>
  <v-card class="import-card pa-6 rounded-xl elevation-3">
    <v-card-title class="card-title d-flex align-center mb-4">
      <v-icon class="mr-2" color="primary">mdi-file-excel</v-icon>
      Nhập dữ liệu bài học từ Excel/CSV
    </v-card-title>
    <v-card-text>
      <v-alert
        v-if="message"
        :type="messageType"
        class="mb-4"
        dense
        dismissible
      >{{ message }}</v-alert>

      <v-file-input
        v-model="selectedFile"
        label="Chọn file Excel/CSV (.csv)"
        accept=".csv"
        prepend-icon="mdi-paperclip"
        outlined
        dense
        show-size
        class="mb-4"
      ></v-file-input>

      <v-btn
        color="primary"
        :disabled="!selectedFile || importing"
        :loading="importing"
        @click="handleImport"
        class="mb-4"
      >
        <v-icon left>mdi-upload</v-icon>
        Nhập dữ liệu
      </v-btn>

      <div v-if="importResults">
        <v-divider class="my-4"></v-divider>
        <h3 class="text-h6 mb-2">Kết quả nhập:</h3>
        <p class="success--text">
          <v-icon small color="success">mdi-check-circle</v-icon>
          Thành công: {{ importResults.success }} bài học
        </p>
        <p :class="{'error--text': importResults.failed > 0}">
          <v-icon small :color="importResults.failed > 0 ? 'error' : 'grey'">mdi-close-circle</v-icon>
          Thất bại: {{ importResults.failed }} bài học
        </p>

        <v-expansion-panels v-if="importResults.errors.length > 0" class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon left color="error">mdi-alert-circle</v-icon>
              Chi tiết lỗi ({{ importResults.errors.length }})
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list dense>
                <v-list-item v-for="(error, index) in importResults.errors" :key="index">
                  <v-list-item-content>
                    <v-list-item-title class="error--text">Dòng {{ error.lineNumber }}: {{ error.message }}</v-list-item-title>
                    <v-list-item-subtitle>
                      Dữ liệu: {{ JSON.stringify(error.data) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import Papa from 'papaparse'; // Import PapaParse
import lessonService from '@/services/lessonService'; // Import lessonService
import { useToast } from '@/composables/useToast'; // Giả sử bạn có composable useToast
import topicService from '@/services/topicService'; // Import topicService để lấy allTopics

const selectedFile = ref(null);
const importing = ref(false);
const message = ref('');
const messageType = ref('info');
const importResults = ref(null);

const { showToast } = useToast(); // Sử dụng toast notification

const handleImport = async () => {
  if (!selectedFile.value) {
    message.value = 'Vui lòng chọn một file CSV.';
    messageType.value = 'warning';
    return;
  }

  importing.value = true;
  message.value = '';
  importResults.value = null;

  try {
    const file = selectedFile.value;

    // Đọc và parse file CSV
    Papa.parse(file, {
      header: true, // Lấy dòng đầu tiên làm header (tên cột)
      skipEmptyLines: true,
      encoding: 'UTF-8', // Quan trọng cho tiếng Việt có dấu
      complete: async (results) => {
        const data = results.data;
        const errors = results.errors; // Lỗi từ quá trình parse của PapaParse

        if (errors.length > 0) {
          message.value = `Có lỗi khi đọc file: ${errors.map(e => e.message).join('; ')}`;
          messageType.value = 'error';
          showToast('Lỗi đọc file!', 'error');
          importing.value = false;
          return;
        }

        if (data.length === 0) {
          message.value = 'File CSV không chứa dữ liệu hợp lệ.';
          messageType.value = 'warning';
          showToast('File trống!', 'warning');
          importing.value = false;
          return;
        }

        // Bắt đầu quá trình import và validate từng dòng
        const result = await lessonService.importLessons(data);

        importResults.value = result;

        if (result.failed === 0) {
          message.value = `Nhập thành công ${result.success} bài học.`;
          messageType.value = 'success';
          showToast('Nhập dữ liệu thành công!', 'success');
        } else if (result.success === 0) {
          message.value = `Nhập thất bại tất cả ${result.failed} bài học. Vui lòng xem chi tiết lỗi.`;
          messageType.value = 'error';
          showToast('Nhập dữ liệu thất bại!', 'error');
        } else {
          message.value = `Nhập thành công ${result.success} bài học và thất bại ${result.failed} bài học. Vui lòng xem chi tiết lỗi.`;
          messageType.value = 'warning';
          showToast('Nhập dữ liệu có lỗi!', 'warning');
        }
      },
      error: (err) => {
        message.value = `Không thể đọc file: ${err.message}`;
        messageType.value = 'error';
        showToast('Lỗi đọc file!', 'error');
        importing.value = false;
      }
    });

  } catch (error) {
    console.error('Lỗi import:', error);
    message.value = `Đã xảy ra lỗi không mong muốn: ${error.message}`;
    messageType.value = 'error';
    showToast('Lỗi không mong muốn!', 'error');
  } finally {
    importing.value = false;
    selectedFile.value = null; // Clear selected file after import attempt
  }
};
</script>

<style scoped>
.import-card {
  margin-top: 24px;
}
.card-title {
  color: #333333;
  font-weight: 700;
  font-size: 1.5rem !important;
  padding: 0 0 16px 0; /* Adjust padding for title */
  margin-bottom: 0; /* Remove default margin */
  border-bottom: 1px solid #eeeeee;
}
/* Style cho alert, list lỗi, v.v. */
.success--text {
  color: #4CAF50 !important;
}
.error--text {
  color: #FF5252 !important;
}
</style>