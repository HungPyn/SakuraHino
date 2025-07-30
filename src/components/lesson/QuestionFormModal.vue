<template>
  <div
    class="modal fade"
    id="questionFormModal"
    tabindex="-1"
    aria-labelledby="questionFormModalLabel"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="questionFormModalLabel">
            {{ isEditing ? "Chỉnh sửa Câu hỏi" : "Thêm Câu hỏi Mới" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="onSubmit">
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label for="promptTextTemplate" class="form-label"
                  >Nội dung Câu hỏi <span class="text-danger">*</span></label
                >
                <input
                  id="promptTextTemplate"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.promptTextTemplate }"
                  v-model="question.promptTextTemplate"
                  placeholder="Ví dụ: Chọn hình đúng với từ '{targetWordNative}'"
                  required
                />
                <div class="invalid-feedback" v-if="errors.promptTextTemplate">
                  {{ errors.promptTextTemplate }}
                </div>
                <div class="form-text">
                  Sử dụng `{targetWordNative}` để hiển thị từ đích.
                </div>
              </div>

              <div class="col-md-6">
                <label for="questionType" class="form-label"
                  >Loại Câu hỏi <span class="text-danger">*</span></label
                >
                <select
                  id="questionType"
                  class="form-select"
                  :class="{ 'is-invalid': errors.questionType }"
                  v-model="question.questionType"
                  required
                >
                  <option
                    v-for="type in questionTypes"
                    :key="type.value"
                    :value="type.value"
                  >
                    {{ type.text }}
                  </option>
                </select>
                <div class="invalid-feedback" v-if="errors.questionType">
                  {{ errors.questionType }}
                </div>
              </div>

              <div class="col-md-6">
                <label for="targetWordNative" class="form-label"
                  >Từ/Câu đích (Native)
                  <span class="text-danger">*</span></label
                >
                <input
                  id="targetWordNative"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.targetWordNative }"
                  v-model="question.targetWordNative"
                  placeholder="Ví dụ: りんご hoặc Tôi | là | giáo viên"
                />
                <div class="invalid-feedback" v-if="errors.targetWordNative">
                  {{ errors.targetWordNative }}
                </div>
                <div class="form-text">
                  Từ hoặc câu trả lời đúng cho câu hỏi.
                </div>
              </div>

              <div class="col-md-3">
                <label for="targetLanguageCode" class="form-label"
                  >Mã NN đích <span class="text-danger">*</span></label
                >
                <input
                  id="targetLanguageCode"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.targetLanguageCode }"
                  v-model="question.targetLanguageCode"
                  placeholder="Ví dụ: ja (tiếng Nhật), vi (tiếng Việt)"
                  required
                />
                <div class="invalid-feedback" v-if="errors.targetLanguageCode">
                  {{ errors.targetLanguageCode }}
                </div>
              </div>

              <div class="col-md-3">
                <label for="optionsLanguageCode" class="form-label"
                  >Mã NN lựa chọn</label
                >
                <input
                  id="optionsLanguageCode"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.optionsLanguageCode }"
                  v-model="question.optionsLanguageCode"
                  placeholder="Ví dụ: vi (tiếng Việt), ja (tiếng Nhật)"
                />
                <div class="invalid-feedback" v-if="errors.optionsLanguageCode">
                  {{ errors.optionsLanguageCode }}
                </div>
              </div>

              <div class="col-12">
                <label for="audioUrlQuestions" class="form-label"
                  >Audio URL (Câu hỏi)</label
                >
                <input
                  id="audioUrlQuestions"
                  type="url"
                  class="form-control"
                  :class="{ 'is-invalid': errors.audioUrlQuestions }"
                  v-model="question.audioUrlQuestions"
                  placeholder="https://example.com/audio/question.mp3"
                />
                <div class="invalid-feedback" v-if="errors.audioUrlQuestions">
                  {{ errors.audioUrlQuestions }}
                </div>
                <div class="form-text">
                  URL của file âm thanh cho câu hỏi (nếu có).
                </div>
              </div>
            </div>

            <hr class="my-4" />

            <h5 class="mb-3">
              Các Lựa chọn <span class="text-danger">*</span>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary ms-2"
                @click="addChoice"
              >
                <i class="bi bi-plus-lg"></i> Thêm lựa chọn
              </button>
            </h5>
            <div class="invalid-feedback d-block" v-if="errors.choices">
              {{ errors.choices }}
            </div>

            <div
              v-if="question.choices?.length === 0"
              class="alert alert-warning"
            >
              Chưa có lựa chọn nào. Vui lòng thêm ít nhất một lựa chọn.
            </div>

            <div class="list-group mb-4">
              <div
                v-for="(choice, index) in question.choices"
                :key="choice.id || index"
                class="list-group-item d-flex flex-column mb-3 p-3 border rounded shadow-sm"
              >
                <div
                  class="d-flex justify-content-between align-items-start mb-2"
                >
                  <h6 class="mb-0">Lựa chọn #{{ index + 1 }}</h6>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    @click="removeChoice(index)"
                    v-if="question.choices.length > 1"
                  >
                    <i class="bi bi-trash"></i> Xóa
                  </button>
                </div>
                <div class="row g-2">
                  <div class="col-md-6">
                    <label
                      :for="'textForeign-' + index"
                      class="form-label form-label-sm"
                      >Từ ngoại ngữ</label
                    >
                    <input
                      :id="'textForeign-' + index"
                      type="text"
                      class="form-control form-control-sm"
                      v-model="choice.textForeign"
                      placeholder="Ví dụ: りんご"
                    />
                  </div>
                  <div class="col-md-6">
                    <label
                      :for="'textRomaji-' + index"
                      class="form-label form-label-sm"
                      >Phiên âm Romaji</label
                    >
                    <input
                      :id="'textRomaji-' + index"
                      type="text"
                      class="form-control form-control-sm"
                      v-model="choice.textRomaji"
                      placeholder="Ví dụ: ringo"
                    />
                  </div>
                  <div class="col-12">
                    <label
                      :for="'imageUrl-' + index"
                      class="form-label form-label-sm"
                      >URL Hình ảnh</label
                    >
                    <input
                      :id="'imageUrl-' + index"
                      type="url"
                      class="form-control form-control-sm"
                      v-model="choice.imageUrl"
                      placeholder="https://example.com/images/choice.png"
                    />
                    <div v-if="choice.imageUrl" class="mt-2 text-center">
                      <img
                        :src="choice.imageUrl"
                        alt="Hình ảnh lựa chọn"
                        class="img-thumbnail"
                        style="max-width: 150px; height: auto"
                      />
                    </div>
                  </div>
                  <div class="col-12">
                    <label
                      :for="'audioUrlForeign-' + index"
                      class="form-label form-label-sm"
                      >Audio URL (Lựa chọn)</label
                    >
                    <input
                      :id="'audioUrlForeign-' + index"
                      type="url"
                      class="form-control form-control-sm"
                      v-model="choice.audioUrlForeign"
                      placeholder="https://example.com/audio/choice.mp3"
                    />
                  </div>
                  <div class="col-md-6">
                    <label
                      :for="'textBlock-' + index"
                      class="form-label form-label-sm"
                      >Đoạn văn (Text Block)</label
                    >
                    <textarea
                      :id="'textBlock-' + index"
                      class="form-control form-control-sm"
                      v-model="choice.textBlock"
                      rows="2"
                      placeholder="Dùng cho loại câu hỏi điền vào chỗ trống hoặc sắp xếp câu"
                    ></textarea>
                  </div>
                  <div class="col-md-6">
                    <label
                      :for="'meaning-' + index"
                      class="form-label form-label-sm"
                      >Nghĩa</label
                    >
                    <input
                      :id="'meaning-' + index"
                      type="text"
                      class="form-control form-control-sm"
                      v-model="choice.meaning"
                      placeholder="Ví dụ: quả táo"
                    />
                  </div>
                  <div class="col-12 d-flex align-items-center mt-2">
                    <div class="form-check">
                      <input
                        :id="'isCorrect-' + index"
                        class="form-check-input"
                        type="checkbox"
                        v-model="choice.isCorrect"
                      />
                      <label
                        :for="'isCorrect-' + index"
                        class="form-check-label"
                      >
                        Đây là đáp án đúng
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer d-flex justify-content-end gap-2">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Hủy
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-save"></i>
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
import { ref, reactive, onMounted } from "vue"; // Thêm reactive
import { Modal } from "bootstrap"; // Import Bootstrap Modal

const props = defineProps({
  // lessonId cần được truyền từ component cha (QuestionView) để biết câu hỏi thuộc bài học nào
  lessonId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["question-saved"]);

const modalRef = ref(null); // Ref để tham chiếu đến phần tử modal
let bsModal = null; // Biến lưu instance Bootstrap Modal

// Trạng thái cục bộ của form (reactive để Vue theo dõi thay đổi sâu)
const question = reactive({}); // Khởi tạo rỗng, sẽ được gán giá trị trong openModal

const isEditing = ref(false); // Trạng thái đang chỉnh sửa hay thêm mới
const errors = reactive({}); // Đối tượng lưu trữ lỗi validation

// Định nghĩa trạng thái ban đầu mặc định của một câu hỏi mới
const getInitialQuestionState = () => ({
  id: null,
  lessonId: props.lessonId, // Gán lessonId từ props khi khởi tạo
  questionType: "MULTIPLE_CHOICE_TEXT_ONLY", // Loại mặc định
  promptTextTemplate: "",
  targetWordNative: "",
  targetLanguageCode: "ja",
  optionsLanguageCode: "vi",
  audioUrlQuestions: null,
  choices: [
    // Khởi tạo với 4 lựa chọn trống mặc định
    getEmptyChoice(),
    getEmptyChoice(),
    getEmptyChoice(),
    getEmptyChoice(),
  ],
});

const questionTypes = [
  {
    value: "MULTIPLE_CHOICE_VOCAB_IMAGE",
    text: "Trắc nghiệm từ vựng (kèm ảnh)",
  },
  { value: "MULTIPLE_CHOICE_TEXT_ONLY", text: "Trắc nghiệm từ vựng (chữ)" },
  { value: "AUDIO_CHOICE", text: "Nghe & Chọn đáp án" },
  { value: "WORD_ORDER", text: "Sắp xếp từ thành câu" },
  { value: "PRONUNCIATION", text: "Phát âm" },
  { value: "WRITING", text: "Viết chữ" },
];

// Hàm tạo một lựa chọn trống
const getEmptyChoice = () => ({
  id: null,
  lessonQuestionId: null,
  textForeign: "",
  textRomaji: "",
  imageUrl: null,
  audioUrlForeign: null,
  isCorrect: false,
  textBlock: "",
  meaning: "",
});

const addChoice = () => {
  question.choices.push(getEmptyChoice());
};

const removeChoice = (index) => {
  if (question.choices.length > 1) {
    // Đảm bảo luôn có ít nhất 1 lựa chọn
    question.choices.splice(index, 1);
  } else {
    alert("Vui lòng giữ lại ít nhất một lựa chọn.");
  }
};

// Hàm mở modal và điền dữ liệu
function openModal(questionData = null) {
  Object.assign(errors, {}); // Xóa lỗi cũ
  // Reset form về trạng thái ban đầu trước khi điền dữ liệu mới
  Object.assign(question, getInitialQuestionState());

  if (questionData) {
    // Nếu có dữ liệu truyền vào, điền vào form (chế độ chỉnh sửa)
    // Dùng JSON.parse(JSON.stringify()) để tạo deep copy, tránh mutation props
    Object.assign(question, JSON.parse(JSON.stringify(questionData)));
    isEditing.value = true;
  } else {
    // Nếu không có dữ liệu (chế độ thêm mới)
    isEditing.value = false;
  }
  bsModal.show(); // Hiển thị modal
}

// Hàm đóng modal (sẽ được gọi tự động sau khi save hoặc nhấn hủy)
function closeModal() {
  bsModal.hide(); // Ẩn modal
}

const onSubmit = async () => {
  // --- Bắt đầu Validation ---
  Object.assign(errors, {}); // Xóa lỗi trước mỗi lần validate

  let isValid = true;

  // 1. Kiểm tra promptTextTemplate
  if (!question.promptTextTemplate || !question.promptTextTemplate.trim()) {
    errors.promptTextTemplate = "Nội dung Câu hỏi không được để trống.";
    isValid = false;
  }

  // 2. Kiểm tra questionType
  if (!question.questionType) {
    errors.questionType = "Loại Câu hỏi không được để trống.";
    isValid = false;
  }

  // 3. Kiểm tra targetWordNative
  if (!question.targetWordNative || !question.targetWordNative.trim()) {
    errors.targetWordNative = "Từ/Câu đích không được để trống.";
    isValid = false;
  }

  // 4. Kiểm tra targetLanguageCode
  if (!question.targetLanguageCode || !question.targetLanguageCode.trim()) {
    errors.targetLanguageCode = "Mã ngôn ngữ đích không được để trống.";
    isValid = false;
  }

  // 5. Kiểm tra URL hình ảnh/âm thanh (có thể thêm validation URL regex nếu cần)
  if (
    question.audioUrlQuestions &&
    !/^https?:\/\/.+\..+$/.test(question.audioUrlQuestions)
  ) {
    errors.audioUrlQuestions = "URL Âm thanh câu hỏi không hợp lệ.";
    isValid = false;
  }
  if (
    question.optionsLanguageCode &&
    !/^[a-z]{2}$/.test(question.optionsLanguageCode)
  ) {
    errors.optionsLanguageCode =
      "Mã ngôn ngữ lựa chọn không hợp lệ (ví dụ: 'en', 'vi').";
    isValid = false;
  }

  // 6. Kiểm tra Choices
  const isMultipleChoiceOrWordOrder = [
    "MULTIPLE_CHOICE_VOCAB_IMAGE",
    "MULTIPLE_CHOICE_TEXT_ONLY",
    "AUDIO_CHOICE",
    "WORD_ORDER",
  ].includes(question.questionType);
  const isPronunciationOrWriting = ["PRONUNCIATION", "WRITING"].includes(
    question.questionType
  );

  if (isMultipleChoiceOrWordOrder && question.choices.length < 2) {
    errors.choices = "Câu hỏi trắc nghiệm/sắp xếp cần ít nhất 2 lựa chọn.";
    isValid = false;
  } else if (isPronunciationOrWriting && question.choices.length < 1) {
    errors.choices = "Câu hỏi phát âm/viết cần ít nhất 1 lựa chọn.";
    isValid = false;
  }

  // Đếm đáp án đúng
  const correctChoicesCount = question.choices.filter(
    (c) => c.isCorrect
  ).length;

  if (isMultipleChoiceOrWordOrder) {
    if (correctChoicesCount === 0) {
      errors.choices =
        "Vui lòng chọn ít nhất một đáp án đúng cho câu hỏi trắc nghiệm/sắp xếp.";
      isValid = false;
    } else if (correctChoicesCount > 1) {
      errors.choices =
        "Câu hỏi trắc nghiệm/sắp xếp chỉ được có MỘT đáp án đúng.";
      isValid = false;
    }
  } else if (isPronunciationOrWriting) {
    if (correctChoicesCount === 0) {
      errors.choices = "Vui lòng chọn đáp án đúng cho câu hỏi phát âm/viết.";
      isValid = false;
    } else if (correctChoicesCount > 1) {
      errors.choices = "Câu hỏi phát âm/viết chỉ được có MỘT đáp án đúng.";
      isValid = false;
    }
  }

  // Kiểm tra nội dung rỗng trong các lựa chọn dựa trên loại câu hỏi
  question.choices.forEach((choice, index) => {
    let choiceError = "";
    const prefix = `Lựa chọn #${index + 1}: `;

    switch (question.questionType) {
      case "MULTIPLE_CHOICE_VOCAB_IMAGE":
        if (!choice.imageUrl || !choice.imageUrl.trim())
          choiceError += "Cần URL Hình ảnh. ";
        if (!choice.meaning || !choice.meaning.trim())
          choiceError += "Cần Nghĩa. ";
        break;
      case "MULTIPLE_CHOICE_TEXT_ONLY":
        if (!choice.textBlock || !choice.textBlock.trim())
          choiceError += "Cần Đoạn văn (Text Block). ";
        if (!choice.meaning || !choice.meaning.trim())
          choiceError += "Cần Nghĩa. ";
        break;
      case "AUDIO_CHOICE":
        if (
          !choice.textForeign &&
          !choice.textRomaji &&
          !choice.textBlock &&
          !choice.imageUrl &&
          !choice.audioUrlForeign
        ) {
          choiceError +=
            "Cần ít nhất một trong các trường: Từ ngoại ngữ, Romaji, Đoạn văn, URL Hình ảnh, URL Âm thanh. ";
        }
        break;
      case "WORD_ORDER":
        if (!choice.textBlock || !choice.textBlock.trim())
          choiceError += "Cần Đoạn văn (Text Block). ";
        break;
      case "PRONUNCIATION":
      case "WRITING":
        if (!choice.textForeign && !choice.textBlock) {
          // Thường là một từ/cụm từ cần viết/phát âm
          choiceError += "Cần Từ ngoại ngữ hoặc Đoạn văn (Text Block). ";
        }
        break;
    }
    // Thêm validation URL cho image và audio trong choices
    if (choice.imageUrl && !/^https?:\/\/.+\..+$/.test(choice.imageUrl)) {
      choiceError += "URL Hình ảnh không hợp lệ. ";
    }
    if (
      choice.audioUrlForeign &&
      !/^https?:\/\/.+\..+$/.test(choice.audioUrlForeign)
    ) {
      choiceError += "URL Âm thanh lựa chọn không hợp lệ. ";
    }

    if (choiceError) {
      if (!errors.choices) errors.choices = []; // Khởi tạo mảng nếu chưa có
      errors.choices.push(prefix + choiceError.trim());
      isValid = false;
    }
  });

  if (!isValid) {
    // Nếu có lỗi, modal sẽ vẫn hiển thị và các trường có lỗi sẽ được tô đỏ
    return;
  }
  // --- Kết thúc Validation ---

  // Gán lessonQuestionId cho các choices nếu chưa có
  // lessonQuestionId = id của câu hỏi
  question.choices.forEach((choice) => {
    if (!choice.lessonQuestionId) {
      choice.lessonQuestionId = question.id; // Nếu question.id là null (thêm mới), đây sẽ là null ban đầu
    }
  });

  // Giả lập ID nếu là thêm mới (thực tế sẽ do backend trả về)
  // Logic này lý tưởng nên được xử lý ở backend hoặc trong questionService sau khi gọi API
  if (!question.id) {
    question.id = Math.floor(Math.random() * 100000) + 1000; // ID tạm để đảm bảo unique trong mock
  }

  // Gửi dữ liệu câu hỏi đã hoàn chỉnh ra component cha
  // emit 'question-saved' với bản sao của dữ liệu question
  emit("question-saved", { ...question }); // Gửi một bản sao
  closeModal(); // Đóng modal sau khi emit
};

// Expose hàm openModal để component cha có thể gọi
defineExpose({
  openModal,
});

// Khởi tạo Bootstrap Modal khi component được mount
onMounted(() => {
  bsModal = new Modal(modalRef.value);
  // Reset form khi modal bị đóng bằng cách nhấn nút đóng hoặc click ra ngoài
  modalRef.value.addEventListener("hidden.bs.modal", () => {
    // Reset dữ liệu về trạng thái ban đầu của một câu hỏi mới
    Object.assign(question, getInitialQuestionState());
    Object.assign(errors, {}); // Xóa tất cả lỗi
    isEditing.value = false; // Đảm bảo trạng thái chỉnh sửa được reset
  });
});
</script>

<style scoped>
/* Scoped styles for QuestionFormModal */
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

/* Các style dành riêng cho modal */
.modal-dialog {
  /* Đây là nơi chứa nội dung modal */
  /* Cần đặt max-height và overflow-y để nội dung có thể cuộn */
  max-height: 90vh; /* Ví dụ: 90% chiều cao viewport */
  overflow-y: auto; /* Cho phép cuộn dọc */
}

/* Đảm bảo modal-content không bị tràn */
.modal-content {
  height: 100%; /* Đảm bảo nội dung modal chiếm hết chiều cao dialog */
  display: flex;
  flex-direction: column;
}

.modal-body {
  flex-grow: 1; /* Cho phép phần thân modal mở rộng */
  overflow-y: auto; /* Cuộn phần body nếu cần */
}

.form-label-sm {
  font-size: 0.875em; /* Kích thước nhỏ hơn cho label của choice */
  margin-bottom: 0.25rem;
}
.form-control-sm {
  height: calc(1.5em + 0.5rem + 2px); /* Kích thước input nhỏ hơn */
  padding: 0.25rem 0.5rem;
  font-size: 0.875em;
}

/* Style cho các trường bị lỗi */
.form-control.is-invalid,
.form-select.is-invalid,
.list-group .is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block; /* Đảm bảo hiển thị */
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}
</style>
