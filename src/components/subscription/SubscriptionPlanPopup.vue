<template>
  <div class="modal-content custom-modal-content">
    <div class="modal-header custom-modal-header">
      <h5 class="modal-title">
        <i class="bi bi-gift-fill me-2"></i> {{ currentPlan.id ? 'Chỉnh sửa Gói đăng ký' : 'Thêm Gói đăng ký mới' }}
      </h5>
      <button type="button" class="btn-close" @click="$emit('close')"></button>
    </div>
    <div class="modal-body custom-modal-body">
      <form @submit.prevent="savePlan">
        <div class="mb-3">
          <label for="planName" class="form-label">Tên gói</label>
          <input type="text" class="form-control" id="planName" v-model="planForm.name" required>
        </div>
        <div class="mb-3">
          <label for="planDescription" class="form-label">Mô tả</label>
          <textarea class="form-control" id="planDescription" rows="3" v-model="planForm.description"></textarea>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="planPrice" class="form-label">Giá (VND)</label>
            <input type="number" class="form-control" id="planPrice" v-model.number="planForm.price" required min="0">
          </div>
          <div class="col-md-6 mb-3">
            <label for="planDuration" class="form-label">Thời hạn</label>
            <input type="text" class="form-control" id="planDuration" v-model="planForm.duration" placeholder="e.g., 1 tháng, 3 tháng, 1 năm" required>
          </div>
        </div>
        <div class="mb-3">
          <label for="planFeatures" class="form-label">Tính năng (mỗi tính năng một dòng)</label>
          <textarea class="form-control" id="planFeatures" rows="4" v-model="featuresInput"></textarea>
          <div class="form-text text-muted">Nhập mỗi tính năng trên một dòng riêng biệt.</div>
        </div>
        <div class="mb-4">
          <label for="planStatus" class="form-label">Trạng thái</label>
          <select class="form-select" id="planStatus" v-model="planForm.status">
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-secondary me-2" @click="$emit('close')">Hủy</button>
          <button type="submit" class="btn btn-primary">
            <i class="bi bi-save me-2"></i> Lưu
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch, reactive } from 'vue';

export default {
  props: {
    plan: {
      type: Object,
      default: null, // Null for add new plan
    },
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const defaultPlan = {
      id: null,
      name: '',
      description: '',
      price: 0,
      duration: '',
      features: [],
      status: 'active',
    };

    const currentPlan = reactive({ ...defaultPlan });
    const planForm = reactive({ ...defaultPlan });
    const featuresInput = ref('');

    const resetForm = () => {
      Object.assign(currentPlan, defaultPlan);
      Object.assign(planForm, defaultPlan);
      featuresInput.value = '';
    };

    watch(() => props.plan, (newVal) => {
      if (newVal) {
        Object.assign(currentPlan, newVal);
        Object.assign(planForm, { ...newVal });
        featuresInput.value = newVal.features ? newVal.features.join('\n') : '';
      } else {
        resetForm();
      }
    }, { immediate: true });

    const savePlan = () => {
      planForm.features = featuresInput.value.split('\n').map(f => f.trim()).filter(f => f.length > 0);
      emit('save', { ...planForm });
    };

    return {
      currentPlan,
      planForm,
      featuresInput,
      savePlan,
    };
  },
};
</script>

<style scoped>
.custom-modal-content {
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* Ensure border-radius applies */
  background-color: white; /* Make background white */
}

.custom-modal-header {
  background-color: rgba(234, 220, 220, 0.705); /* Primary color for header */
  color: black;
  border-bottom: none;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* Dưới đây là cách làm cho header nằm trong khối trắng */
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.custom-modal-header .modal-title {
  font-weight: 600;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}

.custom-modal-header .modal-title i {
  font-size: 1.8rem;
}

.custom-modal-header .btn-close {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  color: white;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.custom-modal-header .btn-close:hover {
  opacity: 1;
}

.custom-modal-body {
  padding: 2rem;
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-control, .form-select {
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  transition: all 0.2s ease;
}

.form-control:focus, .form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  outline: none;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}
</style>