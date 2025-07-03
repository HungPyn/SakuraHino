<!-- src/components/reminder/ReminderFormDialog.vue -->
<template>
  <v-dialog
    :model-value="show"
    @update:model-value="closeDialog"
    max-width="700px"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-xl elevation-8 dialog-card">
      <v-toolbar color="blue-darken-2" dark flat class="rounded-t-xl">
        <v-toolbar-title class="text-h6 font-weight-bold pl-3">
          <v-icon class="mr-2">{{ formTitle.icon }}</v-icon>
          {{ formTitle.text }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog">
          <v-icon>fa-solid fa-xmark</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="save">
          <v-text-field
            v-model="localItem.title"
            label="Tên lịch nhắc nhở (để quản lý)"
            :rules="[rules.required, rules.maxLength(100)]"
            variant="outlined"
            density="comfortable"
            class="rounded-lg mb-4"
            prepend-inner-icon="fa-solid fa-tag"
            counter
          ></v-text-field>

          <v-textarea
            v-model="localItem.message"
            label="Nội dung thông báo"
            :rules="[rules.required, rules.maxLength(255)]"
            variant="outlined"
            rows="3"
            hint="Sử dụng {username} để chèn tên người dùng."
            persistent-hint
            class="rounded-lg mb-4"
            prepend-inner-icon="fa-solid fa-comment-dots"
            counter
          ></v-textarea>
          <h4 class="text-subtitle-1 font-weight-medium mb-2">
            Chế độ Lịch trình
          </h4>
          <v-chip-group
            v-model="localItem.scheduleType"
            mandatory
            color="primary"
            class="mb-4"
          >
            <v-chip value="daily" filter>Hàng ngày</v-chip>
            <v-chip value="one_time" filter>Chỉ một lần</v-chip>
          </v-chip-group>

          <!-- Các trường sẽ hiển thị động dựa trên lựa chọn trên -->
          <transition name="fade" mode="out-in">
            <div :key="localItem.scheduleType">
              <!-- Trường cho chế độ HÀNG NGÀY -->
              <v-text-field
                v-if="localItem.scheduleType === 'daily'"
                v-model="localItem.dailyTime"
                label="Thời gian gửi"
                type="time"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
                class="rounded-lg"
              ></v-text-field>

              <!-- Trường cho chế độ MỘT LẦN -->
              <v-row v-if="localItem.scheduleType === 'one_time'">
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="localDate"
                    label="Ngày gửi"
                    type="date"
                    :min="today"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                    class="rounded-lg"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="localTime"
                    label="Thời gian gửi"
                    type="time"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                    class="rounded-lg"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </transition>

          <v-select
            v-model="localItem.targetAudience"
            label="Đối tượng nhận thông báo"
            :items="audienceOptions"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
            class="rounded-lg mt-4"
            prepend-inner-icon="fa-solid fa-users"
          ></v-select>

          <!-- Hiển thị động các trường chi tiết cho đối tượng -->
          <transition name="fade" mode="out-in">
            <div :key="localItem.targetAudience">
              <v-autocomplete
                v-if="localItem.targetAudience === 'level'"
                v-model="localItem.targetDetails"
                label="Chọn cấp độ"
                :items="['N5', 'N4', 'N3', 'N2', 'N1']"
                multiple
                chips
                closable-chips
                :rules="[rules.requiredArray]"
                variant="outlined"
                density="comfortable"
                class="rounded-lg mt-4"
              ></v-autocomplete>

              <v-text-field
                v-if="localItem.targetAudience === 'inactive_users'"
                v-model="localItem.inactiveDays"
                label="Số ngày không hoạt động"
                type="number"
                :rules="[rules.required, rules.positiveNumber]"
                variant="outlined"
                density="comfortable"
                class="rounded-lg mt-4"
                suffix="ngày"
              ></v-text-field>
            </div>
          </transition>
        </v-form>
      </v-card-text>

      <v-card-actions
        class="pa-4 bg-grey-lighten-4 rounded-b-xl d-flex justify-end"
      >
        <v-btn
          color="grey-darken-1"
          variant="text"
          class="rounded-lg px-6"
          @click="closeDialog"
        >
          Hủy
        </v-btn>
        <v-btn
          color="blue-darken-2"
          variant="elevated"
          class="rounded-lg px-6 py-3"
          @click="save"
          :disabled="!isFormValid"
          :loading="isSaving"
          prepend-icon="fa-solid fa-floppy-disk"
        >
          Lưu
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed, nextTick } from "vue";

const props = defineProps({
  show: Boolean,
  editedItem: Object,
  isSaving: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:show", "save"]);

const formRef = ref(null);
const isFormValid = ref(true);
const localItem = ref({});

const localDate = ref("");
const localTime = ref("");
const today = new Date().toISOString().split("T")[0]; // Để chặn chọn ngày quá khứ

const rules = {
  required: (v) => !!v || "Trường này là bắt buộc.",
  requiredArray: (v) => (v && v.length > 0) || "Phải chọn ít nhất một mục.",
  maxLength: (length) => (v) =>
    (v && v.length <= length) || `Không được vượt quá ${length} ký tự.`,
  positiveNumber: (v) => v > 0 || "Phải là số lớn hơn 0.",
};

const audienceOptions = [
  { title: "Tất cả học viên", value: "all" },
  { title: "Học viên theo cấp độ", value: "level" },
  { title: "Học viên không hoạt động", value: "inactive_users" },
];

const getDefaultItem = () => ({
  title: "",
  message: "",
  scheduleType: "daily",
  dailyTime: "08:00",
  oneTimeDateTime: null,
  targetAudience: "all",
  targetDetails: [],
  inactiveDays: 7, // Thêm giá trị mặc định
  status: "active",
});

watch(
  () => props.show,
  (isVisible) => {
    if (isVisible) {
      if (props.editedItem) {
        localItem.value = JSON.parse(JSON.stringify(props.editedItem));
        // Đảm bảo các trường mới có giá trị mặc định nếu item cũ không có
        if (!localItem.value.scheduleType)
          localItem.value.scheduleType = "daily";
        if (!localItem.value.inactiveDays) localItem.value.inactiveDays = 7;

        if (
          localItem.value.scheduleType === "one_time" &&
          localItem.value.oneTimeDateTime
        ) {
          const d = new Date(localItem.value.oneTimeDateTime);
          localDate.value = d.toISOString().split("T")[0];
          localTime.value = d.toTimeString().substring(0, 5);
        }
      } else {
        localItem.value = getDefaultItem();
      }
    }
  },
  { immediate: true }
);

const formTitle = computed(() => ({
  icon: props.editedItem
    ? "fa-solid fa-pen-to-square"
    : "fa-solid fa-plus-circle",
  text: props.editedItem ? "Chỉnh sửa Lịch nhắc nhở" : "Tạo Lịch nhắc nhở mới",
}));

const save = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const itemToSave = { ...localItem.value };
  if (itemToSave.scheduleType === "one_time") {
    itemToSave.oneTimeDateTime = new Date(
      `${localDate.value}T${localTime.value || "00:00"}`
    ).toISOString();
    itemToSave.dailyTime = null;
  } else {
    itemToSave.oneTimeDateTime = null;
  }
  emit("save", itemToSave);
};

const closeDialog = () => {
  if (props.isSaving) return; // Không cho đóng khi đang lưu
  emit("update:show", false);
  nextTick(() => {
    formRef.value?.reset();
    formRef.value?.resetValidation();
  });
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dialog-card {
  overflow: hidden;
}
.rounded-t-xl {
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
}
.dialog-card .v-card-text {
  padding: 30px !important;
  background-color: #f8f9fa;
}
.dialog-card .v-card-actions {
  border-top: 1px solid #eeeeee;
  padding: 20px 30px !important;
}
</style>
