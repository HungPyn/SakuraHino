<template>
  <v-container fluid class="pa-8">
    <!-- Header -->
    <v-row align="center" class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-bold">⏰ Quản lý Nhắc nhở</h1>
        <p class="text-subtitle-1 text-grey-darken-1">
          Lên lịch và quản lý các thông báo học tập tự động
        </p>
      </v-col>
      <v-col class="text-end">
        <v-btn
          color="primary"
          @click="openDialog()"
          prepend-icon="fa-solid fa-plus"
        >
          <span class="btn-icon mr-2">➕</span>Tạo Lịch nhắc nhở mới
        </v-btn>
      </v-col>
    </v-row>

    <!-- Reminder List -->
    <v-row v-if="!loading">
      <v-col
        v-for="item in reminderList"
        :key="item.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="reminder-card" rounded="lg" elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="font-weight-bold text-body-1">{{ item.title }}</span>
            <v-switch
              :model-value="item.status === 'active'"
              @update:model-value="toggleStatus(item)"
              color="success"
              hide-details
              inset
              :loading="item.isTogglingStatus"
              :disabled="item.isTogglingStatus"
            ></v-switch>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-3" color="primary"
                >fa-solid fa-calendar-days</v-icon
              >
              <span>{{ getScheduleText(item) }}</span>
            </div>
            <div class="d-flex align-start">
              <v-icon class="mr-3 mt-1" color="primary"
                >fa-solid fa-bullseye</v-icon
              >
              <div>
                <span
                  >Đối tượng:
                  <strong>{{
                    getTargetAudienceText(item.targetAudience)
                  }}</strong>
                </span>
                <div
                  v-if="
                    item.targetAudience === 'level' && item.targetDetails.length
                  "
                >
                  <v-chip
                    v-for="level in item.targetDetails"
                    :key="level"
                    size="x-small"
                    class="mr-1 mt-1"
                    >{{ level }}</v-chip
                  >
                </div>
                <div v-if="item.targetAudience === 'inactive_users'">
                  <v-chip size="x-small" class="mr-1 mt-1"
                    >Sau {{ item.inactiveDays || 7 }} ngày</v-chip
                  >
                </div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" color="primary" @click="openDialog(item)"
              >Sửa</v-btn
            >
            <v-btn variant="text" color="error" @click="confirmDelete(item)"
              >Xóa</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <!-- Skeleton Loaders -->
      <v-col v-for="n in 3" :key="n" cols="12" md="6" lg="4">
        <v-skeleton-loader
          type="card-avatar, article, actions"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- Dialogs -->
    <ReminderFormDialog
      v-model:show="dialogVisible"
      :edited-item="editedItem"
      :is-saving="isSaving"
      @save="handleSave"
    />
    <ConfirmDialog
      v-model:show="confirmDialogVisible"
      title="Xác nhận xóa"
      :message="`Bạn có chắc chắn muốn xóa lịch nhắc nhở '${itemToDelete?.title}' không?`"
      confirm-text="Xác nhận xóa"
      confirm-color="error"
      @confirm="handleDelete"
    />

    <!-- Snackbar for Notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
      variant="elevated"
    >
      <div class="d-flex align-center">
        <v-icon v-if="snackbar.color === 'success'" class="mr-3"
          >fa-solid fa-check-circle</v-icon
        >
        <v-icon v-else class="mr-3">fa-solid fa-triangle-exclamation</v-icon>
        <span>{{ snackbar.message }}</span>
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Đóng</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { format } from "date-fns";
import reminderService from "@/services/reminderService";
import ReminderFormDialog from "@/components/reminder/ReminderFormDialog.vue";
import ConfirmDialog from "@/components/exercise/ConfirmDialog.vue";

const reminderList = ref([]);
const loading = ref(true);
const dialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const editedItem = ref(null);
const itemToDelete = ref(null);
const isSaving = ref(false); // State để quản lý loading của nút Lưu trong dialog

// State quản lý snackbar
const snackbar = reactive({
  show: false,
  message: "",
  color: "success",
});

const showSnackbar = (message, color = "success") => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
};

onMounted(async () => {
  await fetchReminders();
});

const fetchReminders = async () => {
  loading.value = true;
  try {
    const data = await reminderService.getReminders();
    reminderList.value = data.map((item) => ({
      ...item,
      isTogglingStatus: false,
    }));
  } catch (error) {
    console.error("Lỗi khi tải danh sách nhắc nhở:", error);
    showSnackbar("Tải danh sách thất bại.", "error");
  } finally {
    loading.value = false;
  }
};

const openDialog = (item = null) => {
  editedItem.value = item;
  dialogVisible.value = true;
};

const handleSave = async (item) => {
  isSaving.value = true; // Bắt đầu loading
  try {
    if (item.id) {
      await reminderService.updateReminder(item);
      showSnackbar("Đã cập nhật lịch nhắc nhở thành công!");
    } else {
      await reminderService.addReminder(item);
      showSnackbar("Đã tạo mới lịch nhắc nhở thành công!");
    }
    await fetchReminders();
    dialogVisible.value = false; // Đóng dialog sau khi lưu thành công
  } catch (error) {
    console.error("Lỗi khi lưu nhắc nhở:", error);
    showSnackbar("Thao tác thất bại, vui lòng thử lại.", "error");
  } finally {
    isSaving.value = false; // Kết thúc loading
  }
};

const toggleStatus = async (item) => {
  // Bật loading cho switch cụ thể này
  item.isTogglingStatus = true;
  const newStatus = item.status === "active" ? "inactive" : "active";
  const newStatusText = newStatus === "active" ? "bật" : "tắt";
  try {
    await reminderService.updateReminder({ ...item, status: newStatus });
    // Cập nhật lại trạng thái của item trong danh sách mà không cần gọi lại API
    const index = reminderList.value.findIndex((r) => r.id === item.id);
    const snackbarColor = newStatus === "active" ? "success" : "error";
    if (index !== -1) {
      reminderList.value[index].status = newStatus;
    }
    showSnackbar(
      `Đã ${newStatusText} lịch nhắc nhở '${item.title}'.`,
      snackbarColor
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    showSnackbar("Cập nhật trạng thái thất bại.", "error");
  } finally {
    // Tắt loading cho switch
    item.isTogglingStatus = false;
  }
};

const confirmDelete = (item) => {
  itemToDelete.value = item;
  confirmDialogVisible.value = true;
};

const handleDelete = async () => {
  try {
    await reminderService.deleteReminder(itemToDelete.value.id);
    await fetchReminders();
    showSnackbar("Đã xóa lịch nhắc nhở thành công.");
  } catch (error) {
    console.error("Lỗi khi xóa nhắc nhở:", error);
    showSnackbar("Xóa thất bại, vui lòng thử lại.", "error");
  }
};

const getScheduleText = (item) => {
  if (item.scheduleType === "one_time" && item.oneTimeDateTime) {
    try {
      return `Một lần lúc: ${format(
        new Date(item.oneTimeDateTime),
        "HH:mm - dd/MM/yyyy"
      )}`;
    } catch (e) {
      return "Một lần (ngày giờ không hợp lệ)";
    }
  }
  return `Hàng ngày lúc: ${item.dailyTime}`;
};

const getTargetAudienceText = (target) => {
  const map = {
    all: "Tất cả học viên",
    level: "Học viên theo cấp độ",
    inactive_users: "Học viên không hoạt động",
  };
  return map[target] || "Không xác định";
};
</script>

<style scoped>
.reminder-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.reminder-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}
</style>
