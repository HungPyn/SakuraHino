<template>
  <v-dialog v-model="internalShow" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h6">
          {{ localItem.id ? "Sửa" : "Thêm" }} Câu hỏi
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="isFormValid">
          <v-select
            v-model="localItem.questionType"
            :items="[
              { title: 'Dựa trên nghĩa', value: 'text_based' },
              { title: 'Dựa trên hình ảnh', value: 'image_based' },
            ]"
            label="Loại câu hỏi"
            required
            class="mb-4"
          />
          <v-text-field
            v-if="localItem.questionType === 'text_based'"
            v-model="localItem.questionText"
            label="Nội dung câu hỏi"
            required
            class="mb-4"
          />
          <div v-if="localItem.questionType === 'image_based'" class="mb-4">
            <v-btn @click="triggerFileInput" color="primary" class="mb-2">
              <v-icon left>mdi-upload</v-icon> Tải ảnh lên
            </v-btn>
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              style="display: none"
              @change="onFileChange"
            />
            <div v-if="imagePreviewUrl" class="mt-2">
              <v-img :src="imagePreviewUrl" max-width="200" max-height="200" />
            </div>
          </div>
          <v-text-field
            v-model="localItem.answer"
            label="Đáp án"
            required
            class="mb-4"
          />
          <v-text-field
            v-model="localItem.answerRomaji"
            label="Đáp án Romaji"
            class="mb-4"
          />
          <v-select
            v-model="localItem.level"
            :items="['N5', 'N4', 'N3', 'N2', 'N1']"
            label="Cấp độ"
            required
            class="mb-4"
          />
          <v-text-field v-model="localItem.topic" label="Chủ đề" class="mb-4" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" @click="emit('update:show', false)">Hủy</v-btn>
        <v-btn color="primary" :disabled="!isFormValid" @click="save">
          Lưu
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  show: Boolean,
  editedQuestion: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(["update:show", "save"]);

const internalShow = computed({
  get: () => props.show,
  set: (val) => emit("update:show", val),
});

const formRef = ref(null);
const isFormValid = ref(true);
const localItem = ref({});
const fileInputRef = ref(null);
const imagePreviewUrl = ref(null);

watch(
  () => props.editedQuestion,
  (val) => {
    localItem.value =
      val && typeof val === "object"
        ? { ...val }
        : { questionType: "text_based" };
    if (val && val.imageUrl) {
      imagePreviewUrl.value =
        typeof val.imageUrl === "string"
          ? val.imageUrl
          : URL.createObjectURL(val.imageUrl);
    } else {
      imagePreviewUrl.value = null;
    }
  },
  { immediate: true }
);

function triggerFileInput() {
  fileInputRef.value && fileInputRef.value.click();
}

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    localItem.value.imageUrl = file;
    imagePreviewUrl.value = URL.createObjectURL(file);
  }
}

async function save() {
  // Validate form
  if (formRef.value && typeof formRef.value.validate === "function") {
    const valid = await formRef.value.validate();
    if (valid === false) return;
  }
  if (
    localItem.value.questionType === "image_based" &&
    !imagePreviewUrl.value
  ) {
    alert("Vui lòng tải ảnh cho câu hỏi!");
    return;
  }
  // Luôn lưu imageUrl là chuỗi URL (blob hoặc link ảnh)
  let data = { ...localItem.value };
  if (data.questionType === "image_based") {
    data.imageUrl = imagePreviewUrl.value || "";
  }
  emit("save", data);
  emit("update:show", false);
}
</script>
