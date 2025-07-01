<template>
  <v-dialog
    :model-value="show"
    @update:model-value="$emit('update:show', $event)"
    max-width="700px"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-xl elevation-8 dialog-card">
      <v-toolbar color="blue-darken-2" dark flat class="rounded-t-xl">
        <v-toolbar-title class="text-h6 font-weight-bold pl-3">
          {{ editedAudio ? '✏️ Chỉnh sửa Bài Nghe' : '✨ Thêm Bài Nghe Mới' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog">
          <span class="text-h6">❌</span>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="saveAudio">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Tiêu đề Bài nghe"
                v-model="form.title"
                :rules="[v => !!v || 'Tiêu đề không được để trống']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="📝"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Tác giả"
                v-model="form.author"
                :rules="[v => !!v || 'Tác giả không được để trống']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="✍️"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Thời lượng (ví dụ: 1:30)"
                v-model="form.duration"
                :rules="[v => !!v || 'Thời lượng không được để trống', v => /^\d{1,2}:\d{2}$/.test(v) || 'Định dạng phải là MM:SS']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="⏱️"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                label="Cấp độ"
                v-model="form.level"
                :items="availableLevels"
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
            <v-col cols="12">
              <v-text-field
                label="URL Audio (MP3)"
                v-model="form.src"
                :rules="[v => !!v || 'URL không được để trống', v => (v && v.startsWith('http') && v.endsWith('.mp3')) || 'URL phải là đường dẫn .mp3 hợp lệ']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="🔗"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Transcript/Script (Nội dung bài nghe)"
                v-model="form.transcript"
                variant="outlined"
                rows="4"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="📄"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 bg-grey-lighten-4 rounded-b-xl d-flex justify-end">
        <v-btn color="grey-darken-1" variant="flat" class="rounded-lg px-6 py-3" @click="closeDialog">
          Hủy
        </v-btn>
        <v-btn color="blue-darken-2" variant="elevated" class="rounded-lg px-6 py-3" @click="saveAudio">
          Lưu Bài nghe
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, nextTick } from 'vue';

const props = defineProps({
  show: Boolean,
  editedAudio: Object, // The audio item to be edited (or null for new)
  availableLevels: {
    type: Array,
    default: () => ['N5', 'N4', 'N3', 'N2', 'N1'],
  },
  availableTopics: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:show', 'save']);

const formRef = ref(null); // Reference to the v-form component for validation

const defaultForm = {
  id: null,
  title: '',
  author: '',
  duration: '0:00',
  level: 'N5',
  topic: '',
  src: '',
  transcript: '',
};

const form = ref({ ...defaultForm });

watch(() => props.editedAudio, (newVal) => {
  if (newVal) {
    form.value = JSON.parse(JSON.stringify(newVal));
  } else {
    form.value = { ...defaultForm };
  }
}, { immediate: true, deep: true });

const saveAudio = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    emit('save', { ...form.value });
    closeDialog();
  }
};

const closeDialog = () => {
  emit('update:show', false);
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetValidation();
    }
  });
};
</script>

<style scoped>
.dialog-card {
  overflow: hidden;
}

.rounded-t-xl {
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
}

.dialog-card .v-card-text {
  padding: 30px !important;
  background-color: #F8F9FA;
}

.dialog-card .v-card-actions {
  border-top: 1px solid #EEEEEE;
  padding: 20px 30px !important;
}

.v-text-field,
.v-select,
.v-textarea {
  background-color: #FFFFFF !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.v-text-field :deep(.v-field__prepend-inner),
.v-select :deep(.v-field__prepend-inner),
.v-textarea :deep(.v-field__prepend-inner) {
  padding-top: 0;
  margin-top: -4px;
}

.v-text-field :deep(.v-field__prepend-inner span),
.v-select :deep(.v-field__prepend-inner span),
.v-textarea :deep(.v-field__prepend-inner span) {
  font-size: 1.1rem;
  line-height: 1;
}

.v-btn.rounded-lg {
  border-radius: 8px !important;
}
</style>
