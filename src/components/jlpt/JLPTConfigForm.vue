<template>
  <v-dialog
    :model-value="show"
    @update:model-value="$emit('update:show', $event)"
    max-width="600px"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-xl elevation-8 dialog-card">
      <v-toolbar color="purple-darken-2" dark flat class="rounded-t-xl">
        <v-toolbar-title class="text-h6 font-weight-bold pl-3">
          ⚙️ Cấu hình Đề thi: {{ testTitle }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeForm">
          <span class="text-h6">❌</span>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="saveForm">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Điểm đậu"
                v-model.number="form.passingScore"
                type="number"
                :rules="[v => (v !== null && v !== undefined && v !== '') || 'Điểm đậu không được để trống', v => v >= 0 && v <= 180 || 'Điểm phải từ 0 đến 180']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="🎯"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Thời gian giới hạn (phút)"
                v-model.number="form.timeLimitMinutes"
                type="number"
                :rules="[v => (v !== null && v !== undefined && v !== '') || 'Thời gian giới hạn không được để trống', v => v > 0 || 'Thời gian phải lớn hơn 0']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="⏱️"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <h4 class="text-subtitle-1 font-weight-bold mb-3">Phần thi được bật:</h4>
              <v-row>
                <v-col v-for="(enabled, section) in form.sectionsEnabled" :key="section" cols="6" sm="4">
                  <v-checkbox
                    :label="getSectionLabel(section)"
                    v-model="form.sectionsEnabled[section]"
                    color="primary"
                    hide-details
                    class="mt-0"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-col>

            <!-- Add more configuration fields as needed -->

          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 bg-grey-lighten-4 rounded-b-xl d-flex justify-end">
        <v-btn color="grey-darken-1" variant="flat" class="rounded-lg px-6 py-3" @click="closeForm">
          Hủy
        </v-btn>
        <v-btn color="purple-darken-2" variant="elevated" class="rounded-lg px-6 py-3" @click="saveForm">
          Lưu Cấu hình
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, nextTick } from 'vue';

const props = defineProps({
  show: Boolean,
  configData: Object, // The configuration object for a specific test
  testTitle: String, // Title of the test for display
});

const emit = defineEmits(['update:show', 'saveConfig']);

const formRef = ref(null);

const defaultForm = {
  passingScore: 0,
  timeLimitMinutes: 0,
  sectionsEnabled: {
    listening: false,
    grammar: false,
    reading: false,
    vocabulary: false,
    kanji: false,
  },
};

const form = ref({ ...defaultForm });

watch(() => props.configData, (newVal) => {
  if (newVal) {
    // Deep copy the configData to avoid mutating props
    form.value = JSON.parse(JSON.stringify(newVal));
  } else {
    // Reset to default form if no configData is provided
    form.value = { ...defaultForm };
  }
}, { immediate: true, deep: true });

const getSectionLabel = (sectionKey) => {
  switch (sectionKey) {
    case 'listening': return 'Nghe hiểu';
    case 'grammar': return 'Ngữ pháp';
    case 'reading': return 'Đọc hiểu';
    case 'vocabulary': return 'Từ vựng';
    case 'kanji': return 'Kanji';
    default: return sectionKey;
  }
};

const saveForm = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    emit('saveConfig', { ...form.value });
    closeForm();
  }
};

const closeForm = () => {
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
.v-checkbox {
  background-color: #FFFFFF !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.v-text-field :deep(.v-field__prepend-inner),
.v-select :deep(.v-field__prepend-inner) {
  padding-top: 0;
  margin-top: -4px;
}

.v-text-field :deep(.v-field__prepend-inner span),
.v-select :deep(.v-field__prepend-inner span) {
  font-size: 1.1rem;
  line-height: 1;
}

.v-btn.rounded-lg {
  border-radius: 8px !important;
}
</style>
