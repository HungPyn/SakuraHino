<template>
  <div class="modal fade show d-block popup-overlay" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-popup-content">
        <div class="modal-header custom-popup-header">
          <h5 class="modal-title custom-popup-title">
            <i :class="modalIcon" class="me-2"></i>
            {{ localReminder.id ? "Chỉnh sửa nhắc nhở" : "Thêm nhắc nhở mới" }}
          </h5>
          <button
            type="button"
            class="btn-close custom-close-button"
            @click="$emit('close')"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body custom-popup-body">
          <form @submit.prevent="save">
            <div class="mb-3">
              <label for="title" class="form-label custom-label"
                >Tiêu đề nhắc nhở <span class="text-danger">*</span></label
              >
              <input
                type="text"
                id="title"
                class="form-control custom-input"
                v-model="localReminder.title"
                :class="{ 'is-invalid': !localReminder.title && formSubmitted }"
              />
              <div
                class="invalid-feedback"
                v-if="!localReminder.title && formSubmitted"
              >
                Tiêu đề nhắc nhở không được để trống.
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="userName" class="form-label custom-label"
                  >Người tạo</label
                >
                <input
                  type="text"
                  id="userName"
                  class="form-control custom-input"
                  v-model="localReminder.userName"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label for="time" class="form-label custom-label"
                  >Thời gian</label
                >
                <input
                  type="time"
                  id="time"
                  class="form-control custom-input"
                  v-model="localReminder.time"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="type" class="form-label custom-label"
                  >Loại nhắc nhở</label
                >
                <input
                  type="text"
                  id="type"
                  class="form-control custom-input"
                  v-model="localReminder.type"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label for="createdAt" class="form-label custom-label"
                  >Ngày tạo <span class="text-danger">*</span></label
                >
                <input
                  type="date"
                  id="createdAt"
                  class="form-control custom-input"
                  v-model="localReminder.createdAt"
                  :class="{
                    'is-invalid': !localReminder.createdAt && formSubmitted,
                  }"
                />
                <div
                  class="invalid-feedback"
                  v-if="!localReminder.createdAt && formSubmitted"
                >
                  Ngày tạo không được để trống.
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="status" class="form-label custom-label"
                >Trạng thái</label
              >
              <select
                id="status"
                class="form-select custom-select"
                v-model="localReminder.status"
              >
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Đang chờ">Đang chờ</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
                <option value="Tạm dừng">Tạm dừng</option>
              </select>
            </div>
          </form>
        </div>

        <div class="modal-footer custom-popup-footer">
          <button
            type="button"
            class="btn btn-secondary custom-cancel-button"
            @click="$emit('close')"
          >
            Hủy
          </button>
          <button
            type="button"
            class="btn btn-primary custom-save-button"
            :disabled="!isFormValid"
            @click="save"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";

export default {
  props: {
    reminder: {
      type: Object,
      default: null,
    },
  },
  emits: ["save", "close"],
  setup(props, { emit }) {
    const localReminder = ref({
      id: null,
      title: "",
      userName: "",
      time: "09:00",
      type: "",
      createdAt: new Date().toISOString().slice(0, 10),
      status: "Đang chờ",
    });

    const formSubmitted = ref(false);

    watch(
      () => props.reminder,
      (newVal) => {
        formSubmitted.value = false;
        if (newVal) {
          localReminder.value = { ...newVal };
          if (localReminder.value.createdAt) {
            localReminder.value.createdAt = new Date(
              localReminder.value.createdAt
            )
              .toISOString()
              .slice(0, 10);
          }
        } else {
          localReminder.value = {
            id: null,
            title: "",
            userName: "",
            time: "09:00",
            type: "",
            reachCount: 0,
            createdAt: new Date().toISOString().slice(0, 10),
            status: "Đang chờ",
          };
        }
      },
      { immediate: true, deep: true }
    );

    const isFormValid = computed(() => {
      return !!localReminder.value.title && !!localReminder.value.createdAt;
    });

    const save = () => {
      formSubmitted.value = true;
      if (!isFormValid.value) return;
      emit("save", { ...localReminder.value });
    };

    const modalIcon = computed(() =>
      localReminder.value.id ? "bi bi-pencil-square" : "bi bi-plus-circle-fill"
    );

    return {
      localReminder,
      save,
      modalIcon,
      isFormValid,
      formSubmitted,
    };
  },
};
</script>

<style scoped>
.popup-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.custom-popup-content {
  background-color: #ffffff;
  border-radius: 1rem;
  border: none;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1055;
}

.custom-popup-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem 2rem;
  background-color: #f8fafd;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  display: flex;
  align-items: center;
}

.custom-popup-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

.custom-popup-title i {
  font-size: 1.75rem;
  color: #007bff;
}

.custom-close-button {
  font-size: 1.5rem;
  padding: 0.5rem;
  margin: -0.5rem -0.5rem -0.5rem auto;
  color: #6c757d;
  opacity: 0.7;
}

.custom-close-button:hover {
  opacity: 1;
  color: #343a40;
}

.custom-popup-body {
  padding: 2rem;
}

.custom-label {
  font-weight: 600;
  color: #495057;
}

.custom-input,
.custom-select {
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  font-size: 1rem;
  color: #495057;
}

.custom-input:focus,
.custom-select:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  outline: none;
}

.custom-input.is-invalid {
  border-color: #dc3545;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem 1rem;
}

.invalid-feedback {
  font-size: 0.875em;
  color: #dc3545;
  margin-top: 0.25rem;
}

.custom-popup-footer {
  border-top: 1px solid #e9ecef;
  padding: 1.25rem 2rem;
  background-color: #f8fafd;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.custom-save-button,
.custom-cancel-button {
  padding: 0.65rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
}

.custom-save-button {
  background-color: #007bff;
  border: none;
  color: white;
}

.custom-save-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.custom-save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.custom-cancel-button {
  background-color: #6c757d;
  color: white;
  border: none;
}

.custom-cancel-button:hover:not(:disabled) {
  background-color: #5a6268;
}
</style>
