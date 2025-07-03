<template>
  <v-dialog v-model="internalShow" max-width="700px" persistent>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Phụ đề song ngữ cho từng trang</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-row v-for="(page, idx) in localPages" :key="idx" class="mb-4">
            <v-col cols="12" md="4">
              <v-img
                :src="page.imageUrl"
                height="120"
                max-width="80"
                class="mx-auto rounded-lg elevation-2"
                contain
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-icon size="48">mdi-image-off</v-icon>
                  </v-row>
                </template>
              </v-img>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="page.subtitleJP"
                label="Phụ đề tiếng Nhật"
                prepend-inner-icon="mdi-alphabetical"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="page.subtitleVI"
                label="Phụ đề tiếng Việt"
                prepend-inner-icon="mdi-alphabetical-variant"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" @click="close">Hủy</v-btn>
        <v-btn color="primary" @click="save">Lưu phụ đề</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
const props = defineProps({
  show: Boolean,
  chapter: Object,
});
const emit = defineEmits(["update:show", "save"]);

const internalShow = computed({
  get: () => props.show,
  set: (val) => emit("update:show", val),
});

const localPages = ref([]);

// Khi chapter thay đổi, copy dữ liệu sang localPages
watch(
  () => props.chapter,
  (val) => {
    // In rõ từng page
    if (val?.pages) {
      console.log("chapter.pages:");
      val.pages.forEach((p, i) => {
        console.log(`Page ${i}:`, p);
      });
    }
    localPages.value = val?.pages
      ? val.pages.map((p) => ({
          ...p,
          subtitleJP: p.subtitleJP || "",
          subtitleVI: p.subtitleVI || "",
        }))
      : [];
    // In rõ từng localPage
    if (localPages.value.length) {
      console.log("localPages:");
      localPages.value.forEach((p, i) => {
        console.log(`LocalPage ${i}:`, p);
      });
    }
  },
  { immediate: true }
);

const close = () => emit("update:show", false);
const save = () => {
  emit("save", {
    ...props.chapter,
    pages: localPages.value,
  });
  close();
};
</script>
