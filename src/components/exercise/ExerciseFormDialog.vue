<template>
  <v-dialog
    :model-value="show"
    @update:model-value="closeDialog"
    max-width="800px"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-xl elevation-8 dialog-card">
      <v-toolbar color="blue-darken-2" dark flat class="rounded-t-xl">
        <v-toolbar-title class="text-h6 font-weight-bold pl-3">
          {{ editedExercise ? '✏️ Chỉnh sửa Bài tập' : '✨ Thêm Bài tập Mới' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog">
          <span class="text-h6">❌</span>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="saveExercise">
          <v-row>
            <!-- Common fields for all exercise types -->
            <v-col cols="12">
              <v-text-field
                label="Tiêu đề Bài tập"
                v-model="form.title"
                :rules="[v => !!v || 'Tiêu đề không được để trống']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="📋"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                label="Cấp độ"
                v-model="form.level"
                :items="['N5', 'N4', 'N3', 'N2', 'N1', 'All']"
                :rules="[v => !!v || 'Cấp độ không được để trống']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="💯"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                label="Chủ đề"
                v-model="form.topic"
                :items="availableTopics"
                :rules="[v => !!v || 'Chủ đề không được để trống']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="🏷️"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                label="Trạng thái"
                v-model="form.status"
                :items="['Published', 'Draft', 'Pending Review', 'Rejected']"
                :rules="[v => !!v || 'Trạng thái không được để trống']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="🚦"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                label="Loại Bài tập"
                v-model="form.type"
                :items="exerciseTypes"
                item-title="text"
                item-value="value"
                :rules="[v => !!v || 'Loại bài tập không được để trống']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="🧩"
                @update:model-value="resetFormFieldsForType"
              ></v-select>
            </v-col>

            <!-- Dynamic fields based on exercise type -->
            <!-- Matching Exercise Fields -->
            <v-col cols="12" v-if="form.type === 'matching'">
              <h4 class="text-subtitle-1 font-weight-bold mb-2 d-flex align-center">
                <span class="mr-2">🔗</span> Các cặp Nối nghĩa
              </h4>
              <div v-for="(pair, index) in form.pairs" :key="index" class="d-flex align-center mb-2">
                <v-text-field
                  v-model="pair.left"
                  :label="`Trái #${index + 1}`"
                  :rules="[v => !!v || 'Không được để trống']"
                  variant="outlined"
                  density="comfortable"
                  class="rounded-lg mr-2"
                  hide-details="auto"
                ></v-text-field>
                <v-text-field
                  v-model="pair.right"
                  :label="`Phải #${index + 1}`"
                  :rules="[v => !!v || 'Không được để trống']"
                  variant="outlined"
                  density="comfortable"
                  class="rounded-lg"
                  hide-details="auto"
                ></v-text-field>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="error"
                  @click="removePair(index)"
                  class="ml-2"
                >
                  <v-icon>mdi-minus-circle</v-icon>
                  <v-tooltip activator="parent" location="top">Xóa cặp này</v-tooltip>
                </v-btn>
              </div>
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                block
                @click="addPair"
                prepend-icon="mdi-plus"
                class="mt-2 rounded-lg"
              >
                Thêm cặp mới
              </v-btn>
            </v-col>

            <!-- Fill-in-the-Blanks Exercise Fields -->
            <v-col cols="12" v-if="form.type === 'fill_in_the_blanks'">
              <h4 class="text-subtitle-1 font-weight-bold mb-2 d-flex align-center">
                <span class="mr-2">🖊️</span> Câu điền từ (Sử dụng `___` cho chỗ trống)
              </h4>
              <v-textarea
                label="Câu có chỗ trống"
                v-model="form.sentence"
                :rules="[v => !!v || 'Câu không được để trống']"
                required
                variant="outlined"
                rows="3"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="💬"
              ></v-textarea>
              <h4 class="text-subtitle-1 font-weight-bold mb-2 d-flex align-center">
                <span class="mr-2">🔑</span> Đáp án (Phân cách bởi dấu phẩy, không có khoảng trắng)
              </h4>
              <v-text-field
                label="Ví dụ: từ_1,từ_2,từ_3"
                v-model="form.answers"
                :rules="[v => !!v || 'Đáp án không được để trống']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="✔️"
              ></v-text-field>
            </v-col>

            <!-- Multiple Choice Exercise Fields -->
            <v-col cols="12" v-if="form.type === 'multiple_choice'">
              <h4 class="text-subtitle-1 font-weight-bold mb-2 d-flex align-center">
                <span class="mr-2">❓</span> Câu hỏi trắc nghiệm
              </h4>
              <v-textarea
                label="Nội dung câu hỏi"
                v-model="form.question"
                :rules="[v => !!v || 'Câu hỏi không được để trống']"
                required
                variant="outlined"
                rows="3"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="🗣️"
              ></v-textarea>
              <h4 class="text-subtitle-1 font-weight-bold mb-2 d-flex align-center">
                <span class="mr-2">💡</span> Các lựa chọn
              </h4>
              <div v-for="(option, index) in form.options" :key="index" class="d-flex align-center mb-2">
                <v-text-field
                  v-model="form.options[index]"
                  :label="`Lựa chọn #${index + 1}`"
                  :rules="[v => !!v || 'Lựa chọn không được để trống']"
                  variant="outlined"
                  density="comfortable"
                  class="rounded-lg mr-2"
                  hide-details="auto"
                ></v-text-field>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="error"
                  @click="removeOption(index)"
                  class="ml-2"
                >
                  <v-icon>mdi-minus-circle</v-icon>
                  <v-tooltip activator="parent" location="top">Xóa lựa chọn này</v-tooltip>
                </v-btn>
              </div>
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                block
                @click="addOption"
                prepend-icon="mdi-plus"
                class="mt-2 rounded-lg"
              >
                Thêm lựa chọn
              </v-btn>
              <v-select
                label="Đáp án đúng"
                v-model="form.correctAnswer"
                :items="form.options"
                :rules="[v => !!v || 'Đáp án đúng không được để trống']"
                required
                variant="outlined"
                class="rounded-lg mt-4"
                density="comfortable"
                prepend-inner-icon="✅"
              ></v-select>
            </v-col>

            <!-- Notes Exercise Fields -->
            <v-col cols="12" v-if="form.type === 'notes'">
              <h4 class="text-subtitle-1 font-weight-bold mb-2 d-flex align-center">
                <span class="mr-2">📄</span> Nội dung ghi chú/mẹo
              </h4>
              <v-textarea
                label="Nội dung bài ghi chú"
                v-model="form.content"
                :rules="[v => !!v || 'Nội dung không được để trống']"
                required
                variant="outlined"
                rows="5"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="✏️"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 bg-grey-lighten-4 rounded-b-xl d-flex justify-end">
        <v-btn color="grey-darken-1" variant="flat" class="rounded-lg px-6 py-3" @click="closeDialog">
          Hủy
        </v-btn>
        <v-btn color="blue-darken-2" variant="elevated" class="rounded-lg px-6 py-3" @click="saveExercise">
          Lưu Bài tập
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  editedExercise: Object, // The exercise object to be edited (or null for new)
  availableTopics: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:show', 'save']);

const formRef = ref(null); // Reference to the v-form component for validation

// Initial form state
const defaultForm = {
  id: null,
  title: '',
  level: 'N5', // Default level
  topic: '',
  status: 'Draft', // Default status
  type: 'matching', // Default exercise type
  author: 'Admin',
  date: new Date().toISOString().substring(0, 10),
  // Type-specific fields (initialized as empty/default for flexibility)
  pairs: [{ left: '', right: '' }], // For 'matching'
  sentence: '', // For 'fill_in_the_blanks'
  answers: '', // For 'fill_in_the_blanks'
  question: '', // For 'multiple_choice'
  options: ['', ''], // For 'multiple_choice' (at least 2 options)
  correctAnswer: '', // For 'multiple_choice'
  content: '', // For 'notes'
};

const form = ref({ ...defaultForm });

const exerciseTypes = [
  { text: 'Nối nghĩa', value: 'matching' },
  { text: 'Điền từ', value: 'fill_in_the_blanks' },
  { text: 'Chọn từ', value: 'multiple_choice' },
  { text: 'Lưu ý/Mẹo', value: 'notes' },
];

// Watch for changes in editedExercise prop to populate the form
watch(() => props.editedExercise, (newVal) => {
  if (newVal) {
    // Deep copy the edited exercise to avoid modifying the prop directly
    form.value = JSON.parse(JSON.stringify(newVal));
    // Ensure type-specific arrays are initialized if missing when editing
    if (form.value.type === 'matching' && !form.value.pairs) {
      form.value.pairs = [{ left: '', right: '' }];
    }
    if (form.value.type === 'multiple_choice' && !form.value.options) {
      form.value.options = ['', ''];
    }
  } else {
    // Reset to default form for new exercise
    form.value = { ...defaultForm };
  }
}, { immediate: true, deep: true }); // immediate to run on mount, deep to watch nested changes


// Reset specific form fields when exercise type changes
const resetFormFieldsForType = (newType) => {
  // Reset all type-specific fields
  form.value.pairs = [{ left: '', right: '' }];
  form.value.sentence = '';
  form.value.answers = '';
  form.value.question = '';
  form.value.options = ['', ''];
  form.value.correctAnswer = '';
  form.value.content = '';

  // Apply default initial values for the new type if needed
  if (newType === 'matching') {
    // Already set by defaultForm
  } else if (newType === 'multiple_choice') {
    // Already set by defaultForm
  }
};


// Matching Exercise specific functions
const addPair = () => {
  form.value.pairs.push({ left: '', right: '' });
};

const removePair = (index) => {
  form.value.pairs.splice(index, 1);
  if (form.value.pairs.length === 0) {
    addPair(); // Ensure at least one pair remains
  }
};

// Multiple Choice Exercise specific functions
const addOption = () => {
  form.value.options.push('');
};

const removeOption = (index) => {
  form.value.options.splice(index, 1);
  if (form.value.options.length < 2) {
    addOption(); // Ensure at least two options remain
    if (form.value.options.length < 2) addOption(); // Add another if still less than 2
  }
  // If correct answer was removed, reset it
  if (!form.value.options.includes(form.value.correctAnswer)) {
    form.value.correctAnswer = '';
  }
};


const saveExercise = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    emit('save', { ...form.value });
    closeDialog();
  }
};

const closeDialog = () => {
  emit('update:show', false);
  // Reset form validation state when closing
  if (formRef.value) {
    formRef.value.resetValidation();
  }
};
</script>

<style scoped>
.dialog-card {
  overflow: hidden; /* Ensures rounded corners are visible */
}

.rounded-t-xl {
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
}

.dialog-card .v-card-text {
  padding: 30px !important;
  background-color: #F8F9FA; /* Slightly grey background for content */
}

.dialog-card .v-card-actions {
  border-top: 1px solid #EEEEEE;
  padding: 20px 30px !important;
}

.v-text-field,
.v-select,
.v-textarea {
  background-color: #FFFFFF !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); /* Soft shadow for inputs */
}

/* Style for prepend-inner-icon emojis */
.v-text-field :deep(.v-field__prepend-inner),
.v-select :deep(.v-field__prepend-inner),
.v-textarea :deep(.v-field__prepend-inner) {
  padding-top: 0;
  margin-top: -4px; /* Adjust vertical alignment if needed */
}

.v-text-field :deep(.v-field__prepend-inner span),
.v-select :deep(.v-field__prepend-inner span),
.v-textarea :deep(.v-field__prepend-inner span) {
  font-size: 1.1rem; /* Adjust emoji size */
  line-height: 1;
}

.v-btn.rounded-lg {
  border-radius: 8px !important;
}

/* Specific styles for nested inputs within dynamic sections */
.v-col .v-text-field.rounded-lg.mr-2,
.v-col .v-text-field.rounded-lg {
  box-shadow: none !important; /* Remove shadow for nested inputs */
  background-color: #f0f2f5 !important; /* Lighter background for nested inputs */
}
</style>
