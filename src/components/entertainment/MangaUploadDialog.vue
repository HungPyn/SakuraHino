<template>
  <v-dialog v-model="internalShow" max-width="600px" persistent>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>
          {{ editedChapter ? "Sửa chương" : "Tải lên chương mới" }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="formRef" v-model="isValid">
          <v-text-field
            v-model="form.mangaTitle"
            label="Tên truyện"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-book-open"
          />
          <v-text-field
            v-model="form.chapterNumber"
            label="Số chương"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-numeric"
            type="number"
          />
          <v-text-field
            v-model="form.level"
            label="Level"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-grade"
          />
          <v-file-input
            v-model="filePages"
            label="Trang truyện"
            accept="image/*"
            prepend-icon="mdi-image"
            multiple
            :rules="[editedChapter ? [] : rules.required]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" @click="close">Hủy</v-btn>
        <v-btn color="primary" :disabled="!isValid" @click="save">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  show: Boolean,
  editedChapter: Object,
  isSaving: Boolean,
});
const emit = defineEmits(["update:show", "save"]);

// Dùng biến nội bộ để đồng bộ v-model với prop show
const internalShow = computed({
  get: () => props.show,
  set: (val) => emit("update:show", val),
});

const formRef = ref(null);
const isValid = ref(false);
const form = ref({
  mangaTitle: "",
  chapterNumber: 1,
  level: "",
  pages: [],
});
const filePages = ref([]);

const rules = {
  required: (v) => !!v || "Bắt buộc",
};

// Khi sửa, giữ nguyên pages (đã có imageUrl); khi thêm mới, reset
watch(
  () => props.editedChapter,
  (val) => {
    if (val) {
      // Đảm bảo mỗi page đều có imageUrl là chuỗi
      form.value = {
        ...val,
        pages: (val.pages || []).map((p) => ({
          ...p,
          imageUrl: typeof p.imageUrl === "string" ? p.imageUrl : "",
          subtitleJP: p.subtitleJP || "",
          subtitleVI: p.subtitleVI || "",
        })),
      };
      filePages.value = [];
    } else {
      form.value = {
        mangaTitle: "",
        chapterNumber: 1,
        level: "",
        pages: [],
      };
      filePages.value = [];
    }
  },
  { immediate: true }
);

const close = () => emit("update:show", false);

const save = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  let pages = [];
  if (filePages.value && filePages.value.length > 0) {
    // Nếu upload file mới, tạo pages mới từ file
    pages = filePages.value.map((file) => ({
      imageUrl: URL.createObjectURL(file),
      subtitleJP: "",
      subtitleVI: "",
    }));
  } else if (form.value.pages && form.value.pages.length > 0) {
    // Nếu sửa, giữ nguyên pages cũ (đảm bảo có imageUrl)
    pages = form.value.pages.map((p) => ({
      ...p,
      imageUrl: typeof p.imageUrl === "string" ? p.imageUrl : "",
      subtitleJP: p.subtitleJP || "",
      subtitleVI: p.subtitleVI || "",
    }));
  }

  // Log kiểm tra
  console.log("pages to save:", pages);

  emit("save", {
    ...form.value,
    pages,
  });
  close();
};
</script>
