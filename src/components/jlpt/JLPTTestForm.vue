<template>
  <v-dialog
    :model-value="show"
    @update:model-value="$emit('close')"
    max-width="600px"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-xl elevation-8 dialog-card">
      <v-toolbar color="blue-darken-2" dark flat class="rounded-t-xl">
        <v-toolbar-title class="text-h6 font-weight-bold pl-3">
          {{ editing ? '✏️ Chỉnh sửa Đề thi JLPT' : '✨ Thêm Đề thi JLPT Mới' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeForm">
          <span class="text-h6">❌</span>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="saveForm">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Tiêu đề Đề thi"
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
              <v-select
                label="Cấp độ JLPT"
                v-model="form.level"
                :items="['N1', 'N2', 'N3', 'N4', 'N5']"
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
                label="Loại đề thi"
                v-model="form.type"
                :items="[{ title: 'Đề thi thật', value: 'real' }, { title: 'Đề thi thử', value: 'mock' }]"
                :rules="[v => !!v || 'Loại đề thi không được để trống']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="🏷️"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Năm phát hành"
                v-model.number="form.year"
                type="number"
                :rules="[v => !!v || 'Năm phát hành không được để trống', v => v > 1990 && v <= new Date().getFullYear() + 1 || 'Năm không hợp lệ']"
                required
                variant="outlined"
                class="rounded-lg"
                density="comfortable"
                prepend-inner-icon="🗓️"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-checkbox
                label="Đã chấm điểm"
                v-model="form.scored"
                color="primary"
                hide-details
                class="mt-2"
              ></v-checkbox>
            </v-col>
            <!-- Add more fields for sections, questions, answers if needed -->
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 bg-grey-lighten-4 rounded-b-xl d-flex justify-end">
        <v-btn color="grey-darken-1" variant="flat" class="rounded-lg px-6 py-3" @click="closeForm">
          Hủy
        </v-btn>
        <v-btn color="blue-darken-2" variant="elevated" class="rounded-lg px-6 py-3" @click="saveForm">
          Lưu Đề thi
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, nextTick } from 'vue';

const props = defineProps({
  show: Boolean,
  editing: Object, // The test object to edit (or null for new)
});

const emit = defineEmits(['close', 'save']);

const formRef = ref(null);

const defaultForm = {
  id: null,
  title: '',
  level: 'N5',
  type: 'mock',
  year: new Date().getFullYear(),
  scored: false,
};

const form = ref({ ...defaultForm });

watch(() => props.editing, (newVal) => {
  if (newVal) {
    // Deep copy the editing object to avoid direct mutation
    form.value = JSON.parse(JSON.stringify(newVal));
  } else {
    // Reset to default form for new entry
    form.value = { ...defaultForm };
  }
}, { immediate: true, deep: true }); // immediate: true to run on initial mount if `editing` is set

const saveForm = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    emit('save', { ...form.value });
  }
};

const closeForm = () => {
  emit('close');
  nextTick(() => {
    // Reset validation state when dialog closes
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
.v-select {
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
