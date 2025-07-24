<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ mode === 'add' ? 'Thêm lộ trình' : mode === 'edit' ? 'Chỉnh sửa lộ trình' : 'Chi tiết lộ trình' }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submit"> <div class="row g-3">
              <div class="col-md-6">
                <label for="pathName" class="form-label required-label">Tên lộ trình</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-journals"></i></span>
                  <input
                    id="pathName"
                    v-model.trim="form.pathName"
                    class="form-control"
                    :class="{ 'is-invalid': errors.pathName }"
                    :disabled="isDetail"
                  />
                </div>
                <div v-if="errors.pathName" class="invalid-feedback d-block">{{ errors.pathName }}</div>
              </div>

              <div class="col-md-6">
                <label for="accessCount" class="form-label required-label">Số học viên đã tiếp cận</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-people-fill"></i></span>
                  <input
                    id="accessCount"
                    type="number"
                    v-model.number="form.accessCount"
                    class="form-control"
                    :class="{ 'is-invalid': errors.accessCount }"
                    :disabled="isDetail"
                    min="0"
                  />
                </div>
                <div v-if="errors.accessCount" class="invalid-feedback d-block">{{ errors.accessCount }}</div>
              </div>

              <div class="col-md-6">
                <label for="progressText" class="form-label required-label">Tiến độ (ví dụ: 9/12 khóa học)</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-bar-chart-steps"></i></span>
                  <input
                    id="progressText"
                    v-model.trim="form.progressText"
                    class="form-control"
                    :class="{ 'is-invalid': errors.progressText }"
                    :disabled="isDetail"
                  />
                </div>
                <div v-if="errors.progressText" class="invalid-feedback d-block">{{ errors.progressText }}</div>
              </div>

              <div class="col-md-6">
                <label for="progressPercent" class="form-label required-label">Phần trăm hoàn thành</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-percent"></i></span>
                  <input
                    id="progressPercent"
                    type="number"
                    v-model.number="form.progressPercent"
                    class="form-control"
                    :class="{ 'is-invalid': errors.progressPercent }"
                    :disabled="isDetail"
                    min="0"
                    max="100"
                  />
                </div>
                <div v-if="errors.progressPercent" class="invalid-feedback d-block">{{ errors.progressPercent }}</div>
              </div>

              <div class="col-md-6">
                <label for="status" class="form-label required-label">Trạng thái</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-activity"></i></span>
                  <select
                    id="status"
                    v-model="form.status"
                    class="form-select"
                    :class="{ 'is-invalid': errors.status }"
                    :disabled="isDetail"
                  >
                    <option value="">Chọn trạng thái</option> <option>Đang học</option>
                    <option>Hoàn thành</option>
                    <option>Tạm dừng</option>
                  </select>
                </div>
                <div v-if="errors.status" class="invalid-feedback d-block">{{ errors.status }}</div>
              </div>

              <div class="col-md-6">
                <label for="duration" class="form-label">Thời gian (ví dụ: 3 tháng)</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-calendar-range"></i></span>
                  <input
                    id="duration"
                    v-model.trim="form.duration"
                    class="form-control"
                    :disabled="isDetail"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label for="lastActive" class="form-label">Hoạt động gần nhất</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-clock-history"></i></span>
                  <input
                    id="lastActive"
                    type="date"
                    v-model="form.lastActive"
                    class="form-control"
                    :disabled="isDetail"
                  />
                </div>
              </div>

              <div class="col-12">
                <label for="description" class="form-label">Mô tả</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-card-text"></i></span>
                  <textarea
                    id="description"
                    v-model.trim="form.description"
                    class="form-control"
                    rows="3"
                    :disabled="isDetail"
                  ></textarea>
                </div>
              </div>
              <div class="col-md-6">
                <label for="startDate" class="form-label">Ngày bắt đầu</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-calendar-check"></i></span>
                  <input
                    id="startDate"
                    type="date"
                    v-model="form.startDate"
                    class="form-control"
                    :disabled="isDetail"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label for="endDate" class="form-label">Ngày kết thúc dự kiến</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-calendar-x"></i></span>
                  <input
                    id="endDate"
                    type="date"
                    v-model="form.endDate"
                    class="form-control"
                    :disabled="isDetail"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label for="totalLessons" class="form-label">Tổng số bài học</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-hash"></i></span>
                  <input
                    id="totalLessons"
                    type="number"
                    v-model.number="form.totalLessons"
                    class="form-control"
                    :disabled="isDetail"
                    min="0"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label for="completedLessons" class="form-label">Bài học đã hoàn thành</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-check-all"></i></span>
                  <input
                    id="completedLessons"
                    type="number"
                    v-model.number="form.completedLessons"
                    class="form-control"
                    :disabled="isDetail"
                    min="0"
                    :max="form.totalLessons"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label for="teacher" class="form-label">Giáo viên</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person-badge"></i></span>
                  <input
                    id="teacher"
                    v-model.trim="form.teacher"
                    class="form-control"
                    :disabled="isDetail"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label for="contact" class="form-label">Liên hệ</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input
                    id="contact"
                    type="email"
                    v-model.trim="form.contact"
                    class="form-control"
                    :disabled="isDetail"
                  />
                </div>
                <div v-if="errors.contact" class="invalid-feedback d-block">{{ errors.contact }}</div>
              </div>
            </div>
          </form> </div>
        <div class="modal-footer" v-if="!isDetail">
          <button class="btn btn-secondary" @click="$emit('close')">Hủy</button>
          <button class="btn btn-primary" @click="submit">
            {{ mode === 'edit' ? 'Cập nhật' : 'Thêm mới' }}
          </button>
        </div>
        <div class="modal-footer" v-else>
          <button class="btn btn-secondary" @click="$emit('close')">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
    mode: String // 'add', 'edit', 'detail'
  },
  emits: ['close', 'save'],
  data() {
    return {
      form: this.data ? { ...this.data } : {
        pathName: '',
        accessCount: 0, // Thêm trường mới
        progressText: '',
        progressPercent: 0,
        status: '',
        duration: '',
        lastActive: '',
        description: '',
        startDate: '',
        endDate: '',
        totalLessons: 0,
        completedLessons: 0,
        teacher: '',
        contact: ''
      },
      errors: { // Object để lưu trữ các thông báo lỗi
        pathName: '',
        accessCount: '', // Thêm lỗi cho trường mới
        progressText: '',
        progressPercent: '',
        status: '',
        contact: '',
      }
    };
  },
  computed: {
    isDetail() {
      return this.mode === 'detail';
    }
  },
  methods: {
    validateForm() {
      this.errors = {
        pathName: '',
        accessCount: '',
        progressText: '',
        progressPercent: '',
        status: '',
        contact: '',
      };
      let isValid = true;

      // Validate Tên lộ trình
      if (!this.form.pathName) {
        this.errors.pathName = 'Tên lộ trình không được để trống.';
        isValid = false;
      } else if (this.form.pathName.length < 5) {
        this.errors.pathName = 'Tên lộ trình phải có ít nhất 5 ký tự.';
        isValid = false;
      }

      // Validate Số học viên đã tiếp cận
      if (this.form.accessCount === null || this.form.accessCount === undefined || this.form.accessCount === '') {
        this.errors.accessCount = 'Số học viên đã tiếp cận không được để trống.';
        isValid = false;
      } else if (isNaN(this.form.accessCount) || this.form.accessCount < 0) {
        this.errors.accessCount = 'Số học viên phải là số nguyên không âm.';
        isValid = false;
      }

      // Validate Tiến độ (text)
      if (!this.form.progressText) {
        this.errors.progressText = 'Tiến độ không được để trống.';
        isValid = false;
      }

      // Validate Phần trăm hoàn thành
      if (this.form.progressPercent === null || this.form.progressPercent === undefined || this.form.progressPercent === '') {
        this.errors.progressPercent = 'Phần trăm hoàn thành không được để trống.';
        isValid = false;
      } else if (isNaN(this.form.progressPercent) || this.form.progressPercent < 0 || this.form.progressPercent > 100) {
        this.errors.progressPercent = 'Phần trăm hoàn thành phải là số từ 0 đến 100.';
        isValid = false;
      }

      // Validate Trạng thái
      if (!this.form.status) {
        this.errors.status = 'Vui lòng chọn trạng thái.';
        isValid = false;
      }

      // Validate Contact (email) - chỉ nếu trường này được điền
      if (this.form.contact && !this.isValidEmail(this.form.contact)) {
        this.errors.contact = 'Email không hợp lệ.';
        isValid = false;
      }

      // Validate Completed Lessons (nếu có và lớn hơn Total Lessons)
      if (this.form.completedLessons !== null && this.form.totalLessons !== null && this.form.completedLessons > this.form.totalLessons) {
          alert('Bài học hoàn thành không thể lớn hơn tổng số bài học.');
          isValid = false;
      }

      return isValid;
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    submit() {
      if (this.isDetail) {
        this.$emit('close');
        return;
      }

      if (this.validateForm()) {
        this.$emit('save', this.form);
      } else {
        // Có thể thêm một thông báo chung nếu validation thất bại
        // this.$emit('show-toast', 'Vui lòng điền đầy đủ và chính xác các thông tin!', 'error');
      }
    }
  },
  watch: {
    data: {
      handler(newData) {
        if (newData) {
          this.form = { ...newData };
        } else {
          // Reset form cho chế độ 'add'
          this.form = {
            pathName: '',
            accessCount: 0, // Reset
            progressText: '',
            progressPercent: 0,
            status: '',
            duration: '',
            lastActive: '',
            description: '',
            startDate: '',
            endDate: '',
            totalLessons: 0,
            completedLessons: 0,
            teacher: '',
            contact: ''
          };
        }
        // Reset lỗi mỗi khi dữ liệu form thay đổi
        this.errors = {
          pathName: '', accessCount: '', progressText: '', progressPercent: '', status: '', contact: ''
        };
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped>
/* Giữ nguyên các style cũ của popup và validation */
.modal { z-index: 1050; }
.modal-backdrop { z-index: 1040; }

.input-group-text {
  background-color: #e9ecef;
  border-right: none;
  color: #6c757d;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem 0 0 0.375rem;
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

.form-label {
  font-weight: 500;
  color: #343a40;
  margin-bottom: 0.5rem;
  display: block;
}

.required-label::after {
  content: ' *';
  color: #dc3545;
  font-weight: normal;
}

.form-control:disabled,
.form-select:disabled {
  background-color: #f8f9fa;
  opacity: 1;
  color: #495057;
}

.input-group:has(.form-control:disabled) .input-group-text,
.input-group:has(.form-select:disabled) .input-group-text {
  background-color: #e9ecef;
  color: #6c757d;
}

.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #dc3545;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.input-group:has(.form-control.is-invalid) .input-group-text,
.input-group:has(.form-select.is-invalid) .input-group-text {
    border-color: #dc3545;
}

.invalid-feedback.d-block {
  font-size: 0.875em;
  color: #dc3545;
  margin-top: 0.25rem;
}
</style>