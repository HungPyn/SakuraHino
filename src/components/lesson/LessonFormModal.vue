<template>
  <div class="modal fade" id="lessonFormModal" tabindex="-1" aria-labelledby="lessonFormModalLabel" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="lessonFormModalLabel">{{ isEditMode ? 'Chỉnh Sửa Bài Học' : 'Thêm Bài Học Mới' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveLesson">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="lessonName" class="form-label">Tên Bài học <span class="text-danger">*</span></label>
                <input type="text" class="form-control" :class="{'is-invalid': errors.name}" id="lessonName" v-model="lesson.name" required>
                <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="lessonLevel" class="form-label">Cấp độ <span class="text-danger">*</span></label>
                <select class="form-select" :class="{'is-invalid': errors.level}" id="lessonLevel" v-model="lesson.level" required>
                  <option value="" disabled>Chọn cấp độ</option>
                  <option v-for="level in availableLevels" :key="level" :value="level">{{ level }}</option>
                </select>
                <div class="invalid-feedback" v-if="errors.level">{{ errors.level }}</div>
              </div>
            </div>

            <div class="mb-3">
              <label for="lessonTopic" class="form-label">Chủ đề <span class="text-danger">*</span></label>
              <select class="form-select" :class="{'is-invalid': errors.topic_id}" id="lessonTopic" v-model="lesson.topic_id" required>
                <option value="" disabled>Chọn chủ đề</option>
                <option v-for="topic in availableTopics" :key="topic.id" :value="topic.id">{{ topic.name }}</option>
              </select>
              <div class="invalid-feedback" v-if="errors.topic_id">{{ errors.topic_id }}</div>
            </div>

            <div class="mb-3">
              <label for="lessonDescription" class="form-label">Mô tả</label>
              <textarea class="form-control" :class="{'is-invalid': errors.description}" id="lessonDescription" v-model="lesson.description" rows="3"></textarea>
              <div class="invalid-feedback" v-if="errors.description">{{ errors.description }}</div>
            </div>

            <div class="mb-3">
              <label for="lessonImageUrl" class="form-label">URL Hình ảnh</label>
              <input type="url" class="form-control" :class="{'is-invalid': errors.imageUrl}" id="lessonImageUrl" v-model="lesson.imageUrl">
              <div class="invalid-feedback" v-if="errors.imageUrl">{{ errors.imageUrl }}</div>
            </div>

            <div class="mb-3">
              <label for="lessonStatus" class="form-label">Trạng thái <span class="text-danger">*</span></label>
              <select class="form-select" :class="{'is-invalid': errors.status}" id="lessonStatus" v-model="lesson.status" required>
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
              </select>
              <div class="invalid-feedback" v-if="errors.status">{{ errors.status }}</div>
            </div>

            <hr class="my-4">

            <h6>Nội dung chi tiết bài học</h6>

            <div class="mb-4 p-3 border rounded">
              <h5 class="d-flex justify-content-between align-items-center">
                Từ vựng
                <button type="button" class="btn btn-sm btn-outline-primary" @click="addVocabularyItem">
                  <i class="bi bi-plus-circle"></i> Thêm từ
                </button>
              </h5>
              <div v-for="(vocab, index) in lesson.vocabulary" :key="index" class="row g-2 mb-2 align-items-end">
                <div class="col-md-4">
                  <label :for="'vocabWord' + index" class="form-label small">Từ/Cụm từ</label>
                  <input type="text" class="form-control form-control-sm" :id="'vocabWord' + index" v-model="vocab.word">
                </div>
                <div class="col-md-4">
                  <label :for="'vocabMeaning' + index" class="form-label small">Nghĩa</label>
                  <input type="text" class="form-control form-control-sm" :id="'vocabMeaning' + index" v-model="vocab.meaning">
                </div>
                <div class="col-md-3">
                  <label :for="'vocabReading' + index" class="form-label small">Cách đọc (Hiragana/Katakana)</label>
                  <input type="text" class="form-control form-control-sm" :id="'vocabReading' + index" v-model="vocab.reading">
                </div>
                <div class="col-md-1">
                  <button type="button" class="btn btn-sm btn-danger w-100" @click="removeVocabularyItem(index)">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="mb-4 p-3 border rounded">
              <h5 class="d-flex justify-content-between align-items-center">
                Ngữ pháp
                <button type="button" class="btn btn-sm btn-outline-primary" @click="addGrammarItem">
                  <i class="bi bi-plus-circle"></i> Thêm cấu trúc
                </button>
              </h5>
              <div v-for="(grammar, index) in lesson.grammar" :key="index" class="mb-3 border-bottom pb-3">
                <div class="row g-2 mb-2">
                  <div class="col-md-6">
                    <label :for="'grammarStructure' + index" class="form-label small">Cấu trúc</label>
                    <input type="text" class="form-control form-control-sm" :id="'grammarStructure' + index" v-model="grammar.structure">
                  </div>
                  <div class="col-md-6">
                    <label :for="'grammarMeaning' + index" class="form-label small">Ý nghĩa</label>
                    <input type="text" class="form-control form-control-sm" :id="'grammarMeaning' + index" v-model="grammar.meaning">
                  </div>
                </div>
                <div class="mb-2">
                  <label :for="'grammarExplanation' + index" class="form-label small">Giải thích</label>
                  <textarea class="form-control form-control-sm" :id="'grammarExplanation' + index" v-model="grammar.explanation" rows="2"></textarea>
                </div>
                <div class="text-end">
                  <button type="button" class="btn btn-sm btn-danger" @click="removeGrammarItem(index)">
                    Xóa cấu trúc
                  </button>
                </div>
              </div>
            </div>

            <div class="mb-4 p-3 border rounded">
              <h5>Luyện nghe</h5>
              <div class="mb-3">
                <label for="listeningTitle" class="form-label">Tiêu đề phần nghe</label>
                <input type="text" class="form-control" id="listeningTitle" v-model="lesson.listening.title">
              </div>
              <div class="mb-3">
                <label for="listeningAudioUrl" class="form-label">URL Audio</label>
                <input type="url" class="form-control" id="listeningAudioUrl" v-model="lesson.listening.audioUrl">
              </div>
              <div class="mb-3">
                <label for="listeningScript" class="form-label">Script</label>
                <textarea class="form-control" id="listeningScript" v-model="lesson.listening.script" rows="4"></textarea>
              </div>

              <h6>Câu hỏi nghe</h6>
              <button type="button" class="btn btn-sm btn-outline-primary mb-3" @click="addListeningQuestion">
                <i class="bi bi-plus-circle"></i> Thêm câu hỏi
              </button>
              <div v-for="(q, qIndex) in lesson.listening.questions" :key="qIndex" class="mb-3 p-2 border rounded bg-light">
                <div class="mb-2">
                  <label :for="'listeningQuestionText' + qIndex" class="form-label small">Nội dung câu hỏi</label>
                  <input type="text" class="form-control form-control-sm" :id="'listeningQuestionText' + qIndex" v-model="q.question">
                </div>
                <div class="mb-2">
                  <label class="form-label small">Đáp án</label>
                  <input type="text" class="form-control form-control-sm" :id="'listeningAnswer' + qIndex" v-model="q.answer">
                </div>
                <div class="text-end">
                  <button type="button" class="btn btn-sm btn-danger" @click="removeListeningQuestion(qIndex)">Xóa câu hỏi</button>
                </div>
              </div>
            </div>

            <div class="mb-4 p-3 border rounded">
              <h5 class="d-flex justify-content-between align-items-center">
                Bài tập
                <button type="button" class="btn btn-sm btn-outline-primary" @click="addExercise">
                  <i class="bi bi-plus-circle"></i> Thêm bài tập
                </button>
              </h5>
              <div v-for="(exercise, exIndex) in lesson.exercises" :key="exIndex" class="mb-3 border-bottom pb-3">
                <div class="mb-2">
                  <label :for="'exerciseType' + exIndex" class="form-label small">Loại bài tập</label>
                  <select class="form-select form-select-sm" :id="'exerciseType' + exIndex" v-model="exercise.type">
                    <option value="fill_in_blank">Điền từ vào chỗ trống</option>
                    <option value="multiple_choice">Chọn đáp án đúng</option>
                    <option value="match_pair">Nối cặp</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label :for="'exerciseQuestion' + exIndex" class="form-label small">Nội dung/Hướng dẫn</label>
                  <textarea class="form-control form-control-sm" :id="'exerciseQuestion' + exIndex" v-model="exercise.question" rows="2"></textarea>
                </div>

                <div v-if="exercise.type === 'fill_in_blank'" class="ms-3 p-2 border rounded bg-light">
                  <label class="form-label small">Đáp án đúng (phân cách bởi dấu phẩy nếu nhiều từ)</label>
                  <input type="text" class="form-control form-control-sm" v-model="exercise.answer">
                </div>

                <div v-if="exercise.type === 'multiple_choice'" class="ms-3 p-2 border rounded bg-light">
                  <label class="form-label small">Các lựa chọn và đáp án đúng</label>
                  <button type="button" class="btn btn-sm btn-secondary mb-2" @click="addOption(exercise)">Thêm lựa chọn</button>
                  <div v-for="(option, optIndex) in exercise.options" :key="optIndex" class="d-flex mb-1 align-items-center">
                    <input type="text" class="form-control form-control-sm me-2" v-model="option.text">
                    <div class="form-check me-2">
                      <input class="form-check-input" type="radio" :name="'mc_answer_' + exIndex" :id="'mc_answer_' + exIndex + '_' + optIndex" :value="option.text" v-model="exercise.answer">
                      <label class="form-check-label small" :for="'mc_answer_' + exIndex + '_' + optIndex">Đúng</label>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="removeOption(exercise, optIndex)"><i class="bi bi-dash-circle"></i></button>
                  </div>
                </div>

                <div v-if="exercise.type === 'match_pair'" class="ms-3 p-2 border rounded bg-light">
                  <label class="form-label small">Các cặp cần nối</label>
                  <button type="button" class="btn btn-sm btn-secondary mb-2" @click="addPair(exercise)">Thêm cặp</button>
                  <div v-for="(pair, pairIndex) in exercise.pairs" :key="pairIndex" class="d-flex mb-1 align-items-center">
                    <input type="text" class="form-control form-control-sm me-2" placeholder="Item A" v-model="pair.itemA">
                    <input type="text" class="form-control form-control-sm me-2" placeholder="Item B" v-model="pair.itemB">
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="removePair(exercise, pairIndex)"><i class="bi bi-dash-circle"></i></button>
                  </div>
                </div>

                <div class="text-end mt-3">
                  <button type="button" class="btn btn-sm btn-danger" @click="removeExercise(exIndex)">
                    Xóa bài tập này
                  </button>
                </div>
              </div>
            </div>

            <div class="modal-footer d-flex justify-content-between">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="submit" class="btn btn-primary">Lưu Bài học</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import lessonService from '../../services/lessonService';
import NotificationToast from '../share/NotificationToast.vue'; // Import notification

const props = defineProps({
  availableTopics: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['lesson-saved']);

const modalRef = ref(null);
let bsModal = null; // Biến để giữ instance của Bootstrap Modal

const initialLessonState = {
  id: null,
  name: '',
  level: '',
  topic_id: '',
  description: '',
  imageUrl: '',
  status: 'draft',
  vocabulary: [],
  grammar: [],
  listening: {
    title: '',
    audioUrl: '',
    script: '',
    questions: []
  },
  exercises: []
};

const lesson = reactive({ ...initialLessonState });
const isEditMode = ref(false);
const errors = reactive({});

const notificationToast = ref(null); // Ref for NotificationToast

// Hàm mở modal
function openModal(lessonData = null) {
  Object.assign(errors, {}); // Clear previous errors

  if (lessonData) {
    isEditMode.value = true;
    // Deep copy for nested objects/arrays
    Object.assign(lesson, JSON.parse(JSON.stringify(lessonData)));
    // Ensure nested arrays/objects are properly initialized if they might be null/undefined
    lesson.vocabulary = lesson.vocabulary || [];
    lesson.grammar = lesson.grammar || [];
    lesson.listening = lesson.listening || { title: '', audioUrl: '', script: '', questions: [] };
    lesson.listening.questions = lesson.listening.questions || [];
    lesson.exercises = lesson.exercises || [];
  } else {
    isEditMode.value = false;
    Object.assign(lesson, initialLessonState); // Reset to initial state for new lesson
  }
  bsModal.show();
}

// Hàm đóng modal
function closeModal() {
  bsModal.hide();
}

// Hàm lưu bài học
async function saveLesson() {
  Object.assign(errors, {}); // Clear errors before validation

  // Validate lesson data using lessonService
  const validationResult = lessonService.validateLessonData(lesson, props.availableTopics);

  if (!validationResult.isValid) {
    validationResult.errors.forEach(error => {
      // Map error messages to specific fields if possible, otherwise use a general error
      if (error.includes('Tên bài học')) errors.name = error;
      else if (error.includes('Cấp độ')) errors.level = error;
      else if (error.includes('Chủ đề')) errors.topic_id = error;
      else if (error.includes('Mô tả')) errors.description = error;
      else if (error.includes('URL hình ảnh')) errors.imageUrl = error;
      else if (error.includes('Trạng thái')) errors.status = error;
      else if (!errors.general) errors.general = error; // For generic errors
      // You might need more specific mapping for complex errors
    });
    // Show a general error if no specific field mapping
    if (Object.keys(errors).length === 0 && validationResult.errors.length > 0) {
       alert(validationResult.errors.join('\n')); // Fallback to alert if no specific mapping
       // Or show a toast, assuming notificationToast is available and initialized correctly
       // notificationToast.value.showToast('Lỗi nhập liệu: ' + validationResult.errors.join(', '), 'error');
    }
    return; // Stop if validation fails
  }

  try {
    const isNew = !lesson.id; // Check if it's a new lesson or update

    // Emit 'lesson-saved' with 'isNew' flag
    // The parent (LessonAdminView) will handle the confirmation and then call the service
    emit('lesson-saved', isNew);
    
    // We expect the parent to call the actual save operation, so just close the modal here
    closeModal();

  } catch (error) {
    console.error("Error saving lesson:", error);
    // This part might not be reached if parent handles the actual save,
    // but good to keep for direct calls if any.
    alert('Có lỗi xảy ra khi lưu bài học: ' + error.message);
  }
}

// --- Dynamic content methods ---
function addVocabularyItem() {
  lesson.vocabulary.push({ word: '', meaning: '', reading: '' });
}
function removeVocabularyItem(index) {
  lesson.vocabulary.splice(index, 1);
}

function addGrammarItem() {
  lesson.grammar.push({ structure: '', meaning: '', explanation: '', examples: [] });
}
function removeGrammarItem(index) {
  lesson.grammar.splice(index, 1);
}

function addListeningQuestion() {
  lesson.listening.questions.push({ question: '', answer: '' });
}
function removeListeningQuestion(index) {
  lesson.listening.questions.splice(index, 1);
}

function addExercise() {
  lesson.exercises.push({ type: 'fill_in_blank', question: '', answer: '', options: [], pairs: [] });
}
function removeExercise(index) {
  lesson.exercises.splice(index, 1);
}

function addOption(exercise) {
  exercise.options.push({ text: '' });
}
function removeOption(exercise, index) {
  exercise.options.splice(index, 1);
  // If the removed option was the answer, clear the answer
  if (exercise.answer === exercise.options[index]?.text) { // Check if it's still the answer
    exercise.answer = '';
  }
}

function addPair(exercise) {
  exercise.pairs.push({ itemA: '', itemB: '' });
}
function removePair(exercise, index) {
  exercise.pairs.splice(index, 1);
}

// Expose openModal to parent component
defineExpose({
  openModal
});

// Initialize Bootstrap Modal on component mount
onMounted(() => {
  bsModal = new Modal(modalRef.value);
  // Optionally, listen to hide event to reset form state
  modalRef.value.addEventListener('hidden.bs.modal', () => {
    Object.assign(lesson, initialLessonState); // Reset form when modal is closed
    Object.assign(errors, {}); // Clear errors
  });
});
</script>

<style scoped>
/* Scoped styles for LessonFormModal */
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

h6 {
  color: #007bff;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.border.rounded {
  border-color: #dee2e6 !important;
  background-color: #f8fafd;
}

.border-bottom {
  border-color: #e9ecef !important;
}

/* Custom styling for small form controls within nested sections */
.form-control-sm {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.form-select-sm {
  font-size: 0.875rem;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
}

.btn-sm {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
}
</style>