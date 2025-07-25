<template>
  <div class="general-settings-view-container">
    <div class="page-header mb-4">
      <h1 class="page-title">
        <i class="bi bi-gear-fill me-2 text-primary"></i> Cài đặt Chung
      </h1>
      <p class="page-description">Quản lý các tùy chọn cài đặt chung cho ứng dụng của bạn.</p>
    </div>

    <div class="settings-card card shadow-sm">
      <div class="card-header bg-white py-3">
        <h5 class="card-title mb-0">Thông tin Ứng dụng</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveSettings">
          <div class="mb-3">
            <label for="appName" class="form-label">Tên Ứng dụng</label>
            <input type="text" class="form-control" id="appName" v-model="settings.appName" placeholder="Tên ứng dụng của bạn" />
          </div>
          <div class="mb-3">
            <label for="appDescription" class="form-label">Mô tả Ứng dụng</label>
            <textarea class="form-control" id="appDescription" rows="3" v-model="settings.appDescription" placeholder="Mô tả ngắn gọn về ứng dụng"></textarea>
          </div>
          <div class="mb-3">
            <label for="appLogoUrl" class="form-label">URL Logo Ứng dụng</label>
            <div class="d-flex align-items-center">
              <input type="url" class="form-control me-3" id="appLogoUrl" v-model="settings.appLogoUrl" placeholder="https://example.com/logo.png" />
              <img :src="settings.appLogoUrl" alt="App Logo Preview" class="img-thumbnail logo-preview" v-if="settings.appLogoUrl" />
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="settings-card card shadow-sm mt-4">
      <div class="card-header bg-white py-3">
        <h5 class="card-title mb-0">Tùy chọn Hiển thị & Ngôn ngữ</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveSettings">
          <div class="mb-3">
            <label for="language" class="form-label">Ngôn ngữ</label>
            <select class="form-select" id="language" v-model="settings.language">
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="theme" class="form-label">Chủ đề</label>
            <select class="form-select" id="theme" v-model="settings.theme">
              <option value="light">Sáng</option>
              <option value="dark">Tối</option>
            </select>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="enableNotifications" v-model="settings.enableNotifications" />
            <label class="form-check-label" for="enableNotifications">Bật thông báo ứng dụng</label>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="autoSave" v-model="settings.autoSave" />
            <label class="form-check-label" for="autoSave">Tự động lưu thay đổi</label>
          </div>
          <div class="mb-3">
            <label for="defaultItemsPerPage" class="form-label">Số mục mặc định trên mỗi trang</label>
            <input type="number" class="form-control" id="defaultItemsPerPage" v-model.number="settings.defaultItemsPerPage" min="5" max="50" />
          </div>
        </form>
      </div>
    </div>

    <div class="settings-actions d-flex justify-content-end gap-3 mt-4">
      <button type="button" class="btn btn-outline-secondary" @click="resetToDefault">
        <i class="bi bi-arrow-counterclockwise me-2"></i>Đặt lại mặc định
      </button>
      <button type="submit" class="btn btn-primary" @click="saveSettings">
        <i class="bi bi-save me-2"></i>Lưu thay đổi
      </button>
    </div>

    <NotificationToast ref="notificationToast" :message="toastMessage" :type="toastType" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getGeneralSettings, updateGeneralSettings, resetGeneralSettings } from '../../services/settingsService';
import NotificationToast from '../share/NotificationToast.vue'; // Đảm bảo đường dẫn đúng

export default {
  components: {
    NotificationToast,
  },
  setup() {
    const settings = ref({}); // Đối tượng lưu trữ cài đặt hiện tại
    const toastMessage = ref('');
    const toastType = ref('success');
    const notificationToast = ref(null); // Ref để truy cập component NotificationToast

    // Hàm hiển thị toast
    const showToast = (message, type = 'success') => {
      toastMessage.value = message;
      toastType.value = type;
      if (notificationToast.value) {
        notificationToast.value.show();
      }
    };

    // Tải cài đặt khi component được mount
    onMounted(async () => {
      try {
        settings.value = await getGeneralSettings();
      } catch (error) {
        console.error('Error loading settings:', error);
        showToast('Lỗi khi tải cài đặt.', 'error');
      }
    });

    // Lưu cài đặt
    const saveSettings = async () => {
      try {
        await updateGeneralSettings(settings.value);
        showToast('Cài đặt đã được lưu thành công!', 'success');
      } catch (error) {
        console.error('Error saving settings:', error);
        showToast('Lỗi khi lưu cài đặt.', 'error');
      }
    };

    // Đặt lại cài đặt về mặc định
    const resetToDefault = async () => {
      if (confirm('Bạn có chắc chắn muốn đặt lại tất cả cài đặt về mặc định không?')) {
        try {
          settings.value = await resetGeneralSettings();
          showToast('Cài đặt đã được đặt lại mặc định!', 'info');
        } catch (error) {
          console.error('Error resetting settings:', error);
          showToast('Lỗi khi đặt lại cài đặt.', 'error');
        }
      }
    };

    return {
      settings,
      saveSettings,
      resetToDefault,
      toastMessage,
      toastType,
      notificationToast,
    };
  },
};
</script>

<style scoped>
.general-settings-view-container {
  padding: 2rem;
  background-color: #f8fafd;
  min-height: calc(100vh - 60px); /* Adjust based on your header height */
  color: #344767;
}

.page-header {
  text-align: left;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.page-title i {
  font-size: 2.5rem;
  color: #007bff; /* Primary color for icon */
}

.page-description {
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
}

.settings-card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

.settings-card .card-header {
  border-bottom: 1px solid #f0f2f5;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}

.settings-card .card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #344767;
}

.settings-card .card-body {
  padding: 1.5rem;
}

.form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border-radius: 0.5rem;
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-check-input {
  border-radius: 0.35em;
  width: 1.25em;
  height: 1.25em;
  margin-top: 0.25em;
}

.form-check-label {
  padding-left: 0.25rem;
  cursor: pointer;
  font-weight: 400; /* Standard font weight for labels */
}

.logo-preview {
  max-width: 100px;
  max-height: 50px;
  object-fit: contain;
  border: 1px solid #dee2e6;
  border-radius: 0.35rem;
  background-color: #f8f9fa;
  padding: 0.25rem;
}

.settings-actions .btn {
  padding: 0.8rem 1.8rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.settings-actions .btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.settings-actions .btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.settings-actions .btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.settings-actions .btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .general-settings-view-container {
    padding: 1rem;
  }
  .page-title {
    font-size: 1.8rem;
  }
  .page-title i {
    font-size: 2rem;
  }
  .page-description {
    font-size: 0.9rem;
  }
  .settings-card .card-body {
    padding: 1rem;
  }
  .settings-actions {
    flex-direction: column;
    gap: 1rem;
  }
  .settings-actions .btn {
    width: 100%;
  }
}
</style>