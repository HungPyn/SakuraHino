<template>
  <div class="modal fade" id="topicFormModal" tabindex="-1" aria-labelledby="topicFormModalLabel" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="topicFormModalLabel">{{ isEditMode ? 'Chỉnh Sửa Chủ Đề' : 'Thêm Chủ Đề Mới' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveTopic">
            <div class="mb-3">
              <label for="topicName" class="form-label">Tên Chủ đề <span class="text-danger">*</span></label>
              <input type="text" class="form-control" :class="{'is-invalid': errors.name}" id="topicName" v-model="topic.name" required>
              <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
            </div>
            <div class="mb-3">
              <label for="topicDescription" class="form-label">Mô tả</label>
              <textarea class="form-control" :class="{'is-invalid': errors.description}" id="topicDescription" v-model="topic.description" rows="3"></textarea>
              <div class="invalid-feedback" v-if="errors.description">{{ errors.description }}</div>
            </div>
            <div class="mb-3">
              <label for="topicImageUrl" class="form-label">URL Hình ảnh</label>
              <input type="url" class="form-control" :class="{'is-invalid': errors.url_image}" id="topicImageUrl" v-model="topic.url_image">
              <div class="invalid-feedback" v-if="errors.url_image">{{ errors.url_image }}</div>
            </div>
            <div class="mb-3">
              <label for="topicStatus" class="form-label">Trạng thái <span class="text-danger">*</span></label>
              <select class="form-select" :class="{'is-invalid': errors.status}" id="topicStatus" v-model="topic.status" required>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
              <div class="invalid-feedback" v-if="errors.status">{{ errors.status }}</div>
            </div>
            <div class="modal-footer d-flex justify-content-between">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="submit" class="btn btn-primary">Lưu Chủ đề</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import topicService from '../../services/topicService';

const emit = defineEmits(['topic-saved']);

const modalRef = ref(null);
let bsModal = null;

const initialTopicState = {
  id: null,
  name: '',
  description: '',
  url_image: '',
  status: 'active'
};

const topic = reactive({ ...initialTopicState });
const isEditMode = ref(false);
const errors = reactive({});

// Hàm mở modal
function openModal(topicData = null) {
  Object.assign(errors, {}); // Clear previous errors
  if (topicData) {
    isEditMode.value = true;
    Object.assign(topic, JSON.parse(JSON.stringify(topicData))); // Deep copy
  } else {
    isEditMode.value = false;
    Object.assign(topic, initialTopicState); // Reset to initial state
  }
  bsModal.show();
}

// Hàm đóng modal
function closeModal() {
  bsModal.hide();
}

// Hàm lưu chủ đề
async function saveTopic() {
  Object.assign(errors, {}); // Clear errors before validation

  const validationResult = topicService.validateTopicData(topic);

  if (!validationResult.isValid) {
    validationResult.errors.forEach(error => {
      // Map error messages to specific fields
      if (error.includes('Tên chủ đề')) errors.name = error;
      else if (error.includes('Mô tả')) errors.description = error;
      else if (error.includes('URL hình ảnh')) errors.url_image = error;
      else if (error.includes('Trạng thái')) errors.status = error;
      else if (!errors.general) errors.general = error;
    });
    // Fallback if no specific field mapping
    if (Object.keys(errors).length === 0 && validationResult.errors.length > 0) {
      alert(validationResult.errors.join('\n'));
    }
    return; // Stop if validation fails
  }

  try {
    const isNew = !topic.id; // Check if it's a new topic or update

    // Emit 'topic-saved' with 'isNew' flag
    // The parent (LessonAdminView) will handle the confirmation and then call the service
    emit('topic-saved', isNew);

    closeModal();

  } catch (error) {
    console.error("Error saving topic:", error);
    alert('Có lỗi xảy ra khi lưu chủ đề: ' + error.message);
  }
}

// Expose openModal to parent component
defineExpose({
  openModal
});

// Initialize Bootstrap Modal on component mount
onMounted(() => {
  bsModal = new Modal(modalRef.value);
  modalRef.value.addEventListener('hidden.bs.modal', () => {
    Object.assign(topic, initialTopicState); // Reset form when modal is closed
    Object.assign(errors, {}); // Clear errors
  });
});
</script>

<style scoped>
/* Scoped styles for TopicFormModal */
.modal-title {
  color: #007bff;
}

.form-label {
  font-weight: 500;
  color: #555;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
}
</style>