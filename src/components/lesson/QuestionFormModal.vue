<template>
  <div
    class="modal fade"
    id="questionFormModal"
    tabindex="-1"
    aria-labelledby="questionFormModalLabel"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditing ? "Chỉnh sửa Câu hỏi" : "Thêm Câu hỏi" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>

        <div class="modal-body">
          <form @submit.prevent="onSubmit">
            <div class="row">
              <!-- BÊN TRÁI -->
              <div class="col-md-6 pe-4 border-end">
                <div class="mb-3">
                  <label class="form-label font-weight-bold"
                    >Loại Câu hỏi</label
                  >
                  <select
                    v-model="question.questionType"
                    class="form-select"
                    required
                  >
                    <option
                      class="fw-bold"
                      v-for="type in questionTypes"
                      :key="type.value"
                      :value="type.value"
                    >
                      {{ type.text }}
                    </option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Nội dung Câu hỏi</label>
                  <input
                    v-model="question.promptTextTemplate"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Từ</label>
                  <input
                    v-model="question.targetWordNative"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label"
                    >Từ để chuyển sang âm thanh tiếng Nhật</label
                  >
                  <input
                    v-model="question.textAudioQuestion"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
              </div>

              <!-- BÊN PHẢI -->
              <div
                class="col-md-6 ps-4"
                v-if="
                  !['PRONUNCIATION', 'WRITING'].includes(question.questionType)
                "
                style="max-height: 65vh; overflow-y: auto"
              >
                <label class="form-label fw-bold">Các lựa chọn:</label>

                <div
                  v-for="(choice, index) in question.choices"
                  :key="index"
                  class="border rounded p-3 mb-3 bg-light"
                >
                  <div v-if="question.questionType === 'WORD_ORDER'">
                    <input
                      v-model="choice.textBlock"
                      class="form-control"
                      placeholder="Đáp án câu xắp xếp"
                    />
                  </div>

                  <div v-else>
                    <input
                      v-model="choice.textForeign"
                      class="form-control mb-2"
                      placeholder="Từ ngoại ngữ"
                    />
                    <input
                      v-model="choice.textRomaji"
                      class="form-control mb-2"
                      placeholder="Từ phiên âm"
                    />
                    <input
                      v-if="question.questionType !== 'AUDIO_CHOICE'"
                      v-model="choice.textAudioChoice"
                      class="form-control mb-2"
                      placeholder="Từ để chuyển sang âm thanh"
                    />
                    <input
                      v-if="
                        question.questionType === 'MULTIPLE_CHOICE_VOCAB_IMAGE'
                      "
                      type="file"
                      class="form-control mb-2"
                      placeholder="Chọn hình ảnh"
                    />
                    <input
                      v-model="choice.meaning"
                      class="form-control mb-2"
                      placeholder="Nghĩa của từ"
                    />
                    <div class="form-check mt-1">
                      <input
                        v-model="choice.isCorrect"
                        class="form-check-input"
                        type="checkbox"
                        :id="'correct' + index"
                      />
                      <label class="form-check-label" :for="'correct' + index"
                        >Đáp án đúng</label
                      >
                    </div>
                  </div>
                </div>

                <button
                  v-if="question.questionType !== 'WORD_ORDER'"
                  type="button"
                  class="btn btn-sm btn-outline-primary"
                  @click="addChoice"
                >
                  Thêm lựa chọn
                </button>
              </div>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button
                type="button"
                class="btn btn-secondary me-2"
                data-bs-dismiss="modal"
              >
                Hủy
              </button>
              <button type="submit" class="btn btn-primary">
                {{ isEditing ? "Cập nhật" : "Thêm mới" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Modal } from "bootstrap";

const props = defineProps({ lessonId: Number });
const emit = defineEmits(["question-saved"]);

const modalRef = ref();
let bsModal = null;

const isEditing = ref(false);
const question = reactive(getInitialQuestion());

const questionTypes = [
  { value: "MULTIPLE_CHOICE_TEXT_ONLY", text: "Trắc nghiệm" },
  { value: "MULTIPLE_CHOICE_VOCAB_IMAGE", text: "Trắc nghiệm hình ảnh" },
  { value: "WORD_ORDER", text: "Xắp xếp từ" },
  { value: "AUDIO_CHOICE", text: "Câu hỏi nghe" },
  { value: "PRONUNCIATION", text: "Luyện nói" },
  { value: "WRITING", text: "Luyện viết" },
];

function getInitialQuestion() {
  return {
    id: null,
    lessonId: props.lessonId,
    promptTextTemplate: "",
    questionType: "MULTIPLE_CHOICE_TEXT_ONLY",
    targetWordNative: "",
    targetLanguageCode: "",
    optionsLanguageCode: "",
    textAudioQuestion: "",
    choices: [
      {
        textForeign: "",
        textRomaji: "",
        textAudioChoice: "",
        isCorrect: false,
        textBlock: "",
        meaning: "",
      },
    ],
  };
}

function openModal(data = null) {
  Object.assign(question, getInitialQuestion());

  if (data) {
    isEditing.value = true;
    Object.assign(question, JSON.parse(JSON.stringify(data)));
  } else {
    isEditing.value = false;
  }

  // Nếu là WORD_ORDER, giới hạn 1 choice
  if (question.questionType === "WORD_ORDER" && question.choices.length > 1) {
    question.choices = [question.choices[0]];
  }

  bsModal.show();
}
defineExpose({ openModal });

function addChoice() {
  if (question.questionType === "WORD_ORDER") return;

  question.choices.push({
    textForeign: "",
    textRomaji: "",
    textAudioChoice: "",
    isCorrect: false,
    textBlock: "",
    meaning: "",
  });
}

function validateBeforeSubmit() {
  if (!question.promptTextTemplate.trim()) return false;

  const count = question.choices.length;
  if (question.questionType === "WORD_ORDER" && count !== 1) return false;
  if (["PRONUNCIATION", "WRITING"].includes(question.questionType)) return true;
  if (count < 2) return false;

  return true;
}

function onSubmit() {
  if (!validateBeforeSubmit()) {
    alert("Vui lòng nhập đủ nội dung phù hợp với loại câu hỏi.");
    return;
  }
  emit("question-saved", { ...question });
  bsModal.hide();
}

onMounted(() => {
  bsModal = new Modal(modalRef.value);
});
</script>

<style scoped>
.modal-body {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
