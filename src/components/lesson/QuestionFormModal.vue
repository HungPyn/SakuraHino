<template>
  <div
    class="modal fade"
    id="questionFormModal"
    tabindex="-1"
    aria-labelledby="questionFormModalLabel"
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
                    :disabled="isEditing"
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
                  <label for="userStatus" class="form-label">Trạng thái:</label>
                  <select
                    class="form-select"
                    id="userStatus"
                    v-model="question.status"
                  >
                    <option value="PUBLISHED">Hoạt động</option>
                    <option value="PENDING">chưa xuất bản</option>
                    <option value="DELETED">Xóa</option>
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
                  <label class="form-label">Từ đúng</label>
                  <input
                    v-model="question.targetWordNative"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
              </div>

              <!-- BÊN PHẢI -->
              <div
                class="col-md-6 ps-4"
                style="max-height: 65vh; overflow-y: auto"
              >
                <label class="form-label fw-bold">Các lựa chọn:</label>

                <div
                  v-for="(choice, index) in question.choiceRequests"
                  :key="index"
                  class="border rounded p-3 mb-3 bg-light"
                >
                  <div>
                    <input
                      v-if="
                        !['PRONUNCIATION', 'WRITING'].includes(
                          question.questionType
                        ) &&
                        !(
                          question.questionType === 'WORD_ORDER' &&
                          isJapanese(question.targetWordNative)
                        )
                      "
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
                      v-model="choice.meaning"
                      class="form-control mb-2"
                      :placeholder="
                        question.questionType === 'WORD_ORDER' &&
                        isJapanese(question.targetWordNative)
                          ? 'Nhập từ cần Sắp xếp (tiếng Việt)'
                          : 'Nghĩa của từ'
                      "
                    />
                    <div
                      v-if="
                        question.questionType !== 'PRONUNCIATION' &&
                        question.questionType !== 'WRITING' &&
                        question.questionType !== 'WORD_ORDER'
                      "
                      class="form-check mt-1 justify-content-between"
                    >
                      <div
                        v-if="
                          question.questionType ===
                          'MULTIPLE_CHOICE_VOCAB_IMAGE'
                        "
                      >
                        <input
                          type="file"
                          class="form-control mb-2"
                          @change="onFileChange($event, choice)"
                        />

                        <!-- Hiển thị ảnh nếu có -->
                        <div v-if="choice.imageUrl" class="mt-3 text-center">
                          <img
                            :src="choice.imageUrl"
                            alt="Ảnh đã chọn"
                            class="img-thumbnail"
                            style="max-width: 180px; margin-top: 10px"
                          />
                        </div>
                      </div>

                      <input
                        v-model="choice.isCorrect"
                        class="form-check-input"
                        type="checkbox"
                        :id="'correct' + index"
                      />
                      <label class="form-check-label" :for="'correct' + index"
                        >Đáp án đúng</label
                      >
                      <div class="text-end mt-2">
                        <button
                          v-if="!isEditing"
                          type="button"
                          class="btn btn-outline-danger btn-sm"
                          @click="removeChoice(index)"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  v-if="!isEditing"
                  class="btn btn-sm"
                  :class="
                    ['WORD_ORDER', 'PRONUNCIATION', 'WRITING'].includes(
                      question.questionType
                    )
                      ? 'btn-secondary'
                      : 'btn-outline-primary'
                  "
                  :disabled="
                    ['WORD_ORDER', 'PRONUNCIATION', 'WRITING'].includes(
                      question.questionType
                    )
                  "
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
import { ref, reactive, onMounted, onUnmounted, watch } from "vue";
import { Modal } from "bootstrap";

const props = defineProps({
  lessonId: Number,
  currentQuestion: Object,
  isEditing: Boolean,
});
const emit = defineEmits(["question-saved"]);

const modalRef = ref();
let bsModal = null;
const allImages = ref([]); // Danh sách tất cả ảnh của modal

const isEditing = ref(false);
const question = reactive({
  id: null,
  lessonId: null,
  questionType: null,
  promptTextTemplate: "",
  targetWordNative: "",
  status: null,
  choiceRequests: [
    {
      id: null,
      textForeign: "",
      textRomaji: "",
      imageKey: "",
      imageUrl: "",
      audioUrlForeign: "",
      isCorrect: false,
      meaning: "",
    },
  ],
});

const questionTypes = [
  { value: "MULTIPLE_CHOICE_TEXT_ONLY", text: "Trắc nghiệm văn bản" },
  { value: "MULTIPLE_CHOICE_VOCAB_IMAGE", text: "Trắc nghiệm hình ảnh" },
  { value: "AUDIO_CHOICE", text: "Nghe và chọn đáp án" },
  { value: "WORD_ORDER", text: "Sắp xếp từ" },
  { value: "PRONUNCIATION", text: "Luyện phát âm" },
  { value: "WRITING", text: "Luyện viết" },
];
function closeModal() {
  if (!bsModal) return;

  // Reset dữ liệu **từng trường riêng**, giữ reactive object
  question.id = null;
  question.lessonId = null;
  question.questionType = null;
  question.promptTextTemplate = "";
  question.targetWordNative = "";
  question.status = null;

  // Reset choices mà vẫn giữ reactive array
  question.choiceRequests.splice(0, question.choiceRequests.length);
  allImages.value.splice(0, allImages.value.length);

  // Ẩn modal
  bsModal.hide();

  // Xóa backdrop ngay lập tức
  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) backdrop.remove();
}

function openModal(data = {}) {
  allImages.value = []; // Reset allImages để tránh giữ ảnh cũ
  Object.assign(question, {
    id: null,
    lessonId: props.lessonId,
    questionType: "MULTIPLE_CHOICE_TEXT_ONLY",
    promptTextTemplate: "",
    targetWordNative: "",
    status: "PUBLISHED",
    choiceRequests: [
      {
        id: null,
        textForeign: "",
        textRomaji: "",
        imageKey: "",
        imageUrl: "",
        audioUrlForeign: "",
        isCorrect: false,
        meaning: "",
      },
    ],
  });

  if (data) {
    isEditing.value = !!data.isEditing;
    if (data.currentQuestion) {
      Object.assign(question, JSON.parse(JSON.stringify(data.currentQuestion)));
      if (data.currentQuestion.choices) {
        question.choiceRequests = data.currentQuestion.choices.map((c) => {
          const choice = { ...c, imageKey: c.imageKey || "" };
          if (
            c.imageUrl &&
            !allImages.value.some((img) => img.imageKey === choice.imageKey)
          ) {
            allImages.value.push({
              imageKey: choice.imageKey,
              file: null,
              imageUrl: c.imageUrl,
            });
          }
          return choice;
        });
        delete question.choices;
      }
    }
    if (data.lessonId) question.lessonId = data.lessonId;
  }

  if (["PRONUNCIATION", "WRITING"].includes(question.questionType)) {
    if (!question.choiceRequests || question.choiceRequests.length === 0) {
      question.choiceRequests = [
        {
          id: null,
          textForeign: question.targetWordNative || "",
          textRomaji: "",
          imageKey: "",
          imageUrl: "",
          audioUrlForeign: "",
          isCorrect: true,
          meaning: "",
        },
      ];
    } else {
      question.choiceRequests[0].textForeign = question.targetWordNative || "";
      question.choiceRequests = [question.choiceRequests[0]];
    }
  }

  updateImageKeys();
  console.log("isEditing:", isEditing.value); // Giữ nguyên log
  bsModal.show();
}

function isJapanese(text) {
  return /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\s\p{P}ー]+$/u.test(
    text
  );
}

watch(
  () => question.targetWordNative,
  (newVal) => {
    const choice = question.choiceRequests[0];
    if (!choice) return;
    if (question.questionType === "WORD_ORDER" && isJapanese(newVal)) {
      choice.textForeign = "";
    }
    if (["PRONUNCIATION", "WRITING"].includes(question.questionType)) {
      choice.textForeign = newVal;
    }
  }
);

function onFileChange(event, choice) {
  const file = event.target.files[0];
  if (!file) return;
  if (!choice.imageKey) {
    choice.imageKey = "temp-" + Date.now();
  }
  choice.imageUrl = "";
  const existing = allImages.value.find(
    (img) => img.imageKey === choice.imageKey
  );
  if (existing) {
    existing.file = file;
    existing.imageUrl = "";
  } else {
    allImages.value.push({ file, imageKey: choice.imageKey, imageUrl: "" });
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    choice.imageUrl = e.target.result;
    const img = allImages.value.find((img) => img.imageKey === choice.imageKey);
    if (img) img.imageUrl = e.target.result;
  };
  reader.readAsDataURL(file);
}

function addChoice() {
  if (
    ["WORD_ORDER", "PRONUNCIATION", "WRITING"].includes(question.questionType)
  )
    return;
  question.choiceRequests.push({
    textForeign: "",
    textRomaji: "",
    isCorrect: false,
    imageKey: "",
    imageUrl: "",
    meaning: "",
  });
  updateImageKeys();
}

function removeChoice(index) {
  const removed = question.choiceRequests.splice(index, 1)[0];
  allImages.value = allImages.value.filter(
    (img) => img.imageKey !== removed.imageKey
  );
  updateImageKeys();
}

function validateBeforeSubmit() {
  return true; // Giữ nguyên logic validate hiện tại
}

function updateImageKeys() {
  question.choiceRequests.forEach((choice, idx) => {
    const oldKey = choice.imageKey;
    const newKey = "image" + (idx + 1);
    choice.imageKey = newKey;
    const img = allImages.value.find((img) => img.imageKey === oldKey);
    if (img) img.imageKey = newKey;
  });
}

watch(
  () => question.questionType,
  (newType) => {
    if (["PRONUNCIATION", "WRITING", "WORD_ORDER"].includes(newType)) {
      question.choiceRequests = [
        {
          id: null,
          textForeign: "",
          textRomaji: "",
          imageKey: "",
          imageUrl: "",
          audioUrlForeign: "",
          isCorrect: true,
          meaning: "",
        },
      ];
      allImages.value = [];
      updateImageKeys();
    }
  }
);

function onSubmit() {
  if (
    question.questionType === "WORD_ORDER" &&
    isJapanese(question.targetWordNative) &&
    question.choiceRequests.length > 0
  ) {
    question.choiceRequests[0].textForeign = question.targetWordNative;
  }
  updateImageKeys();
  if (!validateBeforeSubmit()) {
    alert("Vui lòng nhập đủ nội dung phù hợp với loại câu hỏi.");
    return;
  }
  const questionToEmit = JSON.parse(JSON.stringify(question));
  questionToEmit.choiceRequests.forEach((choice) => {
    delete choice.imageUrl;
  });
  console.log("Question được gửi là:", JSON.stringify(questionToEmit, null, 2)); // Giữ nguyên log
  emit("question-saved", {
    ...question,
    allImages: allImages.value,
  });
}

onMounted(() => {
  bsModal = new Modal(modalRef.value);
});

onUnmounted(() => {
  if (bsModal) {
    bsModal.dispose();
    bsModal = null;
  }
});

defineExpose({ openModal, closeModal });
</script>

<style scoped>
.modal-body {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
