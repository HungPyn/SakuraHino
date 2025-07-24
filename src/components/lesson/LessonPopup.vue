<template>
  <div class="modal fade" id="lessonFormModal" tabindex="-1" aria-labelledby="lessonFormModalLabel" aria-hidden="true" ref="modalElement">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="lessonFormModalLabel">{{ isEditMode ? 'Chỉnh Sửa Bài học' : 'Tạo Bài học Mới' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveLesson">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="lessonName" class="form-label">Tên Bài học <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="lessonName" v-model="lesson.name" required>
              </div>
              <div class="col-md-3">
                <label for="lessonLevel" class="form-label">Cấp độ <span class="text-danger">*</span></label>
                <select class="form-select" id="lessonLevel" v-model="lesson.level" required>
                  <option value="">Chọn cấp độ</option>
                  <option>N5</option>
                  <option>N4</option>
                  <option>N3</option>
                  <option>N2</option>
                  <option>N1</option>
                </select>
              </div>
              <div class="col-md-3">
                <label for="lessonStatus" class="form-label">Trạng thái <span class="text-danger">*</span></label>
                <select class="form-select" id="lessonStatus" v-model="lesson.status" required>
                  <option value="draft">Nháp</option>
                  <option value="published">Đã xuất bản</option>
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label for="lessonTopic" class="form-label">Chủ đề</label>
              <input type="text" class="form-control" id="lessonTopic" v-model="lesson.topic">
            </div>
            <div class="mb-3">
              <label for="lessonDescription" class="form-label">Mô tả ngắn gọn</label>
              <textarea class="form-control" id="lessonDescription" rows="2" v-model="lesson.description"></textarea>
            </div>
            <div class="mb-4">
                <label for="lessonImage" class="form-label">Hình ảnh đại diện</label>
                <input type="file" class="form-control" id="lessonImage" @change="handleImageUpload">
                <small v-if="lesson.imageUrl" class="text-muted mt-2 d-block">
                    <img :src="lesson.imageUrl" alt="Preview" class="img-thumbnail mt-2" style="max-height: 100px;">
                    <br>Đã có ảnh. Chọn ảnh mới để thay đổi.
                </small>
            </div>

            <ul class="nav nav-tabs nav-fill mb-3" id="lessonContentTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="vocab-tab" data-bs-toggle="tab" data-bs-target="#vocab" type="button" role="tab" aria-controls="vocab" aria-selected="true">
                  <i class="bi bi-card-text me-2"></i>Từ vựng
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="grammar-tab" data-bs-toggle="tab" data-bs-target="#grammar" type="button" role="tab" aria-controls="grammar" aria-selected="false">
                  <i class="bi bi-spellcheck me-2"></i>Ngữ pháp
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="listening-tab" data-bs-toggle="tab" data-bs-target="#listening" type="button" role="tab" aria-controls="listening" aria-selected="false">
                  <i class="bi bi-headset me-2"></i>Nghe hiểu
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="exercises-tab" data-bs-toggle="tab" data-bs-target="#exercises" type="button" role="tab" aria-controls="exercises" aria-selected="false">
                  <i class="bi bi-clipboard-check me-2"></i>Bài tập
                </button>
              </li>
            </ul>

            <div class="tab-content" id="lessonContentTabsContent">
              <div class="tab-pane fade show active" id="vocab" role="tabpanel" aria-labelledby="vocab-tab">
                <h6 class="mb-3">Danh sách Từ vựng</h6>
                <div class="table-responsive mb-3">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Tiếng Nhật</th>
                                <th>Phiên âm</th>
                                <th>Nghĩa TV</th>
                                <th>Loại từ</th>
                                <th>Ví dụ</th>
                                <th>Audio</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="lesson.vocabulary.length === 0">
                                <td colspan="7" class="text-center text-muted">Chưa có từ vựng nào.</td>
                            </tr>
                            <tr v-for="(word, index) in lesson.vocabulary" :key="index">
                                <td><input type="text" class="form-control form-control-sm" v-model="word.japanese"></td>
                                <td><input type="text" class="form-control form-control-sm" v-model="word.pronunciation"></td>
                                <td><input type="text" class="form-control form-control-sm" v-model="word.vietnamese"></td>
                                <td><input type="text" class="form-control form-control-sm" v-model="word.type"></td>
                                <td><input type="text" class="form-control form-control-sm" v-model="word.example"></td>
                                <td>
                                    <input type="file" class="form-control form-control-sm" @change="e => handleAudioUpload(e, index, 'vocabulary')">
                                    <small v-if="word.audioUrl">{{ word.audioUrl ? word.audioUrl.split('/').pop() : '' }}</small>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-sm btn-danger" @click="removeVocab(index)"><i class="bi bi-x-lg"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button type="button" class="btn btn-outline-primary btn-sm" @click="addVocab">
                    <i class="bi bi-plus-lg me-2"></i>Thêm Từ Vựng
                </button>
              </div>

              <div class="tab-pane fade" id="grammar" role="tabpanel" aria-labelledby="grammar-tab">
                <h6 class="mb-3">Danh sách Ngữ pháp</h6>
                 <div class="table-responsive mb-3">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Cấu trúc</th>
                                <th>Giải thích TV</th>
                                <th>Ví dụ</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="lesson.grammar.length === 0">
                                <td colspan="4" class="text-center text-muted">Chưa có điểm ngữ pháp nào.</td>
                            </tr>
                            <tr v-for="(point, index) in lesson.grammar" :key="index">
                                <td><input type="text" class="form-control form-control-sm" v-model="point.structure"></td>
                                <td><textarea class="form-control form-control-sm" rows="2" v-model="point.explanation"></textarea></td>
                                <td><textarea class="form-control form-control-sm" rows="2" v-model="point.example"></textarea></td>
                                <td>
                                    <button type="button" class="btn btn-sm btn-danger" @click="removeGrammar(index)"><i class="bi bi-x-lg"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button type="button" class="btn btn-outline-primary btn-sm" @click="addGrammar">
                    <i class="bi bi-plus-lg me-2"></i>Thêm Ngữ Pháp
                </button>
              </div>

              <div class="tab-pane fade" id="listening" role="tabpanel" aria-labelledby="listening-tab">
                <h6 class="mb-3">Nội dung Nghe hiểu</h6>
                <div class="mb-3">
                    <label for="listeningTitle" class="form-label">Tiêu đề đoạn nghe</label>
                    <input type="text" class="form-control" id="listeningTitle" v-model="lesson.listening.title">
                </div>
                <div class="mb-3">
                    <label for="listeningAudio" class="form-label">File Audio</label>
                    <input type="file" class="form-control" id="listeningAudio" @change="e => handleAudioUpload(e, null, 'listening')">
                    <small v-if="lesson.listening.audioUrl" class="text-muted mt-2 d-block">
                        Hiện tại: {{ lesson.listening.audioUrl ? lesson.listening.audioUrl.split('/').pop() : '' }}
                        <audio v-if="lesson.listening.audioUrl" :src="lesson.listening.audioUrl" controls class="w-100 mt-2"></audio>
                    </small>
                </div>
                <div class="mb-3">
                    <label for="listeningScript" class="form-label">Script (Lời thoại)</label>
                    <textarea class="form-control" id="listeningScript" rows="5" v-model="lesson.listening.script"></textarea>
                </div>

                <h6 class="mt-4 mb-3">Câu hỏi Nghe hiểu</h6>
                 <div class="table-responsive mb-3">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Câu hỏi</th>
                                <th>Loại</th>
                                <th>Lựa chọn/Đáp án</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="lesson.listening.questions.length === 0">
                                <td colspan="4" class="text-center text-muted">Chưa có câu hỏi nghe hiểu nào.</td>
                            </tr>
                            <tr v-for="(question, qIndex) in lesson.listening.questions" :key="qIndex">
                                <td><input type="text" class="form-control form-control-sm" v-model="question.questionText"></td>
                                <td>
                                    <select class="form-select form-select-sm" v-model="question.type">
                                        <option value="multiple_choice">Trắc nghiệm</option>
                                        <option value="fill_in_blank">Điền từ</option>
                                    </select>
                                </td>
                                <td>
                                    <div v-if="question.type === 'multiple_choice'">
                                        <div v-for="(option, oIndex) in question.options" :key="oIndex" class="input-group input-group-sm mb-1">
                                            <input type="text" class="form-control" v-model="question.options[oIndex]">
                                            <div class="input-group-text">
                                                <input class="form-check-input mt-0" type="radio" :name="'q'+qIndex+'options'" :value="option" v-model="question.correctAnswer">
                                            </div>
                                            <button type="button" class="btn btn-outline-danger btn-sm" @click="removeOption(qIndex, oIndex)"><i class="bi bi-dash-lg"></i></button>
                                        </div>
                                        <button type="button" class="btn btn-outline-secondary btn-sm mt-1" @click="addOption(qIndex)">Thêm lựa chọn</button>
                                    </div>
                                    <div v-else-if="question.type === 'fill_in_blank'">
                                        <input type="text" class="form-control form-control-sm" v-model="question.correctAnswer" placeholder="Đáp án đúng">
                                    </div>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-sm btn-danger" @click="removeListeningQuestion(qIndex)"><i class="bi bi-x-lg"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button type="button" class="btn btn-outline-primary btn-sm" @click="addListeningQuestion">
                    <i class="bi bi-plus-lg me-2"></i>Thêm Câu Hỏi
                </button>
              </div>

              <div class="tab-pane fade" id="exercises" role="tabpanel" aria-labelledby="exercises-tab">
                <h6 class="mb-3">Danh sách Bài tập cuối bài</h6>
                <div class="mb-3" v-for="(exercise, exIndex) in lesson.exercises" :key="exIndex">
                    <div class="card card-body bg-light mb-2">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="mb-0">Bài tập {{ exIndex + 1 }}</h6>
                            <button type="button" class="btn btn-sm btn-danger" @click="removeExercise(exIndex)"><i class="bi bi-trash"></i> Xóa</button>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Loại bài tập</label>
                            <select class="form-select form-select-sm" v-model="exercise.type" @change="resetExerciseContent(exercise)">
                                <option value="multiple_choice">Trắc nghiệm</option>
                                <option value="fill_in_blank">Điền vào chỗ trống</option>
                                <option value="matching">Nối từ/câu</option>
                                <option value="rearrange_sentence">Sắp xếp câu</option>
                            </select>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Yêu cầu/Câu hỏi</label>
                            <input type="text" class="form-control form-control-sm" v-model="exercise.question">
                        </div>

                        <div v-if="exercise.type === 'multiple_choice'">
                            <label class="form-label">Các lựa chọn</label>
                            <div v-for="(option, optIndex) in exercise.options" :key="optIndex" class="input-group input-group-sm mb-1">
                                <input type="text" class="form-control" v-model="exercise.options[optIndex]">
                                <div class="input-group-text">
                                    <input class="form-check-input mt-0" type="radio" :name="'ex'+exIndex+'options'" :value="option" v-model="exercise.correctAnswer">
                                </div>
                                <button type="button" class="btn btn-outline-danger btn-sm" @click="removeExerciseOption(exIndex, optIndex)"><i class="bi bi-dash-lg"></i></button>
                            </div>
                            <button type="button" class="btn btn-outline-secondary btn-sm mt-1" @click="addExerciseOption(exIndex)">Thêm lựa chọn</button>
                            <div class="mt-2">
                                <label class="form-label">Giải thích đáp án (tùy chọn)</label>
                                <textarea class="form-control form-control-sm" rows="1" v-model="exercise.explanation"></textarea>
                            </div>
                        </div>

                        <div v-else-if="exercise.type === 'fill_in_blank'">
                            <label class="form-label">Đáp án đúng</label>
                            <input type="text" class="form-control form-control-sm mb-2" v-model="exercise.correctAnswer" placeholder="Ví dụ: sakura">
                            <label class="form-label">Gợi ý từ (tùy chọn, cách nhau bằng dấu phẩy)</label>
                            <input type="text" class="form-control form-control-sm" v-model="exercise.hintWords">
                            <div class="mt-2">
                                <label class="form-label">Giải thích đáp án (tùy chọn)</label>
                                <textarea class="form-control form-control-sm" rows="1" v-model="exercise.explanation"></textarea>
                            </div>
                        </div>

                        <div v-else-if="exercise.type === 'matching'">
                            <label class="form-label">Các cặp nối (Mỗi hàng là một cặp: Phần A | Phần B)</label>
                            <div v-for="(pair, pIndex) in exercise.pairs" :key="pIndex" class="input-group input-group-sm mb-1">
                                <input type="text" class="form-control" v-model="pair.a" placeholder="Phần A">
                                <span class="input-group-text">|</span>
                                <input type="text" class="form-control" v-model="pair.b" placeholder="Phần B">
                                <button type="button" class="btn btn-outline-danger btn-sm" @click="removeMatchingPair(exIndex, pIndex)"><i class="bi bi-dash-lg"></i></button>
                            </div>
                            <button type="button" class="btn btn-outline-secondary btn-sm mt-1" @click="addMatchingPair(exIndex)">Thêm cặp</button>
                            <div class="mt-2">
                                <label class="form-label">Giải thích đáp án (tùy chọn)</label>
                                <textarea class="form-control form-control-sm" rows="1" v-model="exercise.explanation"></textarea>
                            </div>
                        </div>

                        <div v-else-if="exercise.type === 'rearrange_sentence'">
                            <label class="form-label">Các từ/cụm từ (cách nhau bằng dấu phẩy)</label>
                            <input type="text" class="form-control form-control-sm mb-2" v-model="exercise.words" placeholder="Ví dụ: 私は, 日本語, 勉強します, を">
                            <label class="form-label">Thứ tự đúng (các chỉ số, bắt đầu từ 0, cách nhau bằng dấu phẩy)</label>
                            <input type="text" class="form-control form-control-sm" v-model="exercise.correctOrder" placeholder="Ví dụ: 0, 2, 3, 1">
                            <div class="mt-2">
                                <label class="form-label">Giải thích đáp án (tùy chọn)</label>
                                <textarea class="form-control form-control-sm" rows="1" v-model="exercise.explanation"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn btn-outline-primary btn-sm" @click="addExercise">
                    <i class="bi bi-plus-lg me-2"></i>Thêm Bài Tập
                </button>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Hủy</button>
          <button type="button" class="btn btn-primary" @click="saveLesson(false)">Lưu Nháp</button>
          <button type="submit" class="btn btn-success" @click="saveLesson(true)">Lưu & Xuất bản</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue';
import { Modal } from 'bootstrap'; // Import Modal từ Bootstrap JS
import lessonService from '../../services/lessonService'; // Service quản lý bài học

// Props từ component cha (LessonManagementPage)
const props = defineProps({
  lesson: Object // Có thể là null khi tạo mới, hoặc object khi chỉnh sửa
});

// Sự kiện phát ra cho component cha
const emit = defineEmits(['lesson-saved']);

// Ref cho đối tượng modal của Bootstrap
const modalElement = ref(null);
let bsModal = null; // Biến để lưu trữ instance Modal của Bootstrap

// Reactive state cho form
const isEditMode = ref(false);
const lesson = reactive(getDefaultLessonData());

// Reactive state để giữ các file tạm thời trước khi upload
const currentLessonImageFile = ref(null);
const currentListeningAudioFile = ref(null);
const currentVocabAudioFiles = reactive({}); // { index: File }


// --- Lifecycle Hook & Watchers ---
onMounted(() => {
  // Khởi tạo instance Modal của Bootstrap sau khi component được mount
  bsModal = new Modal(modalElement.value);
  
  // Lắng nghe sự kiện "hidden.bs.modal" để reset form khi modal đóng
  modalElement.value.addEventListener('hidden.bs.modal', resetForm);
});

// Watch props.lesson để cập nhật form khi có bài học được truyền vào (chế độ chỉnh sửa)
watch(() => props.lesson, (newVal) => {
  if (newVal) {
    // Deep copy để không sửa trực tiếp vào dữ liệu gốc của props
    Object.assign(lesson, JSON.parse(JSON.stringify(newVal)));
    isEditMode.value = true;
  } else {
    // Nếu props.lesson là null, reset form để tạo bài mới
    resetForm();
    isEditMode.value = false;
  }
}, { deep: true, immediate: true }); // immediate để chạy lần đầu khi component được tạo


// --- Helper Functions ---
function getDefaultLessonData() {
  return {
    id: null,
    name: '',
    level: '',
    topic: '',
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
}

// --- Modal Control Functions ---
function openModal(lessonData = null) {
  if (lessonData) {
    // Khi chỉnh sửa, gán dữ liệu bài học được truyền vào props
    Object.assign(lesson, JSON.parse(JSON.stringify(lessonData)));
    isEditMode.value = true;
  } else {
    // Khi tạo mới, reset form về trạng thái mặc định
    resetForm();
    isEditMode.value = false;
  }
  bsModal.show(); // Hiển thị modal
}

function closeModal() {
  bsModal.hide(); // Ẩn modal
}

function resetForm() {
  Object.assign(lesson, getDefaultLessonData());
  isEditMode.value = false;
  currentLessonImageFile.value = null;
  currentListeningAudioFile.value = null;
  // Clear reactive object: https://vuejs.org/guide/essentials/reactivity-fundamentals.html#declaring-reactive-state
  for (const key in currentVocabAudioFiles) {
    delete currentVocabAudioFiles[key];
  }
}

// --- File Upload Handlers ---
function handleImageUpload(event) {
  currentLessonImageFile.value = event.target.files[0];
  if (currentLessonImageFile.value) {
    // Tạo URL tạm thời cho preview, trong thực tế sẽ upload lên server
    lesson.imageUrl = URL.createObjectURL(currentLessonImageFile.value); 
  } else {
    lesson.imageUrl = '';
  }
}

function handleAudioUpload(event, index, type) {
  const file = event.target.files[0];
  if (!file) return;

  // Simulate file upload and getting a URL
  // In a real application, you'd send `file` to your backend storage service (e.g., AWS S3, Cloudinary)
  // and update the `audioUrl` with the URL returned from the server.
  const tempUrl = URL.createObjectURL(file); 

  if (type === 'listening') {
    currentListeningAudioFile.value = file;
    lesson.listening.audioUrl = tempUrl; 
  } else if (type === 'vocabulary' && index !== null) {
    currentVocabAudioFiles[index] = file;
    lesson.vocabulary[index].audioUrl = tempUrl;
  }
  // Clear the input file value to allow selecting the same file again if needed
  event.target.value = ''; 
}

// --- Vocabulary Methods ---
function addVocab() {
  lesson.vocabulary.push({ japanese: '', pronunciation: '', vietnamese: '', type: '', example: '', audioUrl: '' });
}
function removeVocab(index) {
  lesson.vocabulary.splice(index, 1);
  delete currentVocabAudioFiles[index]; // Clear file if exists
}

// --- Grammar Methods ---
function addGrammar() {
  lesson.grammar.push({ structure: '', explanation: '', example: '' });
}
function removeGrammar(index) {
  lesson.grammar.splice(index, 1);
}

// --- Listening Questions Methods ---
function addListeningQuestion() {
  lesson.listening.questions.push({ questionText: '', type: 'multiple_choice', options: ['', '', ''], correctAnswer: '' });
}
function removeListeningQuestion(index) {
  lesson.listening.questions.splice(index, 1);
}
function addOption(qIndex) {
  lesson.listening.questions[qIndex].options.push('');
}
function removeOption(qIndex, oIndex) {
  lesson.listening.questions[qIndex].options.splice(oIndex, 1);
  // Ensure correct answer is still valid if it was deleted
  if (this.lesson.listening.questions[qIndex].options.indexOf(this.lesson.listening.questions[qIndex].correctAnswer) === -1) {
    this.lesson.listening.questions[qIndex].correctAnswer = '';
  }
}

// --- Exercises Methods ---
function addExercise() {
  lesson.exercises.push({ type: 'multiple_choice', question: '', options: ['', '', ''], correctAnswer: '', explanation: '', pairs: [{a: '', b: ''}], words: '', correctOrder: '' });
}
function removeExercise(index) {
  lesson.exercises.splice(index, 1);
}
function resetExerciseContent(exercise) {
    // Reset specific fields when exercise type changes
    exercise.options = ['', '', ''];
    exercise.correctAnswer = '';
    exercise.explanation = '';
    exercise.pairs = [{a: '', b: ''}];
    exercise.words = '';
    exercise.correctOrder = '';
    exercise.hintWords = '';
}
function addExerciseOption(exIndex) {
    lesson.exercises[exIndex].options.push('');
}
function removeExerciseOption(exIndex, optIndex) {
    lesson.exercises[exIndex].options.splice(optIndex, 1);
}
function addMatchingPair(exIndex) {
    lesson.exercises[exIndex].pairs.push({a: '', b: ''});
}
function removeMatchingPair(exIndex, pIndex) {
    lesson.exercises[exIndex].pairs.splice(pIndex, 1);
}

// --- Save Lesson ---
async function saveLesson(publish = false) {
  if (publish) {
    lesson.status = 'published';
  }

  // Basic validation
  if (!lesson.name || !lesson.level) {
    alert('Vui lòng điền đầy đủ Tên Bài học và Cấp độ.');
    return;
  }

  // In a real app, you would upload files here using a service
  // and update the lesson.imageUrl, lesson.listening.audioUrl, etc.
  // with the actual URLs from your storage service before saving the lesson object.
  // For this mock, we assume URLs are already handled or will be by backend.

  try {
    let savedLesson;
    if (isEditMode.value) {
      savedLesson = await lessonService.updateLesson(lesson.id, lesson);
      alert('Bài học đã được cập nhật thành công!');
    } else {
      savedLesson = await lessonService.createLesson(lesson);
      alert('Bài học đã được tạo thành công!');
    }
    emit('lesson-saved', savedLesson); // Emit event to parent to refresh list
    closeModal(); // Close the modal
  } catch (error) {
    console.error("Error saving lesson:", error);
    alert('Có lỗi xảy ra khi lưu bài học.');
  }
}

// Expose openModal to parent component using `defineExpose`
// This allows parent to call `lessonFormModal.value.openModal()`
defineExpose({
  openModal
});
</script>

<style scoped>
.modal-xl {
  --bs-modal-width: 90vw; /* Chiều rộng lớn hơn cho modal */
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
}

.modal-body {
  padding: 2rem;
}

.form-label {
  font-weight: 500;
  color: #333;
}

.nav-tabs .nav-link {
  color: #666;
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  color: #007bff;
  border-color: #dee2e6 #dee2e6 #fff;
  background-color: #fff;
}

.tab-pane {
  padding: 1rem 0;
}

table input.form-control-sm,
table select.form-select-sm,
table textarea.form-control-sm {
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
}

.table.table-bordered th, .table.table-bordered td {
    border: 1px solid #e9ecef;
}

.table thead th {
    background-color: #f8fafd;
}

.btn-outline-primary, .btn-outline-secondary {
    border-radius: 0.5rem;
}

.input-group-text {
    background-color: #e9ecef;
    border-color: #ced4da;
}
</style>