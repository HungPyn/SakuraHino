<template>
  <div class="modal-content custom-popup-content">
    <div class="modal-header custom-popup-header">
      <h5 class="modal-title custom-popup-title">
        <i :class="modalIcon" class="me-2"></i>
        {{ localUser?.id ? 'Chỉnh sửa thông tin thành viên' : 'Thêm mới thành viên' }}
      </h5>
      <button type="button" class="btn-close custom-close-button" @click="$emit('close')" aria-label="Close"></button>
    </div>

    <div class="modal-body custom-popup-body">
      <form @submit.prevent="save">
        <div class="mb-3">
          <label for="name" class="form-label custom-label">Tên thành viên <span class="text-danger">*</span></label>
          <input
            type="text"
            id="name"
            class="form-control custom-input"
            v-model="localUser.name"
            :class="{ 'is-invalid': !localUser.name.trim() && formSubmitted }"
          />
          <div class="invalid-feedback" v-if="!localUser.name.trim() && formSubmitted">
            Vui lòng nhập tên thành viên.
          </div>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label custom-label">Email <span class="text-danger">*</span></label>
          <input
            type="email"
            id="email"
            class="form-control custom-input"
            v-model="localUser.email"
            :class="{ 'is-invalid': (!localUser.email.trim() || !isValidEmail) && formSubmitted }"
          />
          <div class="invalid-feedback" v-if="!localUser.email.trim() && formSubmitted">
            Vui lòng nhập email.
          </div>
          <div class="invalid-feedback" v-else-if="formSubmitted && !isValidEmail">
            Email không hợp lệ.
          </div>
        </div>
        <div class="mb-3">
          <label for="joinDate" class="form-label custom-label">Ngày tham gia</label>
          <input
            type="date"
            id="joinDate"
            class="form-control custom-input"
            v-model="localUser.joinDate"
          />
        </div>
        <div class="mb-3">
          <label for="level" class="form-label custom-label">Trình độ tiếng Nhật</label>
          <select id="level" class="form-select custom-select" v-model="localUser.level">
            <option value="N5">N5</option>
            <option value="N4">N4</option>
            <option value="N3">N3</option>
            <option value="N2">N2</option>
            <option value="N1">N1</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="totalPosts" class="form-label custom-label">Tổng số bài viết</label>
          <input
            type="number"
            id="totalPosts"
            class="form-control custom-input"
            v-model.number="localUser.totalPosts"
          />
        </div>
        <div class="mb-3">
          <label for="lastActive" class="form-label custom-label">Hoạt động gần nhất</label>
          <input
            type="date"
            id="lastActive"
            class="form-control custom-input"
            v-model="localUser.lastActive"
          />
        </div>
        <div class="mb-3">
          <label for="status" class="form-label custom-label">Trạng thái</label>
          <select id="status" class="form-select custom-select" v-model="localUser.status">
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="pending">Chờ duyệt</option>
            <option value="banned">Bị cấm</option>
          </select>
        </div>
      </form>
    </div>

    <div class="modal-footer custom-popup-footer">
      <button type="button" class="btn btn-secondary custom-cancel-button" @click="$emit('close')">Hủy</button>
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
</template>

<script>
import { ref, watch, computed } from 'vue';

export default {
  props: ['user'],
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const localUser = ref(
      props.user
        ? { ...props.user }
        : {
            id: null,
            name: '',
            email: '',
            joinDate: new Date().toISOString().slice(0, 10), // Default to current date
            level: 'N5',
            totalPosts: 0,
            lastActive: new Date().toISOString().slice(0, 10), // Default to current date
            status: 'active'
          }
    );
    const formSubmitted = ref(false);

    watch(
      () => props.user,
      (newVal) => {
        formSubmitted.value = false;
        localUser.value = newVal
          ? { ...newVal }
          : {
              id: null,
              name: '',
              email: '',
              joinDate: new Date().toISOString().slice(0, 10),
              level: 'N5',
              totalPosts: 0,
              lastActive: new Date().toISOString().slice(0, 10),
              status: 'active'
            };
      },
      { immediate: true, deep: true }
    );

    const isValidEmail = computed(() => {
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(localUser.value.email);
    });

    const isFormValid = computed(() => {
      return !!localUser.value.name.trim() && !!localUser.value.email.trim() && isValidEmail.value;
    });

    const save = () => {
      formSubmitted.value = true;
      if (!isFormValid.value) {
        return;
      }
      emit('save', { ...localUser.value });
    };

    const modalIcon = computed(() => {
      return localUser.value.id ? 'bi bi-person-lines-fill' : 'bi bi-person-add';
    });

    return {
      localUser,
      save,
      modalIcon,
      isFormValid,
      formSubmitted,
      isValidEmail,
    };
  },
};
</script>

<style scoped>
/* Custom styles for the popup content - Reused from EntertainmentPopup */
.custom-popup-content {
  border-radius: 1rem;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
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
  transition: opacity 0.2s ease;
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
  margin-bottom: 0.5rem;
  display: block;
}

.custom-input,
.custom-select {
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  transition: all 0.2s ease;
  font-size: 1rem;
  color: #495057;
}

.custom-input:focus,
.custom-select:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  outline: none;
}

/* Invalid feedback styling */
.custom-input.is-invalid {
  border-color: #dc3545;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
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
  transition: all 0.2s ease-in-out;
}

.custom-save-button {
  background-color: #007bff;
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

.custom-save-button:hover:not(:disabled) {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.custom-save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.custom-cancel-button {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.15);
}

.custom-cancel-button:hover:not(:disabled) {
  background-color: #5a6268;
  border-color: #545b62;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.25);
}

@media (max-width: 768px) {
  .custom-popup-header,
  .custom-popup-body,
  .custom-popup-footer {
    padding: 1rem 1.25rem;
  }

  .custom-popup-title {
    font-size: 1.25rem;
  }

  .custom-popup-title i {
    font-size: 1.5rem;
  }

  .custom-close-button {
    font-size: 1.25rem;
  }

  .custom-label {
    font-size: 0.9rem;
  }

  .custom-input,
  .custom-select {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }

  .custom-save-button,
  .custom-cancel-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>