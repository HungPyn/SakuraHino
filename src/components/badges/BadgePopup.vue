<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ mode === 'add' ? 'Thêm Huy hiệu mới' : mode === 'edit' ? 'Chỉnh sửa Huy hiệu' : 'Chi tiết Huy hiệu' }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submit">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="badgeName" class="form-label required-label">Tên huy hiệu</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-award"></i></span>
                  <input
                    id="badgeName"
                    v-model.trim="form.name"
                    class="form-control"
                    :class="{ 'is-invalid': errors.name }"
                    :disabled="isDetailMode"
                  />
                </div>
                <div v-if="errors.name" class="invalid-feedback d-block">{{ errors.name }}</div>
              </div>

              <div class="col-md-6">
                <label for="icon" class="form-label required-label">Icon (Bootstrap icon class)</label>
                <div class="input-group">
                  <span class="input-group-text"><i :class="['bi', form.icon || 'bi-question-circle']"></i></span>
                  <input
                    id="icon"
                    type="text"
                    v-model.trim="form.icon"
                    class="form-control"
                    :class="{ 'is-invalid': errors.icon }"
                    :disabled="isDetailMode"
                    placeholder="vd: bi-star-fill"
                  />
                </div>
                <div v-if="errors.icon" class="invalid-feedback d-block">{{ errors.icon }}</div>
                <small class="form-text text-muted ms-1">Ví dụ: `bi-star-fill`, `bi-shield-fill`...</small>
              </div>

              <div class="col-md-6">
                <label for="color" class="form-label required-label">Màu sắc</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-palette-fill"></i></span>
                  <input
                    id="color"
                    type="color"
                    v-model="form.color"
                    class="form-control form-control-color"
                    :class="{ 'is-invalid': errors.color }"
                    :disabled="isDetailMode"
                  />
                </div>
                <div v-if="errors.color" class="invalid-feedback d-block">{{ errors.color }}</div>
              </div>

              <div class="col-md-6">
                <label for="points" class="form-label">Điểm thưởng</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-award-fill"></i></span>
                  <input
                    id="points"
                    type="number"
                    v-model.number="form.points"
                    class="form-control"
                    :class="{ 'is-invalid': errors.points }"
                    :disabled="isDetailMode"
                    min="0"
                  />
                </div>
                <div v-if="errors.points" class="invalid-feedback d-block">{{ errors.points }}</div>
              </div>


              <div class="col-12">
                <label for="description" class="form-label required-label">Mô tả</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-card-text"></i></span>
                  <textarea
                    id="description"
                    v-model.trim="form.description"
                    class="form-control"
                    :class="{ 'is-invalid': errors.description }"
                    :disabled="isDetailMode"
                    rows="3"
                  ></textarea>
                </div>
                <div v-if="errors.description" class="invalid-feedback d-block">{{ errors.description }}</div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer" v-if="!isDetailMode">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Hủy</button>
          <button type="button" class="btn btn-primary" @click="submit">
            {{ mode === 'edit' ? 'Cập nhật' : 'Thêm mới' }}
          </button>
        </div>
        <div class="modal-footer" v-else>
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    badge: {
      type: Object,
      default: null,
    },
    mode: {
      type: String,
      default: 'add', // 'add', 'edit', 'detail'
    },
  },
  emits: ['save', 'close'],
  data() {
    return {
      form: this.badge ? { ...this.badge } : this.initializeForm(),
      errors: {
        name: '',
        description: '',
        icon: '',
        color: '',
        points: '', // Thêm lỗi cho points nếu bạn sử dụng nó
      },
    };
  },
  computed: {
    isDetailMode() {
      return this.mode === 'detail';
    },
  },
  watch: {
    badge: {
      handler(newBadge) {
        this.form = newBadge ? { ...newBadge } : this.initializeForm();
        this.resetErrors();
      },
      deep: true,
      immediate: true,
    },
    mode: {
      handler(newMode) {
        if (newMode === 'add' && !this.badge) { // Only re-initialize if it's 'add' mode and no initial badge data
          this.form = this.initializeForm();
        }
        this.resetErrors();
      },
      immediate: true,
    },
  },
  methods: {
    initializeForm() {
      return {
        id: null,
        name: '',
        description: '',
        icon: 'bi-star-fill', // Default icon
        color: '#0d6efd',    // Default Bootstrap primary blue
        points: 0,           // Default points (if you use it)
      };
    },
    resetErrors() {
      this.errors = {
        name: '',
        description: '',
        icon: '',
        color: '',
        points: '',
      };
    },
    validateForm() {
      this.resetErrors();
      let isValid = true;

      // Validate Tên huy hiệu
      if (!this.form.name || this.form.name.trim() === '') {
        this.errors.name = 'Tên huy hiệu không được để trống.';
        isValid = false;
      } else if (this.form.name.trim().length < 3) {
        this.errors.name = 'Tên huy hiệu phải có ít nhất 3 ký tự.';
        isValid = false;
      }

      // Validate Mô tả
      if (!this.form.description || this.form.description.trim() === '') {
        this.errors.description = 'Mô tả không được để trống.';
        isValid = false;
      } else if (this.form.description.trim().length < 10) {
        this.errors.description = 'Mô tả phải có ít nhất 10 ký tự.';
        isValid = false;
      }

      // Validate Icon
      if (!this.form.icon || this.form.icon.trim() === '') {
        this.errors.icon = 'Icon không được để trống.';
        isValid = false;
      } else if (!this.form.icon.startsWith('bi-')) {
          this.errors.icon = 'Icon phải bắt đầu bằng "bi-" (ví dụ: bi-star-fill).';
          isValid = false;
      }


      // Validate Màu sắc
      if (!this.form.color || this.form.color.trim() === '') {
        this.errors.color = 'Màu sắc không được để trống.';
        isValid = false;
      }
      // You could add a regex here to validate hex color format if needed

      // Validate Điểm thưởng (nếu có)
      if (this.form.points === null || this.form.points === undefined || this.form.points === '') {
        this.errors.points = 'Điểm thưởng không được để trống.';
        isValid = false;
      } else if (isNaN(this.form.points) || this.form.points < 0) {
        this.errors.points = 'Điểm thưởng phải là số không âm.';
        isValid = false;
      }


      return isValid;
    },
    submit() {
      if (this.isDetailMode) {
        this.$emit('close');
        return;
      }

      if (this.validateForm()) {
        this.$emit('save', this.form);
      } else {
        // Có thể thêm một thông báo chung ở đây nếu muốn
        // this.$emit('show-toast', 'Vui lòng kiểm tra lại các trường bị lỗi!', 'error');
      }
    },
  },
};
</script>

<style scoped>
/* Modal backdrop and general positioning */
.modal {
  background: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}

/* Custom modal styling to match other popups */
.modal-dialog {
  max-width: 90%; /* Allow wider modal */
}

.modal-content {
  border-radius: 1rem; /* Rounded corners */
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* Stronger shadow */
}

/* Input group styling for icons */
.input-group-text {
  background-color: #e9ecef;
  border-right: none;
  color: #6c757d;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem 0 0 0.375rem;
  display: flex;
  align-items: center; /* Center icon vertically */
}

.input-group .form-control,
.input-group .form-select {
  border-left: none;
  border-radius: 0 0.375rem 0.375rem 0;
}

.input-group .form-control:focus,
.input-group .form-select:focus {
  z-index: 3;
}

/* Label styling */
.form-label {
  font-weight: 500;
  color: #343a40;
  margin-bottom: 0.5rem;
  display: block;
}

/* Required field indicator */
.required-label::after {
  content: ' *';
  color: #dc3545; /* Bootstrap danger red */
  font-weight: normal;
}

/* Disabled input styling */
.form-control:disabled,
.form-select:disabled,
.form-control-color:disabled {
  background-color: #f8f9fa;
  opacity: 1;
  color: #495057;
  cursor: not-allowed;
}

/* Disabled input-group-text styling */
.input-group:has(.form-control:disabled) .input-group-text,
.input-group:has(.form-select:disabled) .input-group-text,
.input-group:has(.form-control-color:disabled) .input-group-text {
  background-color: #e9ecef;
  color: #6c757d;
}

/* Validation specific styles */
.form-control.is-invalid,
.form-select.is-invalid,
.form-control-color.is-invalid {
  border-color: #dc3545; /* Red border on error */
  padding-right: calc(1.5em + 0.75rem); /* Space for error icon */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e"); /* Error icon */
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.input-group:has(.form-control.is-invalid) .input-group-text,
.input-group:has(.form-select.is-invalid) .input-group-text,
.input-group:has(.form-control-color.is-invalid) .input-group-text {
    border-color: #dc3545; /* Change border color of input-group-text on error */
}

.invalid-feedback.d-block {
  font-size: 0.875em;
  color: #dc3545;
  margin-top: 0.25rem;
}

/* Specific styling for color input to make it visually appealing */
.form-control-color {
  height: 44px; /* Adjust height to match other inputs */
  padding: 0.375rem; /* Smaller padding */
  border-radius: 0 0.375rem 0.375rem 0; /* Match border radius */
}

.form-control-color::-webkit-color-swatch-wrapper {
    padding: 0;
}
.form-control-color::-webkit-color-swatch {
    border-radius: 0.25rem;
    border: 1px solid #dee2e6;
}
</style>