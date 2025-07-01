<template>
  <v-dialog
    :model-value="show"
    @update:model-value="closeDialog"
    max-width="600px"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-xl elevation-8 dialog-card">
      <v-toolbar color="blue-darken-2" dark flat class="rounded-t-xl">
        <v-toolbar-title class="text-h6 font-weight-bold pl-3">
          {{ editedItem && editedItem.id ? '✏️ Chỉnh sửa ' : '✨ Thêm mới ' }}
          {{ currentTab === 'grammar' ? 'Ngữ pháp' : 'Bài giảng' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog">
          <span class="text-h6">❌</span>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="valid" lazy-validation>

          <v-text-field
            v-model="localItem.title"
            label="Tiêu đề"
            :placeholder="currentTab === 'grammar' ? 'Nhập tiêu đề ngữ pháp...' : 'Nhập tiêu đề bài giảng...'"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
            class="rounded-lg mb-4"
            prepend-inner-icon="📝"
          ></v-text-field>

          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="localItem.level"
                :items="['N5', 'N4', 'N3', 'N2', 'N1']"
                label="Cấp độ"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
                class="rounded-lg"
                prepend-inner-icon="💯"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="localItem.status"
                :items="['Published', 'Draft', 'Pending Review', 'Rejected']"
                label="Trạng thái"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
                class="rounded-lg"
                prepend-inner-icon="🚦"
              ></v-select>
            </v-col>
          </v-row>

          <template v-if="currentTab === 'grammar'">
            <v-textarea
              v-model="localItem.description"
              label="Mô tả"
              placeholder="Nhập mô tả về ngữ pháp..."
              rows="3"
              variant="outlined"
              density="comfortable"
              class="rounded-lg mb-4"
              prepend-inner-icon="📖"
            ></v-textarea>

            <v-text-field
              v-model="localItem.exampleJp"
              label="Ví dụ (Tiếng Nhật)"
              placeholder="Nhập ví dụ bằng tiếng Nhật..."
              variant="outlined"
              density="comfortable"
              class="rounded-lg mb-4"
              prepend-inner-icon="🇯🇵"
            ></v-text-field>

            <v-text-field
              v-model="localItem.exampleVn"
              label="Bản dịch (Tiếng Việt)"
              placeholder="Nhập bản dịch tiếng Việt..."
              variant="outlined"
              density="comfortable"
              class="rounded-lg mb-4"
              prepend-inner-icon="🇻🇳"
            ></v-text-field>
          </template>

          <template v-else-if="currentTab === 'lectures'">
            <v-text-field
              v-model="localItem.duration"
              label="Thời lượng (phút)"
              type="number"
              variant="outlined"
              density="comfortable"
              class="rounded-lg mb-4"
              :rules="[rules.number]"
              prepend-inner-icon="⏱️"
            ></v-text-field>
            <v-text-field
              v-model="localItem.vocabularyCount"
              label="Số lượng từ vựng"
              type="number"
              variant="outlined"
              density="comfortable"
              class="rounded-lg mb-4"
              :rules="[rules.number]"
              prepend-inner-icon="🔢"
            ></v-text-field>
            <v-text-field
              v-model="localItem.grammarCount"
              label="Số lượng ngữ pháp"
              type="number"
              variant="outlined"
              density="comfortable"
              class="rounded-lg mb-4"
              :rules="[rules.number]"
              prepend-inner-icon="✍️"
            ></v-text-field>
            <v-combobox
                v-model="localItem.tags"
                :items="['Video', 'Tương tác', 'Audio', 'Văn bản', 'Ebook']"
                label="Tags (nhập hoặc chọn)"
                multiple
                chips
                variant="outlined"
                density="comfortable"
                class="rounded-lg mb-4"
                prepend-inner-icon="🏷️"
            ></v-combobox>
          </template>

        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 bg-grey-lighten-4 rounded-b-xl d-flex justify-end">
        <v-btn
          color="grey-darken-1"
          variant="flat"
          class="rounded-lg px-6 py-3"
          @click="closeDialog"
        >
          Hủy
        </v-btn>
        <v-btn
          color="blue-darken-2"
          variant="elevated"
          class="rounded-lg px-6 py-3"
          @click="save"
          :disabled="!valid"
          prepend-icon="fa-solid fa-floppy-disk"
        >
          Lưu
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  show: Boolean,
  editedItem: Object,
  currentTab: String // 'grammar' or 'lectures'
});

const emit = defineEmits(['update:show', 'save']);

const formRef = ref(null); // Changed 'form' to 'formRef' for consistency and clarity
const valid = ref(true);
const localItem = ref({}); // Use a local copy for editing

const rules = {
  required: value => !!value || 'Trường này là bắt buộc.',
  date: value => /^\d{4}-\d{2}-\d{2}$/.test(value) || 'Ngày không hợp lệ (YYYY-MM-DD).',
  number: value => {
      if (value === '' || value === null || value === undefined) return true; // Allow empty for optional numbers if not required
      return (!isNaN(parseFloat(value)) && isFinite(value)) || 'Phải là một số.';
  }
};

watch(() => props.editedItem, (newItem) => {
  if (newItem) {
    // If editing, use the provided item
    localItem.value = { ...newItem };
  } else {
    // If adding new, initialize based on currentTab
    if (props.currentTab === 'grammar') {
      localItem.value = {
        id: null,
        title: '',
        level: 'N5',
        status: 'Draft',
        description: '',
        exampleJp: '',
        exampleVn: '',
        type: 'Ngữ pháp', // Set type for new item
        emoji: '💡'
      };
    } else { // currentTab === 'lectures'
      localItem.value = {
        id: null,
        title: '',
        level: 'N5',
        status: 'Draft',
        type: 'Bài giảng', // Set type for new item
        tags: [],
        duration: null,
        vocabularyCount: null,
        grammarCount: null,
        emoji: '📚'
      };
    }
  }
  // Make sure type is correctly set for dialog logic
  localItem.value.type = props.currentTab === 'grammar' ? 'Ngữ pháp' : 'Bài giảng';
}, { immediate: true });

async function save() {
  const { valid: formValid } = await formRef.value.validate(); // Use formRef and destructure valid
  if (formValid) {
    emit('save', { ...localItem.value });
    closeDialog();
  }
}

function closeDialog() {
  emit('update:show', false);
  nextTick(() => {
    if (formRef.value) { // Use formRef here
      formRef.value.resetValidation();
    }
  });
}
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
.v-textarea,
.v-combobox { /* Added v-combobox to styling */
  background-color: #FFFFFF !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); /* Soft shadow for inputs */
}

/* Style for prepend-inner-icon emojis */
.v-text-field :deep(.v-field__prepend-inner),
.v-select :deep(.v-field__prepend-inner),
.v-textarea :deep(.v-field__prepend-inner),
.v-combobox :deep(.v-field__prepend-inner) { /* Added v-combobox */
  padding-top: 0;
  margin-top: -4px; /* Adjust vertical alignment if needed */
}

.v-text-field :deep(.v-field__prepend-inner span),
.v-select :deep(.v-field__prepend-inner span),
.v-textarea :deep(.v-field__prepend-inner span),
.v-combobox :deep(.v-field__prepend-inner span) { /* Added v-combobox */
  font-size: 1.1rem; /* Adjust emoji size */
  line-height: 1;
}

.v-btn.rounded-lg {
  border-radius: 8px !important;
}
</style>
